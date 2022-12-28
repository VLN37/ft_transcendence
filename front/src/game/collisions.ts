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
    paddle.x - paddle.width / 2,
    Math.min(ball.position.x, paddle.x + paddle.width / 2),
  );
  const nearestY = Math.max(
    paddle.y - paddle.height / 2,
    Math.min(ball.position.y, paddle.y + paddle.height / 2),
  );
  return new Vector(ball.position.x - nearestX, ball.position.y - nearestY);
};

export const handleBallPaddleCollision = (
  ball: Ball,
  player: Player,
  deltaTime: number,
  rules: GameRules,
) => {
  doBatBall(player, ball, deltaTime, rules);
};

const ballShadow = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
};

//=============================================================================
// THE FUNCTION THAT DOES THE BALL BAT sim.
// the ball and bat are at new position
function doBatBall(
  bat: Player,
  ball: Ball,
  deltaTime: number,
  rules: GameRules,
) {
  var mirrorX = 1;
  var mirrorY = 1;

  const ballDeltaSpeed = (ball.speed * deltaTime) / 1000;
  const ballDelta = {
    x: ball.velocity.x * ballDeltaSpeed,
    y: ball.velocity.y * ballDeltaSpeed,
  };

  const s = ballShadow; // alias
  s.x = ball.position.x;
  s.y = ball.position.y;
  s.dx = ballDelta.x;
  s.dy = ballDelta.y;
  s.x -= s.dx; // set ball where it was last frame
  s.y -= s.dy; // set ball where it was last frame

  // get the bat half width height
  const batW2 = bat.width / 2;
  const batH2 = bat.height / 2;

  // and bat size plus radius of ball
  var batH = batH2 + rules.ball.radius;
  var batW = batW2 + rules.ball.radius;

  // set ball position relative to bats last pos
  s.x -= bat.x;
  s.y -= bat.y;

  // set ball delta relative to bat
  // s.dx -= bat.dx;
  // s.dy -= bat.dy;

  // mirror x and or y if needed
  if (s.x < 0) {
    mirrorX = -1;
    s.x = -s.x;
    s.dx = -s.dx;
  }
  if (s.y < 0) {
    mirrorY = -1;
    s.y = -s.y;
    s.dy = -s.dy;
  }

  // bat now only has a bottom, right sides and bottom right corner
  var distY = batH - s.y; // distance from bottom
  var distX = batW - s.x; // distance from right

  if (s.dx > 0 && s.dy > 0) {
    return;
  } // ball moving away so no hit

  var ballSpeed = Math.sqrt(s.dx * s.dx + s.dy * s.dy); // get ball speed relative to bat

  // get x location of intercept for bottom of bat
  var bottomX = s.x + (s.dx / s.dy) * distY;

  // get y location of intercept for right of bat
  var rightY = s.y + (s.dy / s.dx) * distX;

  // get distance to bottom and right intercepts
  var distB = Math.hypot(bottomX - s.x, batH - s.y);
  var distR = Math.hypot(batW - s.x, rightY - s.y);
  var hit = false;

  if (s.dy < 0 && bottomX <= batW2 && distB <= ballSpeed && distB < distR) {
    // if hit is on bottom and bottom hit is closest
    hit = true;
    s.y = batH - s.dy * ((ballSpeed - distB) / ballSpeed);
    s.dy = -s.dy;
  }
  if (
    !hit &&
    s.dx < 0 &&
    rightY <= batH2 &&
    distR <= ballSpeed &&
    distR <= distB
  ) {
    // if hit is on right and right hit is closest
    hit = true;
    s.x = batW - s.dx * ((ballSpeed - distR) / ballSpeed);
    s.dx = -s.dx;
  }
  if (!hit) {
    // if no hit may have intercepted the corner.
    // find the distance that the corner is from the line segment from the balls pos to the next pos
    const u =
      ((batW2 - s.x) * s.dx + (batH2 - s.y) * s.dy) / (ballSpeed * ballSpeed);

    // get the closest point on the line to the corner
    var cpx = s.x + s.dx * u;
    var cpy = s.y + s.dy * u;

    // get ball radius squared
    const radSqr = Math.pow(rules.ball.radius, 2);

    // get the distance of that point from the corner squared
    const dist = (cpx - batW2) * (cpx - batW2) + (cpy - batH2) * (cpy - batH2);

    // is that distance greater than ball radius
    if (dist > radSqr) {
      return;
    } // no hit

    // solves the triangle from center to closest point on balls trajectory
    var d = Math.sqrt(radSqr - dist) / ballSpeed;

    // intercept point is closest to line start
    cpx -= s.dx * d;
    cpy -= s.dy * d;

    // get the distance from the ball current pos to the intercept point
    d = Math.hypot(cpx - s.x, cpy - s.y);

    // is the distance greater than the ball speed then its a miss
    if (d > ballSpeed) {
      return;
    } // no hit return

    s.x = cpx; // position of contact
    s.y = cpy;

    // find the normalised tangent at intercept point
    const ty = (cpx - batW2) / rules.ball.radius;
    const tx = -(cpy - batH2) / rules.ball.radius;

    // calculate the reflection vector
    const bsx = s.dx / ballSpeed; // normalise ball speed
    const bsy = s.dy / ballSpeed;
    const dot = (bsx * tx + bsy * ty) * 2;

    // get the distance the ball travels past the intercept
    d = ballSpeed - d;

    // the reflected vector is the balls new delta (this delta is normalised)
    s.dx = tx * dot - bsx;
    s.dy = ty * dot - bsy;

    // move the ball the remaining distance away from corner
    s.x += s.dx * d;
    s.y += s.dy * d;

    // set the ball delta to the balls speed
    s.dx *= ballSpeed;
    s.dy *= ballSpeed;
    hit = true;
  }

  // if the ball hit the bat restore absolute position
  if (hit) {
    // reverse mirror
    s.x *= mirrorX;
    s.dx *= mirrorX;
    s.y *= mirrorY;
    s.dy *= mirrorY;

    // remove bat relative position
    s.x += bat.x;
    s.y += bat.y;

    // // remove bat relative delta
    // s.dx += bat.dx;
    // s.dy += bat.dy;

    // set the balls new position and delta
    ball.position.x = s.x;
    ball.position.y = s.y;
    ballDelta.x = s.dx;
    ballDelta.y = s.dy;
  }
}
