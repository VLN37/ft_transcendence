import Sketch from 'react-p5';
import p5Types from 'p5';
import { Ball } from './model/Ball';
import { MatchState } from './model/MatchState';
import { Player, PlayerSide } from './model/Player';
import { MatchApi } from '../../services/matchApi';

const BALL_RADIUS = 20;

export type Tuple = {
  x: number;
  y: number;
};

export type GameRules = {
  worldWidth: number;
  worldHeight: number;
  whRatio: number;
  ballStart: {
    position: Tuple;
    speed: number;
  };
  playerStart: number;
  topCollisionEdge: number;
  bottomCollisionEdge: number;
  leftCollisionEdge: number;
  rightCollisionEdge: number;
};

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
  let ball: Ball;
  let leftPlayer: Player;
  let rightPlayer: Player;

  let world: p5Types.Graphics;

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    updateWindowProportions();
    world = p5.createGraphics(rules.worldWidth, rules.worldHeight);
    p5.createCanvas(gameWindow.width, gameWindow.height).parent(
      canvasParentRef,
    );
    ball = new Ball(BALL_RADIUS, rules.ballStart.position);
    leftPlayer = new Player(PlayerSide.LEFT, rules.playerStart);
    rightPlayer = new Player(PlayerSide.RIGHT, rules.playerStart);
  };

  const listenGameState = (state: MatchState) => {
    const speed = state.ball.speed;
    ball.position.x = state.ball.pos.x;
    ball.position.y = state.ball.pos.y;
    ball.velocity.x = state.ball.dir.x * speed * world.deltaTime;
    ball.velocity.y = state.ball.dir.y * speed * world.deltaTime;
    leftPlayer.y = state.p1;
    rightPlayer.y = state.p2;
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

  const worldMouse = (p5: p5Types) => {
    return {
      x: (p5.mouseX * world.width) / gameWindow.width,
      y: (p5.mouseY * world.height) / gameWindow.height,
    };
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

  const drawRightPlayer = () => {
    world.fill(50, 100, 200);
    world.rectMode('center');
    world.rect(world.width - 20, rightPlayer.y, 20, 100);
  };

  const drawLeftPlayer = () => {
    world.fill(240, 100, 30);
    world.rectMode('center');
    world.rect(20, leftPlayer.y, 20, 100);
  };

  const checkBallCollision = () => {
    if (
      ball.position.y >= rules.bottomCollisionEdge ||
      ball.position.y < rules.topCollisionEdge
    ) {
      ball.velocity.y = -ball.velocity.y;
    }
    if (
      ball.position.x >= rules.rightCollisionEdge ||
      ball.position.x < rules.leftCollisionEdge
    ) {
      ball.velocity.x = -ball.velocity.x;
    }
  };

  let x = 0;
  const drawBall = () => {
    // ball.update();
    const xRatio = (ball.position.x / rules.worldWidth) * 255;
    const yRatio = (ball.position.y / rules.worldHeight) * 255;
    world.fill(200 - xRatio, yRatio, xRatio);
    world.colorMode(world.HSL);
    world.fill(x, 80, 50);
    x += 3;
    if (x > 355) x = 0;
    world.colorMode(world.RGB, 255);
    const size = ball.radius * 2;
    world.ellipse(ball.position.x, ball.position.y, size, size);
  };

  const printFps = () => {
    world.textSize(32);
    world.fill(0, 102, 153);
    world.text('fps: ' + Math.round(1000 / world.deltaTime), 50, 50);
  };

  const draw = (p5: p5Types) => {
    resizeIfNecessary(p5);
    world.background(0);
    checkBallCollision();
    printFps();
    drawBall();
    drawRightPlayer();
    drawLeftPlayer();
    p5.image(world, 0, 0, p5.width, p5.height);
  };

  return <Sketch setup={setup} draw={draw} />;
};
