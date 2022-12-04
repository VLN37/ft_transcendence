export enum PlayerSide {
  RIGHT,
  LEFT,
}

export class Player {
  side: PlayerSide;

  constructor(side: PlayerSide) {
    this.side = side;
  }
}
