export function seconds(secs: number) {
  return secs * 1000;
}

export function minutes(mins: number) {
  return mins * seconds(60);
}

export function hours(h: number) {
  return h * minutes(60);
}
