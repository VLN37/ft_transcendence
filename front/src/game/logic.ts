import { GameRules } from './model/GameRules';
import { Paddle } from './model/Paddle';
import { PowerUp } from './model/PowerUp';

export const applyPowerUp = (
  paddle: Paddle,
  _powerup: PowerUp,
  rules: GameRules,
) => {
  // console.log(`activating powerup ${_powerup.name}`);
  switch (_powerup.name) {
    case 'grow-player-size':
      const defaultHeight = rules.player.height;
      paddle.height = defaultHeight + 100;

      setTimeout(() => {
        paddle.height = defaultHeight;
      }, _powerup.duration);
      break;

    case 'slow-enemy': {
      const defaultSpeed = rules.player.speed;
      const enemy = paddle.getEnemy!();
      enemy.speed = defaultSpeed / 2;

      setTimeout(() => {
        enemy.speed = defaultSpeed;
      }, _powerup.duration);

      break;
    }
    case 'invert-enemy': {
      const enemy = paddle.getEnemy!();
      enemy.isInverted = true;
      setTimeout(() => {
        enemy.isInverted = false;
      }, _powerup.duration);
      break;
    }
    default:
      break;
  }
};
