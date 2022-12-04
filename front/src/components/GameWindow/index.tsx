import Sketch from 'react-p5';
import p5Types from 'p5';

export default (props: any) => {
  const whRatio = 858 / 525;

  let width = 500;
  let height = 500;
  let x = 50;
  let y = 50;

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(
      canvasParentRef,
    );
  };

  const resizeIfNecessary = (p5: p5Types) => {
    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;

    if (currentWidth == width && currentHeight == height) return;

    console.log(`resizing window to ${currentWidth}x${currentHeight}`);
    p5.resizeCanvas(currentWidth, currentHeight);
    width = currentWidth;
    height = currentHeight;
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

  const draw = (p5: p5Types) => {
    resizeIfNecessary(p5);
    const xRatio = (p5.mouseX / width) * 255;
    const yRatio = (p5.mouseY / height) * 255;
    p5.background(0);
    p5.fill(200 - xRatio, yRatio, xRatio);
    p5.ellipse(p5.mouseX, p5.mouseY, 40, 40);
    p5.textSize(32);
    p5.fill(0, 102, 153);
    p5.text('fps: ' + Math.round(1000 / p5.deltaTime), 50, 50);
    drawRightPlayer(p5);
    drawLeftPlayer(p5);
    x++;
  };

  const onWindowResize = (p5: p5Types) => {};

  return <Sketch windowResized={onWindowResize} setup={setup} draw={draw} />;
};
