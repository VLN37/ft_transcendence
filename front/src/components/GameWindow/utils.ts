import p5Types from 'p5';

export const worldMouse = (p5: p5Types, world: p5Types.Graphics) => {
  return {
    x: (p5.mouseX * world.width) / p5.width,
    y: (p5.mouseY * world.height) / p5.height,
  };
};
