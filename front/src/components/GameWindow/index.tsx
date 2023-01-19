import Sketch from 'react-p5';
import p5Types from 'p5';
import { Ball } from '../../game/model/Ball';
import { MatchState } from '../../game/model/MatchState';
import { Paddle, PlayerSide } from '../../game/model/Paddle';
import { GameApi } from '../../services/gameApi';
import { GameRules } from '../../game/model/GameRules';
import {
  drawBall,
  drawMiddleNet,
  drawPaddle,
  drawPlayerNickname,
  drawPlayerProfilePicture,
  drawPowerUp,
  drawScores,
  drawSpeedMeter,
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
import { useEffect } from 'react';
import { Match } from '../../models/Match';

export type GameWindowProps = {
  gameApi: GameApi;
  matchInfo: Match;
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

  let leftPaddle = new Paddle(PlayerSide.LEFT, rules);
  let rightPaddle = new Paddle(PlayerSide.RIGHT, rules);
  leftPaddle.setEnemy(rightPaddle);
  rightPaddle.setEnemy(leftPaddle);
  let leftPlayerScore = 0;
  let rightPlayerScore = 0;

  let leftPic: p5Types.Image;
  let rightPic: p5Types.Image;

  let currentPowerup: PowerUp | null;

  const preload = (p5: p5Types) => {
    const baseUrl = process.env.REACT_APP_BACK_HOSTNAME;
    let avatarPath = baseUrl + props.matchInfo.left_player.profile.avatar_path;
    leftPic = p5.loadImage(avatarPath);

    avatarPath = baseUrl + props.matchInfo.right_player.profile.avatar_path;
    rightPic = p5.loadImage(avatarPath);
  };

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

    leftPaddle.y = state.pl.y;
    rightPaddle.y = state.pr.y;
    leftPaddle.state = state.pl.state;
    rightPaddle.state = state.pr.state;
    leftPlayerScore = state.pl.score;
    rightPlayerScore = state.pr.score;
  };

  const placePowerUp = (_powerup: PowerUp) => {
    currentPowerup = _powerup;
  };

  const getPaddle = (side: PlayerSide): Paddle => {
    if (side === leftPaddle.side) return leftPaddle;
    else return rightPaddle;
  };

  const handlePowerupCollected = (_powerup: PowerUp, side: PlayerSide) => {
    const paddle = getPaddle(side);
    applyPowerUp(paddle, _powerup, rules);
    currentPowerup = null;
  };
  useEffect(() => {
    gameApi.setOnMatchTickListener(listenGameState);
    gameApi.setOnPowerUpSpawnListener(placePowerUp);
    gameApi.setOnPowerUpCollectedListener(handlePowerupCollected);
    return () => gameApi.unsubscribeAllListeners();
  }, []);

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

    updateWindowProportions();
    p5.resizeCanvas(gameWindow.width, gameWindow.height);
  };

  const handleInput = () => {};

  const updateWorld = () => {
    const deltaTime = image.deltaTime / 1000;
    ball.update(deltaTime);
    leftPaddle.update(deltaTime);
    rightPaddle.update(deltaTime);
  };

  const processGameLogic = () => {};

  const handleCollisions = () => {
    handleBallCollision(ball, rules);
    handleBallLeftPaddleCollision(ball, leftPaddle, rules);
    handleBallRightPaddleCollision(ball, rightPaddle, rules);
  };

  const render = (p5: p5Types) => {
    image.background(0);
    drawMiddleNet(image, rules);
    drawBall(image, ball);
    // drawBallVelocity(image, ball);
    drawPaddle(image, rightPaddle);
    drawPaddle(image, leftPaddle);
    drawScores(image, leftPlayerScore, rightPlayerScore, rules);
    drawSpeedMeter(image, ball, rules);
    resizeIfNecessary(p5);

    const leftNick = props.matchInfo.left_player.profile.nickname;
    const rightNick = props.matchInfo.right_player.profile.nickname;
    drawPlayerProfilePicture(image, leftPic, PlayerSide.LEFT, rules);
    drawPlayerProfilePicture(image, rightPic, PlayerSide.RIGHT, rules);

    drawPlayerNickname(image, leftNick, PlayerSide.LEFT, rules);
    drawPlayerNickname(image, rightNick, PlayerSide.RIGHT, rules);
    if (currentPowerup) drawPowerUp(image, currentPowerup);
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
        preload={preload}
        setup={setup}
        draw={draw}
        keyPressed={onKeyPress}
        keyReleased={onKeyRelease}
      />
      <Button onClick={() => navigate('/')}>Return to home</Button>
    </Box>
  );
};
