import { Ball } from 'src/match-manager/game/model/Ball';
import { Paddle } from 'src/match-manager/game/model/Paddle';
import { seconds } from 'src/utils/functions/timeConvertion';
import { PowerUp, PowerUpName } from './PowerUp';

export class InvertEnemy implements PowerUp {
  name: PowerUpName = 'invert-enemy';
  canActivate: boolean = true;
  duration: number = seconds(15);

  activate = (ball: Ball, lastTouch: Paddle) => {
    if (!this.canActivate) return;
    this.canActivate = false;
    const enemy = lastTouch.getEnemy();
    enemy.setCommandHandlerToInverted();

    setTimeout(() => {
      enemy.setCommandHandlerToDefault();
    }, this.duration);
  };
}
