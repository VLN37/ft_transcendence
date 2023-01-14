export type PowerUpName = 'grow-player-size' | 'slow-enemy';

export interface PowerUp {
  name: PowerUpName;
  duration: number;
  x: number;
  y: number;
}
