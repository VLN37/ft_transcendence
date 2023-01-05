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

  moveTo(point: Point) {
    this.x = point.x;
    this.y = point.y;
  }

  static subtract(p1: Point, p2: Point): Vector {
    return new Vector(p1.x - p2.x, p1.y - p2.y);
  }
}
