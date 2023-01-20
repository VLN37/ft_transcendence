import p5Types from 'p5';
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

export const drawPaddle = (image: p5Types.Graphics, rPlayer: Paddle) => {
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
  image.textAlign('center');
  image.fill(255, 255, 255);
  image.stroke(getPlayerColor(PlayerSide.LEFT, image));
  image.text(leftScore.toString(), middle - offset, 40);
  image.stroke(getPlayerColor(PlayerSide.RIGHT, image));
  image.text(rightScore.toString(), middle + offset, 40);
  image.pop();
};

export const drawPlayerProfilePicture = (
  image: p5Types.Graphics,
  playerPic: p5Types.Image,
  side: PlayerSide,
  rules: GameRules,
) => {
  if (!playerPic) return;
  image.push();
  const middle = rules.worldWidth / 2;
  let xPosition: number;
  if (side === PlayerSide.LEFT) {
    xPosition = middle - 200;
  } else {
    xPosition = middle + 200;
  }
  image.image(playerPic, xPosition - 15, 15, 30, 30);
  image.pop();
};

export const drawPlayerNickname = (
  image: p5Types.Graphics,
  nickname: string,
  side: PlayerSide,
  rules: GameRules,
) => {
  image.push();
  image.fill(230);
  image.stroke(100, 200, 250);
  image.textSize(14);
  const middle = rules.worldWidth / 2;
  let xPosition: number;
  if (side === PlayerSide.LEFT) {
    image.textAlign('right');
    xPosition = middle - 250;
  } else {
    image.textAlign('left');
    xPosition = middle + 250;
  }
  image.text(nickname, xPosition - 15, 30, 30, 30);
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
  const posY = rules.worldHeight - 30;
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

export const drawMiddleNet = (image: p5Types.Graphics, rules: GameRules) => {
  image.push();
  const middle = rules.worldWidth / 2;
  image.stroke(180);
  image.strokeWeight(7);
  image.line(middle, 0, middle, rules.worldHeight);
  image.pop();
};

export const drawPowerUp = (image: p5Types.Graphics, powerup: PowerUp) => {
  image.push();
  image.fill(50, 255, 50);
  image.circle(powerup.x, powerup.y, 20);
  image.pop();
};

export const drawTimer = (
  image: p5Types.Graphics,
  finish: Date,
  rules: GameRules,
) => {
  const now = Date.now();

  const end = new Date(finish).getTime();

  let remaining = 0;
  if (now < end) remaining = (end - now) / 1000;
  image.push();

  if (remaining < 7) image.fill(250, 0, 0);
  else image.fill(255, 150, 30);

  image.stroke(200, 42, 10);
  image.strokeWeight(4);
  image.textSize(62);
  const timeStr = remaining.toFixed(0).padStart(2, '0');
  const width = image.textWidth(timeStr);
  image.text(timeStr, rules.worldWidth / 2 - width / 2, 50);
  image.pop();
};

export const drawCallToAction = (
  image: p5Types.Graphics,
  text: string,
  rules: GameRules,
) => {
  image.push();
  image.textSize(80);
  const centerX = rules.worldWidth / 2;
  const centerY = rules.worldHeight / 2;
  const sizeX = image.textWidth(text);
  const sizeY = image.textSize();
  image.text(text, centerX - sizeX / 2, centerY - sizeY / 2);
  image.pop();
};
