import Sketch from 'react-p5';
import p5Types from 'p5';
import { Ball } from './model/Ball';

const BALL_RADIUS = 20;

export default (props: any) => {
  const whRatio = 858 / 525;

  let width = 500;
  let height = 500;
  let ball: Ball;

  let upperBound = BALL_RADIUS;
  let lowerBound = height - BALL_RADIUS;
  let leftBound = BALL_RADIUS;
  let rightBound = width - BALL_RADIUS;

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    width = window.innerWidth;
    height = window.innerHeight;
    lowerBound = height - BALL_RADIUS;
    rightBound = width - BALL_RADIUS;
    p5.createCanvas(width, height).parent(canvasParentRef);
    ball = new Ball(BALL_RADIUS, width / 2, height / 2);
  };

  const resizeIfNecessary = (p5: p5Types) => {
    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;

    if (currentWidth == width && currentHeight == height) return;

    console.log(`resizing window to ${currentWidth}x${currentHeight}`);
    p5.resizeCanvas(currentWidth, currentHeight);
    width = currentWidth;
    height = currentHeight;
    lowerBound = height - BALL_RADIUS;
    rightBound = width - BALL_RADIUS;
  };

  const drawRightPlayer = (p5: p5Types) => {
    p5.fill(50, 100, 200);
    p5.rectMode('center');
    p5.rect(p5.width - 20, p5.mouseY, 20, 100);
  };

  const drawLeftPlayer = (p5: p5Types) => {
    p5.fill(240, 100, 30);
    p5.rectMode('center');
    p5.rect(20, p5.height - p5.mouseY, 20, 100);
  };

  const checkBallCollision = (p5: p5Types) => {
    if (ball.position.y >= lowerBound || ball.position.y < upperBound) {
      ball.velocity.y = -ball.velocity.y;
    }
    if (ball.position.x >= rightBound || ball.position.x < leftBound) {
      ball.velocity.x = -ball.velocity.x;
    }
  };

  let x = 0;
  const drawBall = (p5: p5Types) => {
    ball.update();
    if (x % 60 == 0) {
      console.log(`ball x: ${ball.position.x}, y: ${ball.position.y}`);
    }
    x++;
    const xRatio = (ball.position.x / width) * 255;
    const yRatio = (ball.position.y / height) * 255;
    p5.fill(200 - xRatio, yRatio, xRatio);
    const size = ball.radius * 2;
    p5.ellipse(ball.position.x, ball.position.y, size, size);
  };

  const draw = (p5: p5Types) => {
    resizeIfNecessary(p5);
    p5.background(0);
    checkBallCollision(p5);
    drawBall(p5);
    p5.textSize(32);
    p5.fill(0, 102, 153);
    p5.text('fps: ' + Math.round(1000 / p5.deltaTime), 50, 50);
    drawRightPlayer(p5);
    drawLeftPlayer(p5);
  };

  const onWindowResize = (p5: p5Types) => {};

  return <Sketch windowResized={onWindowResize} setup={setup} draw={draw} />;
};
