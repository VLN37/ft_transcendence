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
};
