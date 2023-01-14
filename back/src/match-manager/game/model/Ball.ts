import { Point } from '../math/Point';
import { Vector } from '../math/Vector';
import { GameRules } from '../rules';
import { Paddle } from './Paddle';

export class Ball {
  public width: number;
  public height: number;
  public position: Point;
  public velocity: Vector;
  public maxSpeed: number;
  public lastTouch: Paddle;

  constructor(rules: GameRules) {
    this.width = rules.ball.size;
    this.height = rules.ball.size;
    this.velocity = new Vector();
    this.position = new Point();
    this.position.x = rules.ball.startingPosition.x;
    this.position.y = rules.ball.startingPosition.y;
    this.maxSpeed = rules.ball.maxSpeed;
  }

  update(deltaTime: number) {
    const deltaVector = new Vector(
      this.velocity.x * deltaTime,
      this.velocity.y * deltaTime,
    );
    this.position.addVector(deltaVector);
  }

  getLeftBorder() {
    return this.position.x - this.width / 2;
  }

  getRightBorder() {
    return this.position.x + this.width / 2;
  }

  getUpperBorder() {
    return this.position.y - this.height / 2;
  }

  getLowerBorder() {
    return this.position.y + this.height / 2;
  }

  isGoingLeft() {
    return this.velocity.x < 0;
  }

  isGoingRight() {
    return !this.isGoingLeft();
  }
}
