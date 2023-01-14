import { Ball } from 'src/match-manager/game/model/Ball';
import { Paddle } from 'src/match-manager/game/model/Paddle';
import { rules } from 'src/match-manager/game/rules';
import { seconds } from 'src/utils/functions/timeConvertion';
import { PowerUp, PowerUpName } from './PowerUp';

export class GrowPlayerSize implements PowerUp {
  public duration: number = seconds(30);
  public name: PowerUpName = 'grow-player-size';
  public canActivate = true;

  public activate = (ball: Ball, lastTouch: Paddle) => {
    if (!this.canActivate) return;
    this.canActivate = false;
    const defaultHeight = rules.player.height;
    lastTouch.height = defaultHeight + 100;

    setTimeout(() => {
      lastTouch.height = defaultHeight;
    }, this.duration);
  };
}
