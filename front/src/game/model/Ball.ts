import p5Types from 'p5';
import { GameRules, Tuple } from './GameRules';

export class Ball {
  public radius: number;
  public position: p5Types.Vector;
  public velocity: p5Types.Vector;
  public speed: number;

  constructor(rules: GameRules) {
    this.radius = rules.ball.radius;
    this.velocity = new p5Types.Vector();
    this.position = new p5Types.Vector();
    this.position.x = rules.ball.startingPosition.x;
    this.position.y = rules.ball.startingPosition.y;
    this.speed = rules.ball.startingSpeed;
  }

  update(deltaTime: number) {
    const displacement = p5Types.Vector.mult(
      this.velocity,
      (this.speed * deltaTime) / 1000,
    );
    this.position.add(displacement);
  }
}
