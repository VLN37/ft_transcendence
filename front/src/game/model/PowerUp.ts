export type PowerUpName = 'grow-player-size';

export interface PowerUp {
  name: PowerUpName;
  duration: number;
  x: number;
  y: number;
}
