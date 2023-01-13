const ratio = Math.PI / 180;

export const degToRad = (degrees: number): number => {
  return degrees * ratio;
};

export const radToDeg = (radians: number): number => {
  return radians / ratio;
};
