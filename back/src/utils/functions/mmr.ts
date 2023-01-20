const DFACTOR = 400;
const KFACTOR = 32;

function expected(p1mmr: number, p2mmr: number) {
  return 1 / (1 + (Math.pow(10, (p2mmr - p1mmr) / DFACTOR)));
}

export function mmr(
  target,
  opponent,
  result: 'WIN' | 'LOSS',
): number {
  const possibility = expected(target, opponent);
  // console.log(possibility);
  let difference;
  if (result == 'WIN')
    difference = KFACTOR * (1 - possibility);
  else if (result == 'LOSS')
    difference = KFACTOR * (0 - possibility);
  return Math.round(Math.round(target + difference));
}

