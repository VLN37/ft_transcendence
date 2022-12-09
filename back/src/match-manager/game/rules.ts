const WIDTH = 858;
const HEIGHT = 525;
const BALL_RADIUS = 15;

export const rules = {
  worldWidth: WIDTH,
  worldHeight: HEIGHT,
  whRatio: WIDTH / HEIGHT,
  ballStart: {
    x: WIDTH / 2,
    y: HEIGHT / 2,
  },
  playerStart: HEIGHT / 2,
  topCollisionEdge: BALL_RADIUS / 2,
  bottomCollisionEdge: HEIGHT - BALL_RADIUS / 2,

  leftCollisionEdge: BALL_RADIUS / 2,
  rightCollisionEdge: WIDTH - BALL_RADIUS / 2,
};
