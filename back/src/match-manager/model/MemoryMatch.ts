import { MatchType } from 'src/match-making/dto/MatchType';
import { UserDto } from 'src/users/dto/user.dto';
import {
  checkBallGoalCollision,
  handleBallCollision,
  handleBallLeftPaddleCollision,
  handleBallRightPaddleCollision,
} from '../game/math/collision';
import { Vector } from '../game/math/Vector';
import { Ball } from '../game/model/Ball';
import { Paddle, PlayerSide } from '../game/model/Paddle';
import { rules } from '../game/rules';
import { MatchStage } from './MatchStage';
import { MatchState } from './MatchState';
import { PlayerCommand } from './PlayerCommands';

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
  type: MatchType;

  stage: MatchStage;

  private ball = new Ball(rules);
  private leftPaddle = new Paddle(PlayerSide.LEFT, rules);
  private rightPaddle = new Paddle(PlayerSide.RIGHT, rules);

  onStageChange: (stage: MatchStage) => void;
  onScoreUpdate: () => void;

  private lastUpdate: number; // for delta time

  constructor(
    id: string,
    leftPlayer: UserDto,
    rightPlayer: UserDto,
    type: MatchType,
  ) {
    this.id = id;
    this.left_player = leftPlayer;
    this.right_player = rightPlayer;
    this.left_player_score = 0;
    this.right_player_score = 0;
    this.stage = 'AWAITING_PLAYERS';
    this.type = type;
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
    this.lastUpdate = Date.now();
    this.ball.position.x = rules.ball.startingPosition.x;
    this.ball.position.y = rules.ball.startingPosition.y;

    if (this.stage === 'ONGOING') {
      const vec = this.getRandomStartingBallVelocity();
      // const vec = new Vector(1, 0);
      this.ball.velocity = vec;
    }
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
        score: this.left_player_score,
      },
      pr: {
        y: this.rightPaddle.y,
        state: this.rightPaddle.state,
        score: this.right_player_score,
      },
    };
  }

  update() {
    const deltaTime = this.getDeltaTime();
    this.handleInput();
    // this.processGameLogic();

    this.updateWorld(deltaTime);

    this.handleCollisions();
  }

  handlePlayerCommand(playerId: number, command: PlayerCommand): MatchState {
    if (playerId == this.left_player.id) {
      this.leftPaddle.handleCommand(command);
    } else if (playerId == this.right_player.id) {
      this.rightPaddle.handleCommand(command);
    }
    return this.getCurrentState();
  }

  private handleInput() {}

  private updateWorld(deltaTime: number) {
    this.ball.update(deltaTime);
    this.rightPaddle.update(deltaTime);
    this.leftPaddle.update(deltaTime);
  }

  private handleCollisions() {
    const ball = this.ball;
    if (checkBallGoalCollision(ball, rules)) {
      if (ball.getRightBorder() > rules.rightCollisionEdge) {
        this.left_player_score++;
      } else {
        this.right_player_score++;
      }

      this.resetPositions();
      this.onScoreUpdate();
    }
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

  private getRandomStartingBallVelocity(): Vector {
    const sideChooser = Math.random() < 0.5 ? -1 : 1;
    const x = 150 * sideChooser;
    const y = (Math.random() - 0.5) * rules.worldHeight;
    return new Vector(x, y).normalize().mult(rules.ball.startingSpeed);
  }
}
