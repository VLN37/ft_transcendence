import { Ball } from './model/Ball';
import { GameRules } from './model/GameRules';

export const checkBallCollision = (ball: Ball, rules: GameRules) => {
  if (
    (ball.position.y >= rules.bottomCollisionEdge && ball.velocity.y > 0) ||
    (ball.position.y < rules.topCollisionEdge && ball.velocity.y < 0)
  ) {
    ball.velocity.y = -ball.velocity.y;
  }
  if (
    (ball.position.x >= rules.rightCollisionEdge && ball.velocity.x > 0) ||
    (ball.position.x < rules.leftCollisionEdge && ball.velocity.x < 0)
  ) {
    ball.velocity.x = -ball.velocity.x;
  }
};
