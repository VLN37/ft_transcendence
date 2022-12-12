import { UserDto } from 'src/users/dto/user.dto';
import { Vector } from 'src/utils/classes/Vector';
import { rules } from '../game/rules';
import { MatchState } from './MatchState';

export type MatchStage =
  | 'AWAITING_PLAYERS'
  | 'PREPARATION'
  | 'ONGOING'
  | 'FINISHED'
  | 'CANCELED';

export class MemoryMatch {
  id: string;
  left_player: UserDto;
  right_player: UserDto;
  left_player_score?: number = 0;
  right_player_score?: number = 0;
  left_player_connected: boolean = false;
  right_player_connected: boolean = false;
  starts_at?: Date;
  ends_at?: Date;

  stage: MatchStage;

  state: MatchState;

  onStageChange: (stage: MatchStage) => void;

  private lastUpdate: number; // for delta time

  constructor(id: string, leftPlayer: UserDto, rightPlayer: UserDto) {
    this.id = id;
    this.left_player = leftPlayer;
    this.right_player = rightPlayer;
    this.left_player_score = 0;
    this.right_player_score = 0;
    this.stage = 'AWAITING_PLAYERS';
    this.init();
  }

  updateStage(stage: MatchStage) {
    this.stage = stage;
    this.onStageChange?.call(this, stage);
  }

  init() {
    this.state = new MatchState();
    this.resetPositions();
  }

  resetPositions() {
    this.state.p1 = rules.playerStart;
    this.state.p2 = rules.playerStart;
    const vec = Vector.random();
    // const vec = new Vector(1, 0);
    this.lastUpdate = Date.now();
    this.state.ball = {
      pos: {
        x: rules.ballStart.position.x,
        y: rules.ballStart.position.y,
      },
      dir: vec,
      speed: rules.ballStart.speed,
    };
  }

  private increment = 1;
  update() {
    const now = Date.now();
    const deltaTime = now - this.lastUpdate;
    this.lastUpdate = now;

    if (this.state.p1 <= rules.topCollisionEdge) {
      this.increment = +1;
    } else if (this.state.p1 >= rules.bottomCollisionEdge) {
      this.increment = -1;
    }

    this.checkBallCollision();
    const speed = (this.state.ball.speed * deltaTime) / 1000;
    this.state.p1 += this.increment;
    this.state.p2 += this.increment;
    this.state.ball.pos.x += this.state.ball.dir.x * speed;
    this.state.ball.pos.y += this.state.ball.dir.y * speed;
  }

  private checkBallCollision() {
    const { ball } = this.state;

    if (
      (ball.pos.x <= rules.leftCollisionEdge && ball.dir.x < 0) ||
      (ball.pos.x >= rules.rightCollisionEdge && ball.dir.x > 0)
    ) {
      this.state.ball.dir.x *= -1;
      this.increaseSpeed();
    }
    if (
      (ball.pos.y <= rules.topCollisionEdge && ball.dir.y < 0) ||
      (ball.pos.y >= rules.bottomCollisionEdge && ball.dir.y > 0)
    ) {
      this.state.ball.dir.y *= -1;
      this.increaseSpeed();
    }
  }

  private increaseSpeed() {
    if (this.state.ball.speed < rules.maxSpeed) {
      this.state.ball.speed += 50;
    }
  }
}
