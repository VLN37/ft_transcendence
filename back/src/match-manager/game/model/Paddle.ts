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

export const commandStateMap = {
  [PlayerCommand.STOP]: PlayerState.STOPPED,
  [PlayerCommand.MOVE_UP]: PlayerState.MOVING_UP,
  [PlayerCommand.MOVE_DOWN]: PlayerState.MOVING_DOWN,
};

export class Paddle {
  side: PlayerSide;
  x: number;
  y: number;
  width: number;
  height: number;
  state: PlayerState;

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
      this.state = PlayerState.STOPPED;
    } else if (this.y < rules.player.minY) {
      this.y = rules.player.minY;
      this.state = PlayerState.STOPPED;
    }
  }

  handleCommand(command: PlayerCommand) {
    this.state = commandStateMap[command];
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
