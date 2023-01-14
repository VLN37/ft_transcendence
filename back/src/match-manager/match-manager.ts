import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from 'src/entities/match.entity';
import { MatchType } from 'src/match-making/dto/MatchType';
import { UserDto } from 'src/users/dto/user.dto';
import { minutes, seconds } from 'src/utils/functions/timeConvertion';
import { Err, Ok, Result } from 'ts-results';
import { Repository } from 'typeorm';
import { NOTIFICATIONS_PER_SECOND, UPDATES_PER_SECOND } from './game/rules';
import { MatchState } from './model/MatchState';
import { MemoryMatch } from './model/MemoryMatch';
import { PlayerCommand } from './model/PlayerCommands';
import { PowerUp } from './model/PowerUps/PowerUp';

export type ActiveMatch = {
  timers: {
    waiting_timeout?: NodeJS.Timeout;
    preparation?: NodeJS.Timeout;
    ongoing?: NodeJS.Timeout;
    update?: NodeJS.Timer;
    notify?: NodeJS.Timer;
  };
  onMatchUpdate?: () => void;
  onServerNotify?: () => void;
  match: MemoryMatch;
};

@Injectable()
export class MatchManager {
  private readonly logger = new Logger('Match Manager');

  private activeMatches: ActiveMatch[] = [];
  private connectedPlayers = {};
  private notifyService: (event: string, match: Match) => void | null = null;

  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  setNotify(callback: (event: string, match: Match) => void) {
    this.notifyService = callback;
  }

  async createMatch(user1: UserDto, user2: UserDto, type: MatchType) {
    // TODO: check if users are already playing a match
    const match = this.matchRepository.create({
      left_player: user1,
      right_player: user2,
      type: type,
    });

    await this.matchRepository.save(match);

    const memoryMatch = new MemoryMatch(match.id, user1, user2, type);

    memoryMatch.onStageChange = (stage) => {
      this.logger.log('match entering the stage ' + stage);
      this.matchRepository.save(memoryMatch).then((retMatch: Match) => {
        retMatch.created_at = match.created_at;
        if (stage == 'ONGOING') this.notifyService('created', retMatch);
        if (stage == 'FINISHED') this.notifyService('updated', retMatch);
      });
      if (stage == 'FINISHED' || stage == 'CANCELED') {
        const index = this.activeMatches.findIndex(
          (active) => active.match.id === memoryMatch.id,
        );
        this.logger.warn(
          `removing match ${memoryMatch.id} from active matches`,
        );
        this.activeMatches.splice(index, 1);
      }
    };

    memoryMatch.onScoreUpdate = () => {
      this.matchRepository.save(memoryMatch).then((retMatch: Match) => {
        retMatch.created_at = match.created_at;
        this.notifyService('updated', retMatch);
      });
    };

    const activeMatch: ActiveMatch = {
      match: memoryMatch,
      timers: {},
    };

    this.startWaitingTime(activeMatch);
    this.activeMatches.push(activeMatch);

    return memoryMatch;
  }

  getActiveMatches(): Partial<MemoryMatch>[] {
    return this.activeMatches.map((activeMatch) => {
      return activeMatch.match;
    });
  }

  async getFinishedMatches(): Promise<Partial<MemoryMatch>[]> {
    return this.matchRepository.find({
      where: {
        stage: 'FINISHED',
      },
      relations: ['left_player.profile', 'right_player.profile'],
    });
  }

  connectPlayer(matchId: string, playerId: number) {
    const match = this.findMatchById(matchId);
    if (!match) throw new Error('Match not found');

    if (
      playerId !== match.match.left_player.id &&
      playerId !== match.match.right_player.id
    )
      throw new Error('User is not a player');

    if (playerId === match.match.left_player.id) {
      if (match.match.left_player_connected)
        throw new Error('Player is already connected');
      match.match.left_player_connected = true;
    }

    if (playerId === match.match.right_player.id) {
      if (match.match.right_player_connected)
        throw new Error('Player is already connected');
      match.match.right_player_connected = true;
    }

    this.connectedPlayers[playerId] = matchId;

    if (match.match.left_player_connected && match.match.right_player_connected)
      this.onBothPlayersConnected(match);
  }

  handlePlayerCommand(
    playerId: number,
    command: PlayerCommand,
    matchId: string,
  ): Result<MatchState, string> {
    const activeMatch = this.findMatchById(matchId);
    if (!activeMatch) {
      return Err('Match not active');
    }

    if (
      playerId != activeMatch.match.left_player.id &&
      playerId != activeMatch.match.right_player.id
    ) {
      return Err('Issuer is not a player');
    }

    if (activeMatch.match.stage != 'ONGOING')
      return Ok(activeMatch.match.getCurrentState());

    const state = activeMatch.match.handlePlayerCommand(playerId, command);
    return Ok(state);
  }

  disconnectPlayer(userId: number) {
    const matchId: string = this.connectedPlayers[userId];
    const activeMatch = this.findMatchById(matchId);

    if (!activeMatch) throw new Error('Match not found');

    if (userId === activeMatch.match.left_player.id) {
      activeMatch.match.left_player_connected = false;
    }
    if (userId === activeMatch.match.right_player.id) {
      activeMatch.match.right_player_connected = false;
    }
  }

  setMatchTickHandler(
    matchId: string,
    notifyMatchState: (state: MatchState) => void,
  ) {
    const activeMatch = this.findMatchById(matchId);

    activeMatch.onServerNotify = () => {
      notifyMatchState(activeMatch.match.getCurrentState());
    };

    activeMatch.onMatchUpdate = () => {
      activeMatch.match.update();
    };
  }

  setPowerUpSpawnSubscriber(
    matchId: string,
    notifyPowerUpSpawned: (powerup: PowerUp) => void,
  ) {
    const activeMatch = this.findMatchById(matchId);
    activeMatch.match.onPowerUpSpawn = (powerup) => {
      notifyPowerUpSpawned(powerup);
    };
  }

  setPowerUpCollectedSubscriber(
    matchId: string,
    notifyPowerUpCollected: (player: UserDto, powerup: PowerUp) => void,
  ) {
    const activeMatch = this.findMatchById(matchId);
    activeMatch.match.onPowerUpCollected = (player, powerup) => {
      notifyPowerUpCollected(player, powerup);
    };
  }

  private startWaitingTime(activeMatch: ActiveMatch) {
    const onDoneWaiting = () => {
      this.logger.warn("canceling match: players didn't connect");
      activeMatch.match.updateStage('CANCELED');
    };

    // cancel match after 30 seconds if players don't connect
    activeMatch.timers.waiting_timeout = setTimeout(onDoneWaiting, seconds(30));
  }

  private onBothPlayersConnected(match: ActiveMatch) {
    // TODO: check if match was paused
    if (match.match.stage == 'AWAITING_PLAYERS') {
      this.logger.debug('both players connected');
      clearTimeout(match.timers.waiting_timeout); // so we don't cancel the match
      this.startPreparationTime(match);
    } else {
      this.logger.debug('pretend we are resuming the match');
    }
  }

  private startPreparationTime(activeMatch: ActiveMatch) {
    activeMatch.match.updateStage('PREPARATION');

    const start_at = new Date();
    start_at.setSeconds(start_at.getSeconds() + 15);
    activeMatch.match.starts_at = start_at;

    this.logger.debug('starting preparation time');
    this.logger.debug('match starts at ' + start_at.toISOString());

    const onPreparationTimeEnd = () => {
      this.startMatch(activeMatch);
    };

    // start match in 15 seconds after both players connected
    activeMatch.timers.preparation = setTimeout(
      onPreparationTimeEnd,
      seconds(5),
    );
  }

  private startMatch(match: ActiveMatch) {
    match.match.updateStage('ONGOING');
    match.match.resetPositions();

    const end_at = new Date();
    end_at.setMinutes(end_at.getMinutes() + 5);
    this.logger.debug('match finishes at ' + end_at.toISOString());
    match.match.ends_at = end_at;

    match.timers.update = setInterval(() => {
      match.onMatchUpdate();
    }, 1000 / UPDATES_PER_SECOND);

    match.timers.notify = setInterval(() => {
      match.onServerNotify();
    }, 1000 / NOTIFICATIONS_PER_SECOND);

    const onMatchFinished = () => {
      this.logger.debug(
        'match finished exactly at ' + new Date().toISOString(),
      );
      this.finishMatch(match);
    };

    match.timers.ongoing = setTimeout(onMatchFinished, minutes(5));
  }

  private finishMatch(match: ActiveMatch) {
    clearInterval(match.timers.update);
    clearInterval(match.timers.notify);
    match.match.updateStage('FINISHED');
  }

  private findMatchById(matchId: string): ActiveMatch {
    return this.activeMatches.find(
      (activeMatch) => activeMatch.match.id === matchId,
    );
  }
}
