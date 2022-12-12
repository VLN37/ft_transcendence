import p5Types from 'p5';
import { Tuple } from './GameRules';

export class Ball {
  public radius: number;
  public position: p5Types.Vector;
  public velocity: p5Types.Vector;
  public speed: number;

  constructor(radius: number, startingPosition: Tuple) {
    this.radius = radius;
    this.position = new p5Types.Vector();
    this.position.x = startingPosition.x;
    this.position.y = startingPosition.y;
    this.velocity = new p5Types.Vector();
    this.speed = 0;
  }

  update(deltaTime: number) {
    const displacement = p5Types.Vector.mult(
      this.velocity,
      (this.speed * deltaTime) / 1000,
    );
    this.position.add(displacement);
  }
}
