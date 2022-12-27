import { Vector } from './math/Vector';
import { Ball } from './model/Ball';
import { GameRules } from './model/GameRules';
import { Player } from './model/Player';

export const handleBallCollision = (ball: Ball, rules: GameRules) => {
  let overlapY = 0;
  let overlapX = 0;
  if (ball.position.y < rules.topCollisionEdge) {
    overlapY = ball.position.y - rules.topCollisionEdge;
  } else if (ball.position.y > rules.bottomCollisionEdge) {
    overlapY = ball.position.y - rules.bottomCollisionEdge;
  }
  ball.position.y -= overlapY * 2;
  if (overlapY != 0) {
    ball.velocity.y *= -1;
  }
  if (ball.position.x < rules.leftCollisionEdge) {
    overlapX = ball.position.x - rules.leftCollisionEdge;
  } else if (ball.position.x > rules.rightCollisionEdge) {
    overlapX = ball.position.x - rules.rightCollisionEdge;
  }
  if (overlapX != 0) {
    ball.velocity.x *= -1;
  }
  ball.position.x -= overlapX * 2;
};

const getDistance = (ball: Ball, paddle: Player) => {
  const nearestX = Math.max(
    paddle.getX() - paddle.width / 2,
    Math.min(ball.position.x, paddle.getX() + paddle.width / 2),
  );
  const nearestY = Math.max(
    paddle.y - paddle.height / 2,
    Math.min(ball.position.y, paddle.y + paddle.height / 2),
  );
  return new Vector(ball.position.x - nearestX, ball.position.y - nearestY);
};

export const handleBallPaddleCollision = (ball: Ball, player: Player) => {
  const dist = getDistance(ball, player);
  if (dist.x * dist.x + dist.y * dist.y > Math.pow(ball.radius, 2)) {
    return;
  }
  debugger;
  if (ball.velocity.dot(dist) < 0) {
    const dnormal = new Vector(-dist.y, dist.x);

    const normalAngle = Math.atan2(dnormal.y, dnormal.x);
    const incomingAngle = Math.atan2(ball.velocity.y, ball.velocity.x);
    const theta = normalAngle - incomingAngle;

    // FIXME: limit ball angle
    ball.velocity.rotate(2 * theta);
  }

  const penetrationDepth = ball.radius - dist.mag();
  const penetrationVector = dist.normalize().mult(penetrationDepth);
  console.log({ penetrationDepth });
  console.log({ penetrationVector });
  ball.position.subtractVector(dist);
};
