const PLAYER_SPEED = 200;
const WORLD_WIDTH = 858;
const WORLD_HEIGHT = 525;
const BALL_SIZE = 20;
const BALL_INITIAL_SPEED = 250; // world units per second
const PLAYER_WIDTH = 20; // world units per second
const PLAYER_HEIGHT = 100; // world units per second

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
    speed: number;
    minY: number;
    maxY: number;
  };
  topCollisionEdge: number;
  bottomCollisionEdge: number;
  leftCollisionEdge: number;
  rightCollisionEdge: number;
};

export const rules: GameRules = {
  worldWidth: WORLD_WIDTH,
  worldHeight: WORLD_HEIGHT,
  whRatio: WORLD_WIDTH / WORLD_HEIGHT,
  ball: {
    startingPosition: {
      x: WORLD_WIDTH / 2,
      y: WORLD_HEIGHT / 2,
    },
    startingSpeed: BALL_INITIAL_SPEED,
    size: BALL_SIZE,
    maxSpeed: 1000,
  },
  player: {
    startingPosition: WORLD_HEIGHT / 2,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    leftLine: 20,
    rightLine: WORLD_WIDTH - 20,
    speed: PLAYER_SPEED,
    minY: 30 + PLAYER_HEIGHT / 2,
    maxY: WORLD_HEIGHT - PLAYER_HEIGHT / 2 - 30,
  },
  topCollisionEdge: BALL_SIZE / 2,
  bottomCollisionEdge: WORLD_HEIGHT - BALL_SIZE / 2,
  leftCollisionEdge: BALL_SIZE / 2,
  rightCollisionEdge: WORLD_WIDTH - BALL_SIZE / 2,
};
