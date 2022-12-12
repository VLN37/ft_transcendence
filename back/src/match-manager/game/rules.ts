const WIDTH = 858;
const HEIGHT = 525;
const BALL_RADIUS = 14;
const BALL_INITIAL_SPEED = 250; // world units per second

export const UPDATES_PER_SECOND = 60;
export const NOTIFICATIONS_PER_SECOND = 20;

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
  maxSpeed: number;
  playerStart: number;
  topCollisionEdge: number;
  bottomCollisionEdge: number;
  leftCollisionEdge: number;
  rightCollisionEdge: number;
  ballRadius: number;
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
    speed: BALL_INITIAL_SPEED,
  },
  maxSpeed: 1000,
  playerStart: HEIGHT / 2,
  topCollisionEdge: BALL_RADIUS,
  bottomCollisionEdge: HEIGHT - BALL_RADIUS,
  leftCollisionEdge: BALL_RADIUS,
  rightCollisionEdge: WIDTH - BALL_RADIUS,
  ballRadius: BALL_RADIUS,
};
