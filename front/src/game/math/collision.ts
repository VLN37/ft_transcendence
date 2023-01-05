import { Ball } from '../model/Ball';
import { GameRules } from '../model/GameRules';
import { Player } from '../model/Player';

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
  player: Player,
  rules: GameRules,
) {
  if (ball.getLeftBorder() > player.getRightBorder()) return;

  if (
    ball.getLowerBorder() >= player.getUpperBorder() &&
    ball.getUpperBorder() <= player.getLowerBorder()
  ) {
    ball.velocity.x *= -1;
  }
}

export function handleBallRightPaddleCollision(
  ball: Ball,
  player: Player,
  rules: GameRules,
) {
  if (ball.getRightBorder() < player.getLeftBorder()) return;

  if (
    ball.getLowerBorder() >= player.getUpperBorder() &&
    ball.getUpperBorder() <= player.getLowerBorder()
  ) {
    ball.velocity.x *= -1;
  }
}
