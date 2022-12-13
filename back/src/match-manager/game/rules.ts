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
  ball: {
    startingPosition: Tuple;
    startingSpeed: number;
    radius: number;
    maxSpeed: number;
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
  ball: {
    startingPosition: {
      x: WIDTH / 2,
      y: HEIGHT / 2,
    },
    startingSpeed: BALL_INITIAL_SPEED,
    radius: BALL_RADIUS,
    maxSpeed: 1000,
  },
  playerStart: HEIGHT / 2,
  topCollisionEdge: BALL_RADIUS,
  bottomCollisionEdge: HEIGHT - BALL_RADIUS,
  leftCollisionEdge: BALL_RADIUS,
  rightCollisionEdge: WIDTH - BALL_RADIUS,
};
