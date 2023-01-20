import { Ball } from 'src/match-manager/game/model/Ball';
import { Paddle } from 'src/match-manager/game/model/Paddle';
import { rules } from 'src/match-manager/game/rules';
import { seconds } from 'src/utils/functions/timeConvertion';
import { PowerUp, PowerUpName } from './PowerUp';

export class SlowEnemy implements PowerUp {
  name: PowerUpName = 'slow-enemy';
  canActivate: boolean = true;
  duration = seconds(10);

  public activate = (ball: Ball, lastTouch: Paddle) => {
    if (!this.canActivate) return;
    this.canActivate = false;
    const defaultSpeed = rules.player.speed;
    const enemy = lastTouch.getEnemy();
    enemy.speed = defaultSpeed / 2;
    // console.log(`slowing for ${this.duration / 1000} seconds`);

    setTimeout(() => {
      enemy.speed = defaultSpeed;
      // console.log('reseting enemy speed to ' + defaultSpeed);
    }, this.duration);
  };
}
