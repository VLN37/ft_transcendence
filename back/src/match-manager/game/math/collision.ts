import { Ball } from '../model/Ball';
import { GameRules } from '../rules';
import { Paddle } from '../model/Paddle';
import { radToDeg } from 'src/utils/functions/math';

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

export function handleBallLeftPaddleCollision(ball: Ball, player: Paddle) {
  if (ball.getLeftBorder() > player.getRightBorder() || ball.velocity.x > 0)
    return;

  if (
    ball.getLowerBorder() >= player.getUpperBorder() &&
    ball.getUpperBorder() <= player.getLowerBorder()
  ) {
    const penetrationDepth = player.getRightBorder() - ball.getLeftBorder();
    if (penetrationDepth > player.width) {
      return;
    }
    ball.velocity.x *= -1;
    increaseBallSpeed(ball);
  }
}

export function handleBallRightPaddleCollision(ball: Ball, player: Paddle) {
  if (ball.getRightBorder() < player.getLeftBorder() || ball.velocity.x < 0)
    return;

  if (
    ball.getLowerBorder() >= player.getUpperBorder() &&
    ball.getUpperBorder() <= player.getLowerBorder()
  ) {
    const penetrationDepth = ball.getRightBorder() - player.getLeftBorder();
    if (penetrationDepth > player.width) {
      return;
    }
    ball.position.x -= penetrationDepth;
    ball.velocity.x *= -1;
    const perturbation = ((Math.random() * 30 - 15) * Math.PI) / 180;
    if (!needsClamping(ball.velocity.heading() + perturbation))
      ball.velocity.rotate(perturbation);

    increaseBallSpeed(ball);
  }
}

const needsClamping = (angle: number): boolean => {
  angle = radToDeg(angle);
  return (angle > 60 && angle < 120) || (angle > 240 && angle < 300);
};

function increaseBallSpeed(ball: Ball) {
  const speed = ball.velocity.mag();
  if (speed < ball.maxSpeed) {
    ball.velocity.mult(1.2);
  } else {
    ball.velocity.normalize().mult(ball.maxSpeed);
  }
}
