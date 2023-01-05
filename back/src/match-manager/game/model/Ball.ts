import { Point } from '../math/Point';
import { Vector } from '../math/Vector';
import { GameRules } from '../rules';

export class Ball {
  public width: number;
  public height: number;
  public position: Point;
  public velocity: Vector;
  public speed: number;

  constructor(rules: GameRules) {
    this.velocity = new Vector();
    this.position = new Point();
    this.position.x = rules.ball.startingPosition.x;
    this.position.y = rules.ball.startingPosition.y;
    this.speed = rules.ball.startingSpeed;
  }

  update(deltaTime: number) {
    const deltaVector = new Vector(
      this.velocity.x * deltaTime,
      this.velocity.y * deltaTime,
    );
    this.position.addVector(deltaVector);
  }
}
