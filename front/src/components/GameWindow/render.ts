import { Box, Circle } from 'detect-collisions';
import p5Types from 'p5';
import { Ball } from '../../game/model/Ball';
import { GameRules } from '../../game/model/GameRules';

export const drawRightPlayer = (image: p5Types.Graphics, rPlayer: Box) => {
  image.fill(50, 100, 200);
  image.rectMode('center');
  image.rect(rPlayer.x, rPlayer.y, rPlayer.width, rPlayer.height);
};

export const drawLeftPlayer = (image: p5Types.Graphics, lPlayer: Box) => {
  image.fill(240, 100, 30);
  image.rectMode('center');
  image.rect(lPlayer.x, lPlayer.y, lPlayer.width, lPlayer.height);
};

export const drawBall = (image: p5Types.Graphics, gBall: Circle) => {
  image.fill(100, 80, 150);
  image.colorMode(image.RGB, 255);
  const size = gBall.r * 2;
  image.ellipse(gBall.x, gBall.y, size, size);
};

let totalTime = 0;
let pxPerSecond = 0;
let frameCount = 0;
let fps = 0;
let distanceCounter = 0;
let deltaSpeed = 0;
export const printFps = (image: p5Types.Graphics, ball: Ball) => {
  totalTime += image.deltaTime / 1000;
  if (totalTime > 1) {
    totalTime = 0;
    deltaSpeed = (ball.speed * image.deltaTime) / 1000;
    fps = frameCount;
    pxPerSecond = distanceCounter;
    distanceCounter = 0;
    frameCount = 0;
  }
  frameCount++;
  distanceCounter += deltaSpeed;
  image.textSize(18);
  image.fill(40, 132, 183);
  image.text('fps: ' + fps.toFixed(2), 50, 40);
  image.text('ball speed: ' + ball.speed, 50, 60);
  image.text('ball delta speed: ' + deltaSpeed.toFixed(2), 50, 80);
  image.text('ball distance in last 1s: ' + pxPerSecond.toFixed(2), 50, 100);
};

export const drawBallVelocity = (image: p5Types.Graphics, ball: Ball) => {
  image.push();
  image.stroke(255, 100, 255);
  image.fill('green');
  image.strokeWeight(2);
  const line = {
    x: ball.velocity.x * ball.radius * 2,
    y: ball.velocity.y * ball.radius * 2,
  };
  image.translate(ball.position.x, ball.position.y);
  image.line(0, 0, line.x, line.y);
  image.rotate(ball.velocity.heading());
  let arrowSize = 7;
  image.translate(ball.velocity.mag() * ball.radius * 2 - arrowSize, 0);
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
  const posX = 250;
  const posY = 30;
  const width = 250;
  const height = 15;
  const speedRatio = ball.speed / rules.ball.maxSpeed;
  image.rect(posX, posY, width, height);
  image.stroke(0);
  image.fill(speedRatio * 255, 255 - speedRatio * 200, 13);
  image.rect(posX + 1, posY + 1, speedRatio * width, height - 2);
  image.text(ball.speed + 'px/s', posX + width + 10, posY + height);
  image.pop();
};
