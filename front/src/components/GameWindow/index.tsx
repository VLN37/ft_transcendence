import Sketch from 'react-p5';
import p5Types from 'p5';
import { Ball } from '../../game/model/Ball';
import { MatchState } from '../../game/model/MatchState';
import { Paddle, PlayerSide } from '../../game/model/Paddle';
import { GameApi } from '../../services/gameApi';
import { GameRules } from '../../game/model/GameRules';
import {
  drawBall,
  drawBallCoords,
  drawBallVelocity,
  drawPlayer,
  drawSpeedMeter,
  printFps,
} from './render';
import {
  handleBallCollision,
  handleBallLeftPaddleCollision,
  handleBallRightPaddleCollision,
} from '../../game/math/collision';
import { PlayerCommand } from '../../game/model/PlayerCommand';

export type GameWindowProps = {
  gameApi: GameApi;
  rules: GameRules;
};

export default (props: GameWindowProps) => {
  const { gameApi, rules } = props;

  const gameWindow = {
    width: 500,
    height: 500,
  };

  let lastWindowWidth = -1;
  let lastWindowHeight = -1;
  let image: p5Types.Graphics;

  let ball = new Ball(rules);

  let leftPlayer = new Paddle(PlayerSide.LEFT, rules);
  let rightPlayer = new Paddle(PlayerSide.RIGHT, rules);

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    updateWindowProportions();
    image = p5.createGraphics(rules.worldWidth, rules.worldHeight);
    p5.createCanvas(gameWindow.width, gameWindow.height).parent(
      canvasParentRef,
    );
  };

  const listenGameState = (state: MatchState) => {
    ball.position.x = state.ball.pos.x;
    ball.position.y = state.ball.pos.y;
    ball.velocity.x = state.ball.vel.x;
    ball.velocity.y = state.ball.vel.y;

    leftPlayer.y = state.pl.y;
    rightPlayer.y = state.pr.y;
    leftPlayer.state = state.pl.state;
    rightPlayer.state = state.pr.state;
  };

  gameApi.setOnMatchTickListener(listenGameState);

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
    const deltaTime = image.deltaTime / 1000;
    ball.update(deltaTime);
    leftPlayer.update(deltaTime);
    rightPlayer.update(deltaTime);
  };

  const processGameLogic = () => {};

  const handleCollisions = () => {
    handleBallCollision(ball, rules);
    handleBallLeftPaddleCollision(ball, leftPlayer);
    handleBallRightPaddleCollision(ball, rightPlayer);
  };

  const render = (p5: p5Types) => {
    image.background(0);
    drawBall(image, ball);
    // drawBallVelocity(image, ball);
    drawPlayer(image, rightPlayer, rules);
    drawPlayer(image, leftPlayer, rules);
    drawSpeedMeter(image, ball, rules);
    resizeIfNecessary(p5);
    printFps(image, ball);
    // drawBallCoords(image, ball);
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

  // TODO: don't send commands if the match haven't started yet
  const onKeyPress = (p5: p5Types) => {
    if (p5.keyCode == p5.UP_ARROW || p5.key.toLowerCase() == 'w') {
      gameApi.issueCommand(PlayerCommand.MOVE_UP);
      console.log('key up pressed');
    } else if (p5.keyCode == p5.DOWN_ARROW || p5.key.toLowerCase() == 's') {
      gameApi.issueCommand(PlayerCommand.MOVE_DOWN);
      console.log('key down pressed');
    }
  };

  const onKeyRelease = (p5: p5Types) => {
    if (p5.keyCode == p5.UP_ARROW || p5.key.toLowerCase() == 'w') {
      console.log('key up released');
      gameApi.issueCommand(PlayerCommand.STOP_MOVE_UP);
    } else if (p5.keyCode == p5.DOWN_ARROW || p5.key.toLowerCase() == 's') {
      console.log('key down released');
      gameApi.issueCommand(PlayerCommand.STOP_MOVE_DOWN);
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
