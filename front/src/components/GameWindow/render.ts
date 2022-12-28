import p5Types from 'p5';
import { Ball } from '../../game/model/Ball';
import { GameRules } from '../../game/model/GameRules';
import { Player, PlayerSide } from '../../game/model/Player';

const getPlayerColor = (side: PlayerSide, image: p5Types.Graphics) => {
  let color: p5Types.Color;
  if (side == PlayerSide.LEFT) {
    color = image.color(50, 100, 200);
  } else {
    color = image.color(200, 100, 50);
  }
  return color;
};

export const drawPlayer = (
  image: p5Types.Graphics,
  rPlayer: Player,
  rules: GameRules,
) => {
  image.fill(getPlayerColor(rPlayer.side, image));
  image.rectMode('center');
  image.rect(rPlayer.x, rPlayer.y, rules.player.width, rules.player.height);
};

export const drawBall = (image: p5Types.Graphics, ball: Ball) => {
  image.fill(100, 80, 150);
  image.colorMode(image.RGB, 255);
  const size = ball.radius * 2;
  image.ellipse(ball.position.x, ball.position.y, size, size);
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
