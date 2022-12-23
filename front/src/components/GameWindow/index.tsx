import Sketch from 'react-p5';
import p5Types from 'p5';
import { Ball } from '../../game/model/Ball';
import { MatchState } from '../../game/model/MatchState';
import { Player, PlayerSide } from '../../game/model/Player';
import { MatchApi } from '../../services/matchApi';
import { GameRules } from '../../game/model/GameRules';
import { System, Circle, Box } from 'detect-collisions';
import {
  drawBall,
  drawBallVelocity,
  drawLeftPlayer,
  drawRightPlayer,
  drawSpeedMeter,
  printFps,
} from './render';

export type GameWindowProps = {
  matchApi: MatchApi;
  rules: GameRules;
};

function generatePlayerBox(side: PlayerSide, rules: GameRules) {
  let xPos;
  if (side == PlayerSide.LEFT) xPos = rules.player.leftLine;
  else xPos = rules.player.rightLine;

  const position = {
    x: xPos,
    y: rules.player.startingPosition,
  };

  return new Box(position, rules.player.width, rules.player.height);
}

export default (props: GameWindowProps) => {
  const { matchApi, rules } = props;

  const gameWindow = {
    width: 500,
    height: 500,
  };

  let lastWindowWidth = -1;
  let lastWindowHeight = -1;
  let image: p5Types.Graphics;
  let gBall = new Circle(rules.ball.startingPosition, rules.ball.radius);

  let lPlayer = generatePlayerBox(PlayerSide.LEFT, rules);
  let rPlayer = generatePlayerBox(PlayerSide.RIGHT, rules);
  let gWorld = new System();
  gWorld.insert(lPlayer);
  gWorld.insert(rPlayer);
  gWorld.insert(gBall);

  let topWall = gWorld.createLine(
    { x: 0, y: 0 },
    { x: rules.worldWidth, y: 0 },
  );
  let bottomWall = gWorld.createLine(
    { x: 0, y: rules.worldHeight },
    { x: rules.worldWidth, y: rules.worldHeight },
  );
  let leftWall = gWorld.createLine(
    { x: 0, y: 0 },
    { x: 0, y: rules.worldHeight },
  );
  let rightWall = gWorld.createLine(
    { x: rules.worldWidth, y: 0 },
    { x: rules.worldWidth, y: rules.worldHeight },
  );

  let ball: Ball;
  let leftPlayer: Player;
  let rightPlayer: Player;

  ball = new Ball(rules.ball.radius, rules.ball.startingPosition);
  leftPlayer = new Player(PlayerSide.LEFT, rules.player.startingPosition);
  rightPlayer = new Player(PlayerSide.RIGHT, rules.player.startingPosition);

  ball.speed = 300;
  ball.velocity = p5Types.Vector.random2D().normalize();
  // ball.velocity = new p5Types.Vector();
  // ball.velocity.x = 1;

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    updateWindowProportions();
    image = p5.createGraphics(rules.worldWidth, rules.worldHeight);
    p5.createCanvas(gameWindow.width, gameWindow.height).parent(
      canvasParentRef,
    );
    p5.frameRate(60);
  };

  const listenGameState = (state: MatchState) => {
    ball.speed = state.ball.speed;

    ball.position.x = state.ball.pos.x;
    ball.position.y = state.ball.pos.y;
    ball.velocity.x = state.ball.dir.x;
    ball.velocity.y = state.ball.dir.y;

    leftPlayer.y = state.pl;
    rightPlayer.y = state.pr;
  };

  matchApi.setOnMatchTickListener(listenGameState);

  const updateWindowProportions = () => {
    let currentWidth = window.innerWidth;
    let currentHeight = window.innerHeight;
    lastWindowWidth = currentWidth;
    lastWindowHeight = currentHeight;

    if (currentHeight * rules.whRatio > currentWidth) {
      currentHeight = currentWidth / rules.whRatio;
    } else {
      currentWidth = currentHeight * rules.whRatio;
    }
    gameWindow.width = currentWidth;
    gameWindow.height = currentHeight;
  };

  const resizeIfNecessary = (p5: p5Types) => {
    if (
      window.innerWidth == lastWindowWidth &&
      window.innerHeight == lastWindowHeight
    )
      return;
    console.log(`resizing window to ${p5.windowWidth}x${p5.windowHeight}`);

    updateWindowProportions();
    p5.resizeCanvas(gameWindow.width, gameWindow.height);
  };

  const handleInput = () => {};

  const processGameLogic = () => {
    ball.update(image.deltaTime);
    gBall.setPosition(ball.position.x, ball.position.y);
  };

  const handleCollisions = () => {
    gWorld.checkOne(gBall, (response: SAT.Response) => {
      switch (response.b) {
        case topWall:
        case bottomWall:
          ball.velocity.y *= -1;
          break;
        case leftWall:
        case rightWall:
          ball.velocity.x *= -1;
          break;
      }
    });
  };

  const render = (p5: p5Types) => {
    image.background(0);
    drawBall(image, gBall);
    drawBallVelocity(image, ball);
    drawRightPlayer(image, rPlayer);
    drawLeftPlayer(image, lPlayer);
    drawSpeedMeter(image, ball, rules);
    resizeIfNecessary(p5);
    // gWorld.update();
    // checkBallCollision(ball, rules);
    printFps(image, ball);
    p5.image(image, 0, 0, p5.width, p5.height);
  };

  const draw = (p5: p5Types) => {
    if (!image) image = p5.createGraphics(rules.worldWidth, rules.worldHeight);
    handleInput();
    processGameLogic();

    gWorld.update();

    handleCollisions();
    render(p5);
  };

  const onKeyPress = (p5: p5Types) => {
    if (p5.keyCode == p5.UP_ARROW || p5.key.toLowerCase() == 'w') {
      console.log('key up pressed');
    } else if (p5.keyCode == p5.DOWN_ARROW || p5.key.toLowerCase() == 's') {
      console.log('key down pressed');
    }
  };

  const onKeyRelease = (p5: p5Types) => {
    if (p5.keyCode == p5.UP_ARROW || p5.key.toLowerCase() == 'w') {
      console.log('key up released');
    } else if (p5.keyCode == p5.DOWN_ARROW || p5.key.toLowerCase() == 's') {
      console.log('key down released');
    }
  };

  return (
    <Sketch
      setup={setup}
      draw={draw}
      keyPressed={onKeyPress}
      keyReleased={onKeyRelease}
    />
  );
};
