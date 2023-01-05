import { Ball } from '../model/Ball';
import { GameRules } from '../rules';
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

export function handleBallLeftPaddleCollision(ball: Ball, player: Player) {
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

export function handleBallRightPaddleCollision(ball: Ball, player: Player) {
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
  }
}
