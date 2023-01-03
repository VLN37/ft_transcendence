import Sketch from 'react-p5';
import p5Types from 'p5';
import { Ball } from '../../game/model/Ball';
import { MatchState } from '../../game/model/MatchState';
import { Player, PlayerSide } from '../../game/model/Player';
import { MatchApi } from '../../services/matchApi';
import { GameRules } from '../../game/model/GameRules';
import {
  drawBall,
  drawBallVelocity,
  drawPlayer,
  drawSpeedMeter,
  printFps,
} from './render';
import {
  handleBallCollision,
  handleBallPaddleCollision,
} from '../../game/collisions';
import { Vector } from '../../game/math/Vector';

export type GameWindowProps = {
  matchApi: MatchApi;
  rules: GameRules;
};

export default (props: GameWindowProps) => {
  const { matchApi, rules } = props;

  const gameWindow = {
    width: 500,
    height: 500,
  };

  let lastWindowWidth = -1;
  let lastWindowHeight = -1;
  let image: p5Types.Graphics;

  let ball = new Ball(rules);
  let leftPlayer = new Player(PlayerSide.LEFT, rules);
  let rightPlayer = new Player(PlayerSide.RIGHT, rules);

  ball.speed = 300;
  // ball.velocity = p5Types.Vector.random2D().normalize();
  ball.velocity = new Vector(7, 1);

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

  const updateWorld = () => {
    ball.update(image.deltaTime);
  };

  const processGameLogic = () => {};

  const handleCollisions = () => {
    handleBallCollision(ball, rules);
    handleBallPaddleCollision(ball, leftPlayer, rules);
    handleBallPaddleCollision(ball, rightPlayer, rules);
  };

  const render = (p5: p5Types) => {
    image.background(0);
    drawBall(image, ball);
    drawBallVelocity(image, ball);
    drawPlayer(image, rightPlayer, rules);
    drawPlayer(image, leftPlayer, rules);
    drawSpeedMeter(image, ball, rules);
    resizeIfNecessary(p5);
    printFps(image, ball);
    p5.image(image, 0, 0, p5.width, p5.height);
  };

  const draw = (p5: p5Types) => {
    if (!image) image = p5.createGraphics(rules.worldWidth, rules.worldHeight);
    if (p5.deltaTime > 500) p5.deltaTime = 500;
    handleInput();
    processGameLogic();

    updateWorld();

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
