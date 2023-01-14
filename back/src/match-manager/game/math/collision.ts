import { Ball } from '../model/Ball';
import { GameRules, rules } from '../rules';
import { Paddle } from '../model/Paddle';
import { degToRad, radToDeg } from 'src/utils/functions/math';
import { PowerUp } from 'src/match-manager/model/PowerUps/PowerUp';

export function checkBallGoalCollision(ball: Ball, rules: GameRules): boolean {
  if (
    (ball.position.x <= rules.leftCollisionEdge && ball.velocity.x <= 0) ||
    (ball.position.x >= rules.rightCollisionEdge && ball.velocity.x >= 0)
  ) {
    return true;
  }
  return false;
}

export function handleBallCollision(ball: Ball, rules: GameRules) {
  if (
    (ball.position.y < rules.topCollisionEdge && ball.velocity.y < 0) ||
    (ball.position.y > rules.bottomCollisionEdge && ball.velocity.y > 0)
  ) {
    ball.velocity.y *= -1;
  }
}

export function isBallCollidingPowerUp(ball: Ball, powerup: PowerUp) {
  if (
    ball.position.x < powerup.x + rules.powerUpCollisionRange &&
    ball.position.x > powerup.x - rules.powerUpCollisionRange &&
    ball.position.y < powerup.y + rules.powerUpCollisionRange &&
    ball.position.y > powerup.y - rules.powerUpCollisionRange
  ) {
    return true;
  }
  return false;
}

export function handleBallLeftPaddleCollision(ball: Ball, paddle: Paddle) {
  if (ball.getLeftBorder() > paddle.getRightBorder() || ball.velocity.x > 0)
    return;

  if (
    ball.getLowerBorder() >= paddle.getUpperBorder() &&
    ball.getUpperBorder() <= paddle.getLowerBorder()
  ) {
    const penetrationDepth = paddle.getRightBorder() - ball.getLeftBorder();
    if (penetrationDepth > paddle.width) {
      return;
    }
    ball.velocity.x *= -1;
    const newAngle = getAngle(ball, paddle);
    ball.velocity.rotateTo(newAngle);
    increaseBallSpeed(ball);
    ball.lastTouch = paddle;
  }
}

export function handleBallRightPaddleCollision(ball: Ball, paddle: Paddle) {
  if (ball.getRightBorder() < paddle.getLeftBorder() || ball.velocity.x < 0)
    return;

  if (
    ball.getLowerBorder() >= paddle.getUpperBorder() &&
    ball.getUpperBorder() <= paddle.getLowerBorder()
  ) {
    const penetrationDepth = ball.getRightBorder() - paddle.getLeftBorder();
    if (penetrationDepth > paddle.width) {
      return; // player won't save the ball if it's past him
    }
    ball.position.x -= penetrationDepth;
    ball.velocity.x *= -1;
    const newAngle = getAngle(ball, paddle);
    ball.velocity.rotateTo(newAngle);
    increaseBallSpeed(ball);
    ball.lastTouch = paddle;
  }
}

const getAngle = (ball: Ball, paddle: Paddle): number => {
  const { y: ballY } = ball.position;

  const length = paddle.height + ball.height;
  const angleRangeLength = rules.ball.maxAngle - -rules.ball.maxAngle;

  debugger;
  let result = (ballY - paddle.y) * (angleRangeLength / length); // - rules.ball.maxAngle;

  if (ball.isGoingLeft()) result = 180 - result;
  else if (result < 0) result += 360;
  const newAngle = degToRad(result);
  return newAngle;
};

function increaseBallSpeed(ball: Ball) {
  const speed = ball.velocity.mag();
  if (speed < ball.maxSpeed) {
    ball.velocity.mult(1.1);
  } else {
    ball.velocity.normalize().mult(ball.maxSpeed);
  }
}
