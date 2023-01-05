import { GameRules } from '../rules';

export enum PlayerSide {
  RIGHT,
  LEFT,
}

export class Player {
  side: PlayerSide;
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(side: PlayerSide, rules: GameRules) {
    this.side = side;
    this.y = rules.player.startingPosition;
    this.x =
      side == PlayerSide.LEFT ? rules.player.leftLine : rules.player.rightLine;
    this.width = rules.player.width;
    this.height = rules.player.height;
  }

  getLeftBorder() {
    return this.x - this.width / 2;
  }

  getRightBorder() {
    return this.x + this.width / 2;
  }

  getUpperBorder() {
    return this.y - this.height / 2;
  }

  getLowerBorder() {
    return this.y + this.height / 2;
  }
}
