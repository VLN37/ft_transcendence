import { GameRules } from './model/GameRules';
import { Paddle } from './model/Paddle';
import { PowerUp } from './model/PowerUp';

export const applyPowerUp = (
  paddle: Paddle,
  _powerup: PowerUp,
  rules: GameRules,
) => {
  switch (_powerup.name) {
    case 'grow-player-size':
      const defaultHeight = rules.player.height;
      paddle.height = defaultHeight + 100;

      setTimeout(() => {
        paddle.height = defaultHeight;
      }, _powerup.duration);
      break;

    default:
      break;
  }
};
