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
  player: {
    startingPosition: number;
    width: number;
    height: number;
    leftLine: number;
    rightLine: number;
  }
  topCollisionEdge: number;
  bottomCollisionEdge: number;
  leftCollisionEdge: number;
  rightCollisionEdge: number;
};
