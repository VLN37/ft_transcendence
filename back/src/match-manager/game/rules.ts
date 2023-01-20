const PLAYER_SPEED = 300;
const WORLD_WIDTH = 858;
const WORLD_HEIGHT = 525;
const BALL_SIZE = 20;
const BALL_INITIAL_SPEED = 250; // world units per second
const PLAYER_WIDTH = 20; // world units per second
const PLAYER_HEIGHT = 100; // world units per second

export const UPDATES_PER_SECOND = 60;
export const NOTIFICATIONS_PER_SECOND = 20;

// times in seconds
export const WAIT_CONNECTION_DURATION = 30;
export const PREPARATION_TIME_DURATION = 5;
export const MATCH_DURATION = 99;

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
    classicStartingSpeed: number;
    turboStartingSpeed: number;
    size: number;
    maxSpeed: number;
    maxAngle: number;
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
  powerUpSpawnArea: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
  matchDuration: number;
  powerUpCollisionRange: number;
  topCollisionEdge: number;
  bottomCollisionEdge: number;
  leftCollisionEdge: number;
  rightCollisionEdge: number;
  disconnectTolerance: number;
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
    size: BALL_SIZE,
    maxSpeed: 750,
    maxAngle: 60,
    classicStartingSpeed: 300,
    turboStartingSpeed: 380,
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
  powerUpSpawnArea: {
    minX: 250,
    maxX: WORLD_WIDTH - 250,
    minY: 50,
    maxY: WORLD_HEIGHT - 50,
  },
  matchDuration: MATCH_DURATION,
  powerUpCollisionRange: BALL_SIZE,
  topCollisionEdge: BALL_SIZE / 2,
  bottomCollisionEdge: WORLD_HEIGHT - BALL_SIZE / 2,
  leftCollisionEdge: BALL_SIZE / 2,
  rightCollisionEdge: WORLD_WIDTH - BALL_SIZE / 2,
  disconnectTolerance: 10,
};
