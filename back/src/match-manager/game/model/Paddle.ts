import { PlayerCommand } from 'src/match-manager/model/PlayerCommands';
import { UserDto } from 'src/users/dto/user.dto';
import { GameRules, rules } from '../rules';

export enum PlayerSide {
  RIGHT = 1,
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
  speed: number;
  state: PlayerState;

  private isGoingUp = false;
  private isGoingDown = false;
  private readonly player: UserDto;
  private enemy?: Paddle;

  constructor(player: UserDto, side: PlayerSide, rules: GameRules) {
    this.side = side;
    this.state = PlayerState.STOPPED;
    this.y = rules.player.startingPosition;
    this.x =
      side == PlayerSide.LEFT ? rules.player.leftLine : rules.player.rightLine;
    this.width = rules.player.width;
    this.height = rules.player.height;
    this.player = player;
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

  getPlayer() {
    return this.player;
  }

  getEnemy?: () => Paddle;

  setEnemy(enemy: Paddle) {
    if (this.getEnemy) throw new Error('Enemy already set');
    this.getEnemy = () => enemy;
  }

  private stopMoving() {
    this.state = PlayerState.STOPPED;
    this.isGoingUp = false;
    this.isGoingDown = false;
  }
}
