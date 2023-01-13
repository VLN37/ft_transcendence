import { Ball } from '../model/Ball';
import { GameRules } from '../model/GameRules';
import { Paddle } from '../model/Paddle';
import { degToRad } from './utils';

export function handleBallCollision(ball: Ball, rules: GameRules) {
  if (
    (ball.position.x < rules.leftCollisionEdge && ball.velocity.x < 0) ||
    (ball.position.x > rules.rightCollisionEdge && ball.velocity.x > 0)
  ) {
    ball.velocity.x *= -1;
  } else if (
    (ball.position.y < rules.topCollisionEdge && ball.velocity.y < 0) ||
    (ball.position.y > rules.bottomCollisionEdge && ball.velocity.y > 0)
  ) {
    ball.velocity.y *= -1;
  }
}

export function handleBallLeftPaddleCollision(
  ball: Ball,
  player: Paddle,
  rules: GameRules,
) {
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
  }
}

export function handleBallRightPaddleCollision(
  ball: Ball,
  player: Paddle,
  rules: GameRules,
) {
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
    const newAngle = getAngle(ball, player, rules);
    ball.velocity.rotateTo(newAngle);
  }
}

const getAngle = (ball: Ball, paddle: Paddle, rules: GameRules): number => {
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
