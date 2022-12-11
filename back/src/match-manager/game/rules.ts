const WIDTH = 858;
const HEIGHT = 525;
const BALL_RADIUS = 20;

export type Tuple = {
  x: number;
  y: number;
};

export type GameRules = {
  worldWidth: number;
  worldHeight: number;
  whRatio: number;
  ballStart: {
    position: Tuple;
    speed: number;
  };
  playerStart: number;
  topCollisionEdge: number;
  bottomCollisionEdge: number;
  leftCollisionEdge: number;
  rightCollisionEdge: number;
};

export const rules: GameRules = {
  worldWidth: WIDTH,
  worldHeight: HEIGHT,
  whRatio: WIDTH / HEIGHT,
  ballStart: {
    position: {
      x: WIDTH / 2,
      y: HEIGHT / 2,
    },
    speed: 9, // world units per second
  },
  playerStart: HEIGHT / 2,
  topCollisionEdge: BALL_RADIUS,
  bottomCollisionEdge: HEIGHT - BALL_RADIUS,

  leftCollisionEdge: BALL_RADIUS,
  rightCollisionEdge: WIDTH - BALL_RADIUS,
};
