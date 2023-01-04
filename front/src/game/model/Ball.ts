import { Point } from '../math/Point';
import { Vector } from '../math/Vector';
import { GameRules } from './GameRules';

export class Ball {
  public radius: number;
  public position: Point;
  public velocity: Vector;

  constructor(rules: GameRules) {
    this.radius = rules.ball.radius;
    this.velocity = new Vector();
    this.position = new Point();
    this.position.x = rules.ball.startingPosition.x;
    this.position.y = rules.ball.startingPosition.y;
  }

  update(deltaTime: number) {
    const deltaVector = new Vector(
      this.velocity.x * deltaTime,
      this.velocity.y * deltaTime,
    );
    this.position.addVector(deltaVector);
  }
}
