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
    vec.mult(9);
    this.state.ball = {
      x: rules.ballStart.position.x,
      y: rules.ballStart.position.y,
      velocity: vec,
    };
  }

  increment = 1;
  update() {
    if (this.state.p1 <= rules.topCollisionEdge) {
      this.increment = +1;
    } else if (this.state.p1 >= rules.bottomCollisionEdge) {
      this.increment = -1;
    }

    this.checkBallCollision();
    this.state.p1 += this.increment;
    this.state.p2 += this.increment;
    this.state.ball.x += this.state.ball.velocity.x;
    this.state.ball.y += this.state.ball.velocity.y;
  }

  private checkBallCollision() {
    const { ball } = this.state;

    if (
      ball.x >= rules.rightCollisionEdge ||
      ball.x <= rules.leftCollisionEdge
    ) {
      this.state.ball.velocity.x *= -1;
    }
    if (
      ball.y <= rules.topCollisionEdge ||
      ball.y >= rules.bottomCollisionEdge
    ) {
      this.state.ball.velocity.y *= -1;
    }
  }
}
