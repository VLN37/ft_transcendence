const ratio = Math.PI / 180;

export const degToRad = (degrees: number): number => {
  return degrees * ratio;
};

export const radToDeg = (radians: number): number => {
  return radians / ratio;
};

export const randomBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
