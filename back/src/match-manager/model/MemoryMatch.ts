import { UserDto } from 'src/users/dto/user.dto';
import { rules } from '../game/rules';
import { MatchState } from './MatchState';
import { World } from 'src/lib/c2.js/physics';
import { Rect, Vector } from 'src/lib/c2.js/geometry';

export type MatchStage =
  | 'AWAITING_PLAYERS'
  | 'PREPARATION'
  | 'ONGOING'
  | 'FINISHED'
  | 'CANCELED';

export class MemoryMatch {
  world: World;
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
    this.world = new World(new Rect(0, 0, rules.worldWidth, rules.worldHeight));
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
    this.state.pl = rules.player.startingPosition;
    this.state.pr = rules.player.startingPosition;
    const vec = Vector.random();
    // const vec = new Vector(1, 0);
    this.lastUpdate = Date.now();
    this.state.ball = {
      pos: {
        x: rules.ball.startingPosition.x,
        y: rules.ball.startingPosition.y,
      },
      dir: {
        x: vec.x,
        y: vec.y,
      },
      speed: rules.ball.startingSpeed,
    };
  }

  private increment = 1;
  update() {
    const deltaTime = this.getDeltaTime();

    if (this.state.pl <= rules.topCollisionEdge) {
      this.increment = +1;
    } else if (this.state.pl >= rules.bottomCollisionEdge) {
      this.increment = -1;
    }
    const speed = (this.state.ball.speed * deltaTime) / 1000;
    // this.state.p1 += this.increment;
    // this.state.p2 += this.increment;
    this.state.ball.pos.x += this.state.ball.dir.x * speed;
    this.state.ball.pos.y += this.state.ball.dir.y * speed;
    this.state.pl = this.state.ball.pos.y;
    this.state.pr = this.state.ball.pos.y;

    this.checkBallCollision();
  }

  private checkBallCollision() {
    const { ball } = this.state;

    if (
      (ball.pos.x <= rules.leftCollisionEdge && ball.dir.x < 0) ||
      (ball.pos.x >= rules.rightCollisionEdge && ball.dir.x > 0)
    ) {
      if (ball.dir.x < 0) {
        const overflow = rules.leftCollisionEdge - ball.pos.x;
        ball.pos.x = ball.pos.x + overflow * 2;
      } else {
        const overflow = ball.pos.x - rules.rightCollisionEdge;
        ball.pos.x = ball.pos.x - overflow * 2;
      }
      this.state.ball.dir.x *= -1;
      this.increaseBallSpeed();
    }
    this.checkBallSideCollision();
    this.checkBallPlayerCollision();
  }

  private checkBallSideCollision() {
    const { ball } = this.state;
    if (
      (ball.pos.y <= rules.topCollisionEdge && ball.dir.y < 0) ||
      (ball.pos.y >= rules.bottomCollisionEdge && ball.dir.y > 0)
    ) {
      if (ball.dir.y < 0) {
        const overflow = rules.topCollisionEdge - ball.pos.y;
        ball.pos.y = ball.pos.y + overflow * 2;
      } else {
        const overflow = ball.pos.y - rules.bottomCollisionEdge;
        ball.pos.y = ball.pos.y - overflow * 2;
      }
      this.state.ball.dir.y *= -1;
    }
  }

  private checkBallPlayerCollision() {
    let leftPlayerCollided: boolean = false;
    let rightPlayerCollided: boolean = false;

    if (this.checkLeftPlayerBallCollision()) {
      leftPlayerCollided = true;
    }

    if (!leftPlayerCollided && this.checkRightPlayerBallCollision()) {
      rightPlayerCollided = true;
    }

    if (leftPlayerCollided || rightPlayerCollided) {
      this.state.ball.dir.x *= -1;
      this.increaseBallSpeed();
    }
  }

  private checkLeftPlayerBallCollision(): boolean {
    const { ball, pl: leftPlayer } = this.state;

    const playerBody = rules.player.leftLine + rules.player.width / 2;
    if (ball.pos.x + rules.ball.radius < playerBody && ball.dir.x < 0) {
      if (
        ball.pos.y + rules.ball.radius < leftPlayer + rules.player.height / 2 &&
        ball.pos.y + rules.ball.radius > leftPlayer - rules.player.height / 2
      ) {
        return true;
      }
    }
    return false;
  }

  private checkRightPlayerBallCollision(): boolean {
    const { ball, pr: rightPlayer } = this.state;

    const playerBody = rules.player.rightLine - rules.player.width / 2;
    if (ball.pos.x + rules.ball.radius > playerBody && ball.dir.x > 0) {
      if (
        ball.pos.y < rightPlayer + rules.player.height / 2 &&
        ball.pos.y > rightPlayer - rules.player.height / 2
      ) {
        return true;
      }
    }
    return false;
  }

  private getDeltaTime(): number {
    const now = Date.now();
    const deltaTime = now - this.lastUpdate;
    this.lastUpdate = now;
    return deltaTime;
  }

  private increaseBallSpeed() {
    if (this.state.ball.speed < rules.ball.maxSpeed) {
      this.state.ball.speed += 50;
    }
  }
}
