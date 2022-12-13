import Sketch from 'react-p5';
import p5Types from 'p5';
import { Ball } from '../../game/model/Ball';
import { MatchState } from '../../game/model/MatchState';
import { Player, PlayerSide } from '../../game/model/Player';
import { MatchApi } from '../../services/matchApi';
import { GameRules } from '../../game/model/GameRules';
import { checkBallCollision } from '../../game/collisions';

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
  let world: p5Types.Graphics;

  let ball: Ball;
  let leftPlayer: Player;
  let rightPlayer: Player;

  ball = new Ball(rules.ball.radius, rules.ball.startingPosition);
  leftPlayer = new Player(PlayerSide.LEFT, rules.playerStart);
  rightPlayer = new Player(PlayerSide.RIGHT, rules.playerStart);

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    updateWindowProportions();
    world = p5.createGraphics(rules.worldWidth, rules.worldHeight);
    p5.createCanvas(gameWindow.width, gameWindow.height).parent(
      canvasParentRef,
    );
  };

  const listenGameState = (state: MatchState) => {
    ball.speed = state.ball.speed;

    ball.position.x = state.ball.pos.x;
    ball.position.y = state.ball.pos.y;
    ball.velocity.x = state.ball.dir.x;
    ball.velocity.y = state.ball.dir.y;

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

  const drawBall = () => {
    ball.update(world.deltaTime);
    world.fill(100, 80, 150);
    world.colorMode(world.RGB, 255);
    const size = ball.radius * 2;
    world.ellipse(ball.position.x, ball.position.y, size, size);
  };

  let fpsCounter = 0;
  let pxPerSecond = 0;
  let distanceCounter = 0;
  const printFps = () => {
    fpsCounter++;
    if (fpsCounter == 60) {
      fpsCounter = 0;
      pxPerSecond = distanceCounter;
      distanceCounter = 0;
    }
    const deltaSpeed = (ball.speed * world.deltaTime) / 1000;
    distanceCounter += deltaSpeed;
    world.textSize(18);
    world.fill(40, 132, 183);
    world.text('fps: ' + (1000 / world.deltaTime).toFixed(2), 50, 40);
    world.text('ball speed: ' + ball.speed, 50, 60);
    world.text('ball delta speed: ' + deltaSpeed.toFixed(2), 50, 80);
    world.text('ball distance in last 1s: ' + pxPerSecond.toFixed(2), 50, 100);
  };

  const drawBallVelocity = () => {
    world.push();
    world.stroke(255, 100, 255);
    world.fill('green');
    world.strokeWeight(2);
    const line = {
      x: ball.velocity.x * ball.radius * 2,
      y: ball.velocity.y * ball.radius * 2,
    };
    world.translate(ball.position.x, ball.position.y);
    world.line(0, 0, line.x, line.y);
    world.rotate(ball.velocity.heading());
    let arrowSize = 7;
    world.translate(ball.velocity.mag() * ball.radius * 2 - arrowSize, 0);
    world.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    world.pop();
  };

  let fillMeter = 0;
  const drawRuler = () => {
    world.push();
    world.rectMode('corner');
    world.fill(0);
    world.stroke(230, 150, 23);
    const posX = 250;
    const posY = 10;
    const width = 250;
    const height = 15;
    world.rect(posX, posY, width, height);
    world.fill(230, 200, 53);
    fillMeter += (ball.speed * world.deltaTime) / 1000;
    world.rect(posX + 1, posY + 1, fillMeter, height - 2);
    if (fillMeter > width - 2) fillMeter = 0;
    world.pop();
  };

  const drawSpeedMeter = () => {
    world.push();
    world.rectMode('corner');
    world.fill(0);
    world.stroke(230, 150, 23);
    const posX = 250;
    const posY = 30;
    const width = 250;
    const height = 15;
    const speedRatio = ball.speed / rules.ball.maxSpeed;
    world.rect(posX, posY, width, height);
    world.stroke(0);
    world.fill(speedRatio * 255, 255 - speedRatio * 200, 13);
    world.rect(posX + 1, posY + 1, speedRatio * width, height - 2);
    world.text(ball.speed + 'px/s', posX + width + 10, posY + height);
    world.pop();
  };

  const draw = (p5: p5Types) => {
    resizeIfNecessary(p5);
    world.background(0);
    checkBallCollision(ball, rules);
    printFps();
    drawBall();
    drawBallVelocity();
    drawRightPlayer();
    drawLeftPlayer();
    drawRuler();
    drawSpeedMeter();
    p5.image(world, 0, 0, p5.width, p5.height);
  };

  return <Sketch setup={setup} draw={draw} />;
};
