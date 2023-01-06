export type Tuple = {
  x: number;
  y: number;
};

export enum PlayerState {
  STOPPED,
  MOVING_UP,
  MOVING_DOWN,
}

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
  };
  topCollisionEdge: number;
  bottomCollisionEdge: number;
  leftCollisionEdge: number;
  rightCollisionEdge: number;
};
