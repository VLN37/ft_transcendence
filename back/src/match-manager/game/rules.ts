const WIDTH = 858;
const HEIGHT = 525;
const BALL_RADIUS = 20;

export const rules = {
  worldWidth: WIDTH,
  worldHeight: HEIGHT,
  whRatio: WIDTH / HEIGHT,
  ballStart: {
    x: WIDTH / 2,
    y: HEIGHT / 2,
  },
  playerStart: HEIGHT / 2,
  topCollisionEdge: BALL_RADIUS,
  bottomCollisionEdge: HEIGHT - BALL_RADIUS,

  leftCollisionEdge: BALL_RADIUS,
  rightCollisionEdge: WIDTH - BALL_RADIUS,
};
