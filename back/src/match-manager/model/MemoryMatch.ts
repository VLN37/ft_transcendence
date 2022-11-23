import { Logger } from '@nestjs/common';
import { UserDto } from 'src/users/dto/user.dto';

function seconds(secs: number) {
  return secs * 1000;
}

function minutes(mins: number) {
  return mins * seconds(60);
}

function hours(h: number) {
  return h * minutes(60);
}

export type MatchStage =
  | 'AWAITING_PLAYERS'
  | 'PREPARATION'
  | 'ONGOING'
  | 'FINISHED'
  | 'CANCELED';

export class MemoryMatch {
  private readonly logger: Logger;

  id: string;
  left_player: UserDto;
  right_player: UserDto;
  left_player_score?: number = 0;
  right_player_score?: number = 0;
  timers: {
    awaiting_players?: NodeJS.Timeout;
    preparation?: NodeJS.Timeout;
    ongoing?: NodeJS.Timeout;
  };

  stage: MatchStage;

  onStageChange: () => void;
  onStart: () => void;
  onCancel: () => void;

  constructor(id: string, leftPlayer: UserDto, rightPlayer: UserDto) {
    this.id = id;
    this.left_player = leftPlayer;
    this.right_player = rightPlayer;
    this.left_player_score = 0;
    this.right_player_score = 0;
    this.timers = {};
    this.stage = 'AWAITING_PLAYERS';
    this.logger = new Logger('match ' + id);
    this.logger.log(
      'Creating match between players ' +
        leftPlayer.login_intra +
        ' and ' +
        rightPlayer.login_intra,
    );
  }

  waitForPlayers() {
    this.logger.debug('waiting for players');

    this.timers.awaiting_players = setTimeout(() => {
      this.logger.warn("canceling match: players didn't connect");
      this.updateStage('CANCELED');
      this.onCancel?.call(this);
    }, seconds(30));
  }

  onBothPlayersConnected() {
    this.logger.debug('both players connected');
    clearTimeout(this.timers.awaiting_players);
    this.startPreparationTime();
  }

  private startPreparationTime() {
    this.updateStage('PREPARATION');
    this.logger.debug('starting preparation time');
    this.timers.preparation = setTimeout(() => {
      this.startMatch();
    }, seconds(15));
  }

  private startMatch() {
    this.updateStage('ONGOING');
    this.logger.debug('starting match');
    this.timers.ongoing = setTimeout(() => {
      this.finishMatch();
    }, minutes(5));
    this.onStart?.call(this);
  }

  private finishMatch() {
    this.logger.log('match finished');
    this.updateStage('FINISHED');
  }

  private updateStage(stage: MatchStage) {
    this.stage = stage;
    this.onStageChange();
  }
}
