export enum PlayerSide {
  RIGHT,
  LEFT,
}

export class Player {
  side: PlayerSide;
  y: number;

  constructor(side: PlayerSide, y: number) {
    this.side = side;
    this.y = y;
  }
}
