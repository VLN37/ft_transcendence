import { PlayerCommand } from 'src/match-manager/model/PlayerCommands';
import { GameRules, rules } from '../rules';

export enum PlayerSide {
  RIGHT,
  LEFT,
}

export enum PlayerState {
  STOPPED,
  MOVING_UP,
  MOVING_DOWN,
}

export class Paddle {
  side: PlayerSide;
  x: number;
  y: number;
  width: number;
  height: number;
  state: PlayerState;

  private isGoingUp = false;
  private isGoingDown = false;

  constructor(side: PlayerSide, rules: GameRules) {
    this.side = side;
    this.state = PlayerState.STOPPED;
    this.y = rules.player.startingPosition;
    this.x =
      side == PlayerSide.LEFT ? rules.player.leftLine : rules.player.rightLine;
    this.width = rules.player.width;
    this.height = rules.player.height;
  }

  update(deltaTime: number) {
    if (this.state == PlayerState.STOPPED) {
      return;
    }

    let movement = 0;
    if (this.state == PlayerState.MOVING_UP) {
      movement = -(rules.player.speed * deltaTime);
    } else {
      movement = rules.player.speed * deltaTime;
    }

    this.y += movement;
    if (this.y > rules.player.maxY) {
      this.y = rules.player.maxY;
      this.stopMoving();
    } else if (this.y < rules.player.minY) {
      this.y = rules.player.minY;
      this.stopMoving();
    }
  }

  handleCommand(command: PlayerCommand) {
    if (command === PlayerCommand.STOP_MOVE_UP) {
      this.isGoingUp = false;
    } else if (command === PlayerCommand.STOP_MOVE_DOWN) {
      this.isGoingDown = false;
    } else if (command === PlayerCommand.MOVE_UP) {
      this.isGoingUp = true;
    } else if (command === PlayerCommand.MOVE_DOWN) {
      this.isGoingDown = true;
    }

    if (this.isGoingUp) this.state = PlayerState.MOVING_UP;
    else if (this.isGoingDown) this.state = PlayerState.MOVING_DOWN;
    else this.stopMoving();
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

  private stopMoving() {
    this.state = PlayerState.STOPPED;
    this.isGoingUp = false;
    this.isGoingDown = false;
  }
}
