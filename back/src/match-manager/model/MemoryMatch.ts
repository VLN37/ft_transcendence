import { UserDto } from 'src/users/dto/user.dto';
import { Vector } from '../game/math/Vector';
import { Ball } from '../game/model/Ball';
import { Player as Paddle, PlayerSide } from '../game/model/Player';
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

  private ball = new Ball(rules);
  private leftPaddle = new Paddle(PlayerSide.LEFT, rules);
  private rightPaddle = new Paddle(PlayerSide.RIGHT, rules);

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
    this.resetPositions();
  }

  resetPositions() {
    this.leftPaddle.y = rules.player.startingPosition;
    this.rightPaddle.y = rules.player.startingPosition;
    const vec = Vector.random().mult(rules.ball.startingSpeed);
    // const vec = new Vector(1, 0);
    this.lastUpdate = Date.now();
    this.ball.position.x = rules.ball.startingPosition.x;
    this.ball.position.y = rules.ball.startingPosition.y;
    this.ball.velocity = vec;
  }

  getCurrentState(): MatchState {
    return {
      ball: {
        pos: this.ball.position,
        vel: this.ball.velocity,
      },
      pl: this.leftPaddle.y,
      pr: this.rightPaddle.y,
    };
  }

  private increment = 1;
  update() {
    const deltaTime = this.getDeltaTime();
    this.ball.update(deltaTime);

    // const ballSpeed = this.ball.velocity.mag();
    // const deltaSpeed = ballSpeed * deltaTime;
    // this.state.p1 += this.increment;
    // this.state.p2 += this.increment;
    // this.ball.position.x += this.ball.velocity.x * deltaSpeed;
    // this.ball.position.y += this.ball.velocity.y * deltaSpeed;
    this.leftPaddle.y = this.ball.position.y;
    this.rightPaddle.y = this.ball.position.y;

    this.checkBallCollision();
  }

  private checkBallCollision() {
    const ball = this.ball;

    if (
      (ball.position.x <= rules.leftCollisionEdge && ball.velocity.x < 0) ||
      (ball.position.x >= rules.rightCollisionEdge && ball.velocity.x > 0)
    ) {
      if (ball.velocity.x < 0) {
        const overflow = rules.leftCollisionEdge - ball.position.x;
        ball.position.x = ball.position.x + overflow * 2;
      } else {
        const overflow = ball.position.x - rules.rightCollisionEdge;
        ball.position.x = ball.position.x - overflow * 2;
      }
      ball.velocity.x *= -1;
      this.increaseBallSpeed();
    }
    this.checkBallSideCollision();
    this.checkBallPlayerCollision();
  }

  private checkBallSideCollision() {
    const ball = this.ball;
    if (
      (ball.position.y <= rules.topCollisionEdge && ball.velocity.y < 0) ||
      (ball.position.y >= rules.bottomCollisionEdge && ball.velocity.y > 0)
    ) {
      if (ball.velocity.y < 0) {
        const overflow = rules.topCollisionEdge - ball.position.y;
        ball.position.y = ball.position.y + overflow * 2;
      } else {
        const overflow = ball.position.y - rules.bottomCollisionEdge;
        ball.position.y = ball.position.y - overflow * 2;
      }
      ball.velocity.y *= -1;
    }
  }

  private checkBallPlayerCollision() {}

  private getDeltaTime(): number {
    const now = Date.now();
    const deltaTime = now - this.lastUpdate;
    this.lastUpdate = now;
    return deltaTime / 1000;
  }

  private increaseBallSpeed() {
    if (this.ball.speed < rules.ball.maxSpeed) {
      this.ball.speed += 50;
    }
  }
}
