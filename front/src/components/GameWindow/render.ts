import p5Types from 'p5';
import { Point } from '../../game/math/Point';
import { Ball } from '../../game/model/Ball';
import { GameRules } from '../../game/model/GameRules';
import { Paddle, PlayerSide } from '../../game/model/Paddle';
import { PowerUp } from '../../game/model/PowerUp';

const getPlayerColor = (side: PlayerSide, image: p5Types.Graphics) => {
  let color: p5Types.Color;
  if (side == PlayerSide.LEFT) {
    color = image.color(50, 100, 200);
  } else {
    color = image.color(200, 100, 50);
  }
  return color;
};

const getPaddleQuadCoordinates = (paddle: Paddle) => {
  const halfWidth = paddle.width / 2;
  const halfHeight = paddle.height / 2;

  if (paddle.side === PlayerSide.LEFT) {
    return {
      x1: paddle.x - halfWidth,
      y1: paddle.y - halfHeight + paddle.width,
      x2: paddle.x + halfWidth,
      y2: paddle.y - halfHeight,
      x3: paddle.x + halfWidth,
      y3: paddle.y + halfHeight,
      x4: paddle.x - halfWidth,
      y4: paddle.y + halfHeight - paddle.width,
    };
  } else {
    return {
      x1: paddle.x - halfWidth,
      y1: paddle.y - halfHeight,
      x2: paddle.x + halfWidth,
      y2: paddle.y - halfHeight + paddle.width,
      x3: paddle.x + halfWidth,
      y3: paddle.y + halfHeight - paddle.width,
      x4: paddle.x - halfWidth,
      y4: paddle.y + halfHeight,
    };
  }
};

export const drawPlayer = (image: p5Types.Graphics, rPlayer: Paddle) => {
  if (rPlayer.isInverted) image.filter(image.INVERT);
  image.fill(getPlayerColor(rPlayer.side, image));
  const c = getPaddleQuadCoordinates(rPlayer);
  image.quad(c.x1, c.y1, c.x2, c.y2, c.x3, c.y3, c.x4, c.y4);
  if (rPlayer.isInverted) image.filter(image.INVERT);
};

export const drawBall = (image: p5Types.Graphics, ball: Ball) => {
  image.fill(100, 80, 150);
  image.colorMode(image.RGB, 255);
  image.rect(
    ball.position.x - ball.width / 2,
    ball.position.y - ball.height / 2,
    ball.width,
    ball.height,
  );
};

export const drawScores = (
  image: p5Types.Graphics,
  leftScore: number,
  rightScore: number,
  rules: GameRules,
) => {
  const middle = rules.worldWidth / 2;
  const offset = 150;
  image.push();
  image.strokeWeight(4);
  image.textSize(32);
  image.fill(255, 255, 255);
  image.stroke(getPlayerColor(PlayerSide.LEFT, image));
  image.text(leftScore.toString(), middle - offset, 40);
  image.stroke(getPlayerColor(PlayerSide.RIGHT, image));
  image.text(rightScore.toString(), middle + offset, 40);
  image.pop();
};

let totalTime = 0;
let pxPerSecond = 0;
let frameCount = 0;
let fps = 0;
let distanceCounter = 0;
let deltaSpeed = 0;
let ballLastPos: Point;
export const printFps = (image: p5Types.Graphics, ball: Ball) => {
  if (!ballLastPos) ballLastPos = new Point(ball.position.x, ball.position.y);
  const deltaTime = image.deltaTime / 1000;
  const ballSpeed = ball.velocity.mag();
  const distance = Point.subtract(ball.position, ballLastPos).mag();
  distanceCounter += distance;
  ballLastPos.moveTo(ball.position);

  totalTime += deltaTime;
  if (totalTime > 1) {
    totalTime = 0;
    deltaSpeed = ballSpeed * deltaTime;
    fps = frameCount;
    pxPerSecond = distanceCounter;
    distanceCounter = 0;
    frameCount = 0;
  }
  frameCount++;
  image.textSize(18);
  image.fill(40, 132, 183);
  image.text('fps: ' + fps.toFixed(2), 50, 40);
  image.text('ball target speed: ' + ballSpeed.toFixed(2), 50, 60);
  image.text('ball delta speed: ' + deltaSpeed.toFixed(2), 50, 80);
  image.text('ball distance in last 1s: ' + pxPerSecond.toFixed(2), 50, 100);
};

export const drawBallVelocity = (image: p5Types.Graphics, ball: Ball) => {
  image.push();
  image.stroke(255, 100, 255);
  image.fill('green');
  image.strokeWeight(2);
  const line = {
    x: ball.velocity.x / 10,
    y: ball.velocity.y / 10,
  };
  image.translate(ball.position.x, ball.position.y);
  image.line(0, 0, line.x, line.y);
  image.rotate(ball.velocity.heading());
  let arrowSize = 7;
  image.translate(ball.velocity.mag() * ball.width * 2 - arrowSize, 0);
  image.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  image.pop();
};

export const drawSpeedMeter = (
  image: p5Types.Graphics,
  ball: Ball,
  rules: GameRules,
) => {
  image.push();
  image.rectMode('corner');
  image.fill(0);
  image.stroke(230, 150, 23);
  const ballSpeed = ball.velocity.mag();
  const middle = rules.worldWidth / 2;
  const posX = middle - 85;
  const posY = 25;
  const width = 170;
  const height = 10;
  const speedRatio = ballSpeed / rules.ball.maxSpeed;
  image.rect(posX, posY, width, height);
  image.stroke(0);
  // red-shift color when the ball has higher speeds
  image.fill(speedRatio * 255, 255 - speedRatio * 200, 13);
  image.rect(posX + 1, posY + 1, speedRatio * width, height - 2);
  image.text(ballSpeed.toFixed(2) + 'u/s', posX + width + 10, posY + height);
  image.pop();
};

export const drawBallCoords = (image: p5Types.Graphics, ball: Ball) => {
  image.push();
  image.stroke(110, 150, 230);
  image.text(`ball:\nx: ${ball.position.x}\ny:${ball.position.y}`, 30, 120);
  image.pop();
};

export const drawMiddleNet = (image: p5Types.Graphics, rules: GameRules) => {
  image.push();
  const middle = rules.worldWidth / 2;
  image.stroke(180);
  image.strokeWeight(7);
  image.line(middle, 0, middle, rules.worldHeight);
  // const size = 150;
  // image.line(middle - size, 0, middle + size, 0);
  // image.line(middle - size, 0, middle + size, rules.worldHeight);
  // image.line(middle + size, 0, middle - size, rules.worldHeight);
  image.pop();
};

export const drawPowerUp = (image: p5Types.Graphics, powerup: PowerUp) => {
  image.push();
  image.fill(50, 255, 50);
  image.circle(powerup.x, powerup.y, 20);
  image.pop();
};
