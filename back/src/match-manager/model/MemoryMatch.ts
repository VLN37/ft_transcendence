import { UserDto } from 'src/users/dto/user.dto';
import {
  handleBallCollision,
  handleBallLeftPaddleCollision,
  handleBallRightPaddleCollision,
} from '../game/math/collision';
import { Vector } from '../game/math/Vector';
import { Ball } from '../game/model/Ball';
import {
  Player as Paddle,
  PlayerSide,
  PlayerState,
} from '../game/model/Player';
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
      pl: {
        y: this.leftPaddle.y,
        state: this.leftPaddle.state,
      },
      pr: {
        y: this.rightPaddle.y,
        state: this.rightPaddle.state,
      },
    };
  }

  update() {
    const deltaTime = this.getDeltaTime();
    this.handleInput();
    this.processGameLogic();

    this.updateWorld(deltaTime);

    this.handleCollisions();
  }

  private handleInput() {}

  private processGameLogic() {
    const followBall = (paddle: Paddle, ball: Ball) => {
      if (ball.getUpperBorder() < paddle.getUpperBorder())
        paddle.state = PlayerState.MOVING_UP;
      else if (ball.getLowerBorder() > paddle.getLowerBorder())
        paddle.state = PlayerState.MOVING_DOWN;
      else paddle.state = PlayerState.STOPPED;
    };
    followBall(this.leftPaddle, this.ball);
    followBall(this.rightPaddle, this.ball);
  }

  private updateWorld(deltaTime: number) {
    this.ball.update(deltaTime);
    this.rightPaddle.update(deltaTime);
    this.leftPaddle.update(deltaTime);
  }

  private handleCollisions() {
    const ball = this.ball;
    handleBallCollision(ball, rules);
    handleBallLeftPaddleCollision(ball, this.leftPaddle);
    handleBallRightPaddleCollision(ball, this.rightPaddle);
  }

  private getDeltaTime(): number {
    const now = Date.now();
    const deltaTime = now - this.lastUpdate;
    this.lastUpdate = now;
    return deltaTime / 1000;
  }

  // private increaseBallSpeed() {
  //   if (this.ball.speed < rules.ball.maxSpeed) {
  //     this.ball.speed += 50;
  //   }
  // }
}
