const WIDTH = 858;
const HEIGHT = 525;
const BALL_SIZE = 20;
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
    size: number;
    maxSpeed: number;
  };
  player: {
    startingPosition: number;
    width: number;
    height: number;
    leftLine: number;
    rightLine: number;
  };
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
    size: BALL_SIZE,
    maxSpeed: 1000,
  },
  player: {
    startingPosition: HEIGHT / 2,
    width: 20,
    height: 100,
    leftLine: 20,
    rightLine: WIDTH - 20,
  },
  topCollisionEdge: BALL_SIZE / 2,
  bottomCollisionEdge: HEIGHT - BALL_SIZE / 2,
  leftCollisionEdge: BALL_SIZE / 2,
  rightCollisionEdge: WIDTH - BALL_SIZE / 2,
};
