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
  drawMiddleNet,
  drawPlayer,
  drawPowerUp,
  drawScores,
  drawSpeedMeter,
  printFps,
} from './render';
import {
  handleBallCollision,
  handleBallLeftPaddleCollision,
  handleBallRightPaddleCollision,
} from '../../game/math/collision';
import { handleKeyPress, handleKeyRelease } from '../../game/controls';
import { Box, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { PowerUp } from '../../game/model/PowerUp';
import { applyPowerUp } from '../../game/logic';

export type GameWindowProps = {
  gameApi: GameApi;
  playerSide: PlayerSide | null;
  rules: GameRules;
};

export default (props: GameWindowProps) => {
  let navigate = useNavigate();
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
  leftPlayer.setEnemy(rightPlayer);
  rightPlayer.setEnemy(leftPlayer);
  let leftPlayerScore = 0;
  let rightPlayerScore = 0;

  let currentPowerup: PowerUp | null;

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
    leftPlayerScore = state.pl.score;
    rightPlayerScore = state.pr.score;
  };

  const placePowerUp = (_powerup: PowerUp) => {
    currentPowerup = _powerup;
  };

  const getPlayerPaddle = (side: PlayerSide): Paddle => {
    if (side === leftPlayer.side) return leftPlayer;
    else return rightPlayer;
  };

  const handlePowerupCollected = (_powerup: PowerUp, side: PlayerSide) => {
    const paddle = getPlayerPaddle(side);
    console.log(`paddle ${paddle.side} collected powerup ${_powerup.name}`);
    applyPowerUp(paddle, _powerup, rules);
    currentPowerup = null;
  };

  gameApi.setOnMatchTickListener(listenGameState);
  gameApi.setOnPowerUpSpawnListener(placePowerUp);
  gameApi.setOnPowerUpCollectedListener(handlePowerupCollected);

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
    handleBallLeftPaddleCollision(ball, leftPlayer, rules);
    handleBallRightPaddleCollision(ball, rightPlayer, rules);
  };

  const render = (p5: p5Types) => {
    image.background(0);
    drawMiddleNet(image, rules);
    drawBall(image, ball);
    // drawBallVelocity(image, ball);
    drawPlayer(image, rightPlayer);
    drawPlayer(image, leftPlayer);
    drawScores(image, leftPlayerScore, rightPlayerScore);
    drawSpeedMeter(image, ball, rules);
    resizeIfNecessary(p5);
    printFps(image, ball);
    if (currentPowerup) drawPowerUp(image, currentPowerup);
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
    if (props.playerSide) {
      handleKeyPress(p5, gameApi);
    }
  };

  const onKeyRelease = (p5: p5Types) => {
    if (props.playerSide) {
      handleKeyRelease(p5, gameApi);
    }
  };

  return (
    <Box>
      <Sketch
        setup={setup}
        draw={draw}
        keyPressed={onKeyPress}
        keyReleased={onKeyRelease}
      />
      <Button onClick={() => navigate('/')}>Return to home</Button>
    </Box>
  );
};
