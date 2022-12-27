import { Vector } from './Vector';

export class Point {
  public x: number;
  public y: number;

  constructor(x?: number, y?: number) {
    this.x = x || 0;
    this.y = y || 0;
  }

  addVector(vec: Vector): Point {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  }

  subtractVector(vec: Vector): Point {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
  }
}
