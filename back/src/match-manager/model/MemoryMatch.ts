import { MatchType } from 'src/match-making/dto/MatchType';
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

export type MatchResult = {
  draw: boolean;
  winner?: UserDto;
  loser?: UserDto;
};

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

  private currentPowerUp?: PowerUp;
  private getTimeoutReference?: () => NodeJS.Timeout;

  onStageChange: (stage: MatchStage) => void;
  onScoreUpdate: () => void;
  onPowerUpSpawn: (powerUp: PowerUp) => void;
  onPowerUpCollected: (side: PlayerSide, powerUp: PowerUp) => void;
  onMatchStart: (match: MemoryMatch) => void;
  onMatchEnd: () => void;

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
    this.resetPositions();
  }

  updateStage(stage: MatchStage) {
    this.stage = stage;
    if (stage === 'ONGOING') {
      if (this.type === 'TURBO') {
        this.setupNextPowerup();
      }
      this.onMatchStart(this);
    } else if (stage === 'FINISHED') {
      this.onMatchEnd();
      clearTimeout(this.getTimeoutReference?.call(this));
    } else if (stage === 'CANCELED') {
      clearTimeout(this.getTimeoutReference?.call(this));
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

  getResult(): MatchResult {
    if (this.left_player_score === this.right_player_score)
      return {
        draw: true,
      };

    if (this.left_player_score > this.right_player_score) {
      return {
        draw: false,
        winner: this.left_player,
        loser: this.right_player,
      };
    } else {
      return {
        draw: false,
        winner: this.right_player,
        loser: this.left_player,
      };
    }
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
        this.setupNextPowerup();
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

  private getRandomAvailablePowerUp(powerups: PowerUp[]) {
    const size = powerups.length * 10;
    const index = ~~((Math.random() * size) / 10);
    console.log('returning powerup ' + index);
    return powerups[index];
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

  private setupNextPowerup() {
    const availabePowerups = [
      new GrowPlayerSize(),
      new SlowEnemy(),
      new InvertEnemy(),
    ];
    const timeoutReference = setTimeout(() => {
      const powerup = this.getRandomAvailablePowerUp(availabePowerups);
      this.spawnPowerUp(powerup);
    }, seconds(randomBetween(20, 50)));
    this.getTimeoutReference = () => timeoutReference;
  }
}
