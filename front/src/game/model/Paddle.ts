import { GameRules, PlayerState } from './GameRules';

export enum PlayerSide {
  RIGHT = 1,
  LEFT,
}

export class Paddle {
  side: PlayerSide;
  x: number;
  y: number;
  width: number;
  height: number;

  state: PlayerState;
  speed: number;

  constructor(side: PlayerSide, rules: GameRules) {
    this.side = side;
    this.state = PlayerState.STOPPED;
    this.y = rules.player.startingPosition;
    this.x =
      side == PlayerSide.LEFT ? rules.player.leftLine : rules.player.rightLine;
    this.width = rules.player.width;
    this.height = rules.player.height;
    this.speed = rules.player.speed;
  }

  update(deltaTime: number) {
    if (this.state == PlayerState.STOPPED) {
      return;
    }

    let movement = 0;
    if (this.state == PlayerState.MOVING_UP) {
      movement = -(this.speed * deltaTime);
    } else {
      movement = this.speed * deltaTime;
    }

    this.y += movement;
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
