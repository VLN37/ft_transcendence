import { Ball } from 'src/match-manager/game/model/Ball';
import { Paddle } from 'src/match-manager/game/model/Paddle';
import { rules } from 'src/match-manager/game/rules';
import { seconds } from 'src/utils/functions/timeConvertion';
import { PowerUp } from './PowerUp';

export class GrowPlayerSize implements PowerUp {
  public duration: number = seconds(10);

  public activate = (ball: Ball, lastTouch: Paddle) => {
    const defaultHeight = rules.player.height;
    lastTouch.height = defaultHeight + 20;

    setTimeout(() => {
      lastTouch.height = defaultHeight;
    }, this.duration);
  };
}
