import { MatchType, MATCH_TYPES } from 'src/match-making/dto/MatchType';
import { UserDto } from 'src/users/dto/user.dto';
import { randomBetween } from 'src/utils/functions/math';
import { seconds } from 'src/utils/functions/timeConvertion';
import {
  checkBallGoalCollision,
  handleBallCollision,
  handleBallLeftPaddleCollision,
  isBallCollidingPowerUp,
  handleBallRightPaddleCollision,
} from '../game/math/collision';
import { Vector } from '../game/math/Vector';
import { Ball } from '../game/model/Ball';
import { Paddle, PlayerSide } from '../game/model/Paddle';
import { rules } from '../game/rules';
import { MatchStage } from './MatchStage';
import { MatchState } from './MatchState';
import { PlayerCommand } from './PlayerCommands';
import { GrowPlayerSize } from './PowerUps/GrowPlayerSize';
import { InvertEnemy } from './PowerUps/InvertEnemy';
import { PowerUp } from './PowerUps/PowerUp';
import { SlowEnemy } from './PowerUps/SlowEnemy';

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
  private leftPaddle: Paddle;
  private rightPaddle: Paddle;

  private availabePowerups: PowerUp[];
  private currentPowerUp?: PowerUp;

  onStageChange: (stage: MatchStage) => void;
  onScoreUpdate: () => void;
  onPowerUpSpawn: (powerUp: PowerUp) => void;
  onPowerUpCollected: (side: PlayerSide, powerUp: PowerUp) => void;

  private lastUpdate: number; // for delta time

  constructor(
    id: string,
    leftPlayer: UserDto,
    rightPlayer: UserDto,
    type: MatchType,
  ) {
    this.id = id;
    this.leftPaddle = new Paddle(leftPlayer, PlayerSide.LEFT, rules);
    this.rightPaddle = new Paddle(rightPlayer, PlayerSide.RIGHT, rules);
    this.leftPaddle.setEnemy(this.rightPaddle);
    this.rightPaddle.setEnemy(this.leftPaddle);
    this.left_player = leftPlayer;
    this.right_player = rightPlayer;
    this.left_player_score = 0;
    this.right_player_score = 0;
    this.stage = 'AWAITING_PLAYERS';
    this.type = type;
    this.init();
  }

  init() {
    if (this.type === 'TURBO') {
      this.availabePowerups = [
        new GrowPlayerSize(),
        new SlowEnemy(),
        new InvertEnemy(),
      ];
    }
    this.resetPositions();
  }

  updateStage(stage: MatchStage) {
    this.stage = stage;
    if (stage === 'ONGOING' && this.type === 'TURBO') {
      this.setupPowerUps();
    }
    this.onStageChange?.call(this, stage);
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
        speed: this.leftPaddle.speed,
      },
      pr: {
        y: this.rightPaddle.y,
        state: this.rightPaddle.state,
        score: this.right_player_score,
        speed: this.rightPaddle.speed,
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

    if (this.currentPowerUp && this.currentPowerUp.canActivate) {
      if (isBallCollidingPowerUp(ball, this.currentPowerUp)) {
        this.currentPowerUp.activate(ball, ball.lastTouch);
        const player = ball.lastTouch;
        this.onPowerUpCollected(player.side, this.currentPowerUp);
      }
    }
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

  private getRandomAvailablePowerUp() {
    const size = this.availabePowerups.length;
    const index = Math.floor(Math.random() * size);
    return this.availabePowerups[2];
  }

  private spawnPowerUp(powerup: PowerUp) {
    const { minX, maxX, minY, maxY } = rules.powerUpSpawnArea;

    const x = randomBetween(minX, maxX);
    const y = randomBetween(minY, maxY);

    powerup.x = x;
    powerup.y = y;
    this.currentPowerUp = powerup;
    this.onPowerUpSpawn(powerup);
  }

  private setupPowerUps() {
    setTimeout(() => {
      const powerup = this.getRandomAvailablePowerUp();
      this.spawnPowerUp(powerup);
    }, seconds(randomBetween(0, 5)));
  }
}
