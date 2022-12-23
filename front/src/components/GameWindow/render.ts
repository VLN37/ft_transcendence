import { Box, Circle } from 'detect-collisions';
import p5Types from 'p5';
import { Ball } from '../../game/model/Ball';
import { GameRules } from '../../game/model/GameRules';

export const drawRightPlayer = (world: p5Types.Graphics, rPlayer: Box) => {
  world.fill(50, 100, 200);
  world.rectMode('center');
  world.rect(rPlayer.x, rPlayer.y, rPlayer.width, rPlayer.height);
};

export const drawLeftPlayer = (world: p5Types.Graphics, lPlayer: Box) => {
  world.fill(240, 100, 30);
  world.rectMode('center');
  world.rect(lPlayer.x, lPlayer.y, lPlayer.width, lPlayer.height);
};

export const drawBall = (world: p5Types.Graphics, gBall: Circle) => {
  world.fill(100, 80, 150);
  world.colorMode(world.RGB, 255);
  const size = gBall.r * 2;
  world.ellipse(gBall.x, gBall.y, size, size);
};

let totalTime = 0;
let pxPerSecond = 0;
let frameCount = 0;
let fps = 0;
let distanceCounter = 0;
let deltaSpeed = 0;
export const printFps = (world: p5Types.Graphics, ball: Ball) => {
  totalTime += world.deltaTime / 1000;
  if (totalTime > 1) {
    totalTime = 0;
    deltaSpeed = (ball.speed * world.deltaTime) / 1000;
    fps = frameCount;
    pxPerSecond = distanceCounter;
    distanceCounter = 0;
    frameCount = 0;
  }
  frameCount++;
  distanceCounter += deltaSpeed;
  world.textSize(18);
  world.fill(40, 132, 183);
  world.text('fps: ' + fps.toFixed(2), 50, 40);
  world.text('ball speed: ' + ball.speed, 50, 60);
  world.text('ball delta speed: ' + deltaSpeed.toFixed(2), 50, 80);
  world.text('ball distance in last 1s: ' + pxPerSecond.toFixed(2), 50, 100);
};

export const drawBallVelocity = (world: p5Types.Graphics, ball: Ball) => {
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

export const drawSpeedMeter = (
  world: p5Types.Graphics,
  ball: Ball,
  rules: GameRules,
) => {
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
