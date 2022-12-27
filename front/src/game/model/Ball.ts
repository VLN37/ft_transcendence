import { Point } from '../math/Point';
import { Vector } from '../math/Vector';
import { GameRules } from './GameRules';

export class Ball {
  public radius: number;
  public position: Point;
  public velocity: Vector;
  public speed: number;

  constructor(rules: GameRules) {
    this.radius = rules.ball.radius;
    this.velocity = new Vector();
    this.position = new Point();
    this.position.x = rules.ball.startingPosition.x;
    this.position.y = rules.ball.startingPosition.y;
    this.speed = rules.ball.startingSpeed;
  }

  update(deltaTime: number) {
    const displacement = Vector.mult(
      this.velocity,
      (this.speed * deltaTime) / 1000,
    );
    this.position.addVector(displacement);
  }
}
