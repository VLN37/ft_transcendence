import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchEntity } from 'src/entities/match.entity';
import { MatchType } from 'src/match-making/dto/MatchType';
import { UserDto } from 'src/users/dto/user.dto';
import { mmr } from 'src/utils/functions/mmr';
import { seconds } from 'src/utils/functions/timeConvertion';
import { Err, Ok, Result } from 'ts-results';
import { Repository } from 'typeorm';
import { PlayerSide } from './game/model/Paddle';
import {
  MATCH_DURATION,
  NOTIFICATIONS_PER_SECOND,
  PREPARATION_TIME_DURATION,
  rules,
  UPDATES_PER_SECOND,
  WAIT_CONNECTION_DURATION,
} from './game/rules';
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
    disconnect_tolerance: {
      left_player?: NodeJS.Timeout;
      right_player?: NodeJS.Timeout;
    };
  };
  onMatchUpdate?: () => void;
  onServerNotify?: () => void;
  match: MemoryMatch;
};

@Injectable()
export class MatchManager {
  private readonly logger = new Logger('Match Manager');

  private activeMatches: ActiveMatch[] = [];
  private connectedPlayers: {
    [key: number]: string;
  } = {};
  private notifyService: (event: string, match: MatchEntity) => void | null =
    null;

  constructor(
    @InjectRepository(MatchEntity)
    private readonly matchRepository: Repository<MatchEntity>,
  ) {}

  setNotify(callback: (event: string, match: MatchEntity) => void) {
    this.notifyService = callback;
  }

  isPlayerPlaying(user: UserDto): boolean {
    return !!this.connectedPlayers[user.id];
  }

  async createMatch(
    user1: UserDto,
    user2: UserDto,
    type: MatchType,
  ): Promise<MemoryMatch> {
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
      if (stage == 'FINISHED') {
        const result = memoryMatch.getResult();
        if (!result.draw) {
          result.winner.profile.wins++;
          result.loser.profile.losses++;
          const winnermmr = result.winner.profile.mmr;
          const losermmr = result.loser.profile.mmr;
          result.winner.profile.mmr = mmr(winnermmr, losermmr, 'WIN');
          result.loser.profile.mmr = mmr(losermmr, winnermmr, 'LOSS');
        }
      }
      this.matchRepository.save(memoryMatch).then((retMatch: MatchEntity) => {
        retMatch.created_at = match.created_at;
        if (stage == 'ONGOING') this.notifyService('created', retMatch);
        if (stage == 'FINISHED') this.notifyService('updated', retMatch);
      });
      if (stage == 'FINISHED' || stage == 'CANCELED') {
        delete this.connectedPlayers[memoryMatch.left_player.id];
        delete this.connectedPlayers[memoryMatch.right_player.id];
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
      this.matchRepository.save(memoryMatch).then((retMatch: MatchEntity) => {
        retMatch.created_at = match.created_at;
        this.notifyService('updated', retMatch);
      });
    };

    const activeMatch: ActiveMatch = {
      match: memoryMatch,
      timers: {
        disconnect_tolerance: {},
      },
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

  refuseMatch(matchId: string, playerId: number) {
    const activeMatch = this.findMatchById(matchId);
    if (!activeMatch) throw new Error('Match not found');

    if (!this.isAPlayer(playerId, activeMatch.match))
      throw new Error('User is not a player');

    this.cancelMatch(activeMatch);
  }

  cancelMatch(match: ActiveMatch) {
    this.clearTimers(match);
    match.match.updateStage('CANCELED');
  }

  clearTimers(match: ActiveMatch) {
    clearInterval(match.timers.notify);
    clearInterval(match.timers.update);
    clearTimeout(match.timers.ongoing);
    clearTimeout(match.timers.preparation);
    clearTimeout(match.timers.waiting_timeout);
  }

  connectPlayer(matchId: string, playerId: number) {
    const match = this.findMatchById(matchId);
    if (!match) throw new Error('Match not found');

    if (!this.isAPlayer(playerId, match.match))
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
      activeMatch.timers.disconnect_tolerance.left_player = setTimeout(() => {
        this.finishMatchByWalkOver(activeMatch, activeMatch.match.left_player);
      }, seconds(rules.disconnectTolerance));
    }
    if (userId === activeMatch.match.right_player.id) {
      activeMatch.match.right_player_connected = false;
      activeMatch.timers.disconnect_tolerance.right_player = setTimeout(() => {
        this.finishMatchByWalkOver(activeMatch, activeMatch.match.right_player);
      }, seconds(rules.disconnectTolerance));
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
    notifyPowerUpCollected: (playerSide: PlayerSide, powerup: PowerUp) => void,
  ) {
    const activeMatch = this.findMatchById(matchId);
    activeMatch.match.onPowerUpCollected = (playerSide, powerup) => {
      notifyPowerUpCollected(playerSide, powerup);
    };
  }

  setMatchStartSubscriber(
    matchId: string,
    callback: (match: MemoryMatch) => void,
  ) {
    const activeMatch = this.findMatchById(matchId);
    activeMatch.match.onMatchStart = callback;
  }

  setMatchEndSubscriber(
    matchId: string,
    callback: (match: MemoryMatch, reason: string) => void,
  ) {
    const activeMatch = this.findMatchById(matchId);
    activeMatch.match.onMatchEnd = callback;
  }

  private startWaitingTime(activeMatch: ActiveMatch) {
    const onDoneWaiting = () => {
      this.logger.warn("canceling match: players didn't connect");
      activeMatch.match.updateStage('CANCELED');
    };

    // cancel match after 30 seconds if players don't connect
    activeMatch.timers.waiting_timeout = setTimeout(
      onDoneWaiting,
      seconds(WAIT_CONNECTION_DURATION),
    );
  }

  private onBothPlayersConnected(match: ActiveMatch) {
    if (match.match.stage == 'AWAITING_PLAYERS') {
      this.logger.debug('both players connected');
      clearTimeout(match.timers.waiting_timeout); // so we don't cancel the match
      this.startPreparationTime(match);
    } else {
      this.logger.log('player reconnected, resetting the tolerance');
      clearTimeout(match.timers.disconnect_tolerance.right_player);
      clearTimeout(match.timers.disconnect_tolerance.left_player);
    }
  }

  private startPreparationTime(activeMatch: ActiveMatch) {
    const start_at = new Date();
    start_at.setSeconds(start_at.getSeconds() + PREPARATION_TIME_DURATION);
    activeMatch.match.starts_at = start_at;

    const ends_at = new Date(start_at);
    ends_at.setSeconds(ends_at.getSeconds() + MATCH_DURATION);
    activeMatch.match.ends_at = ends_at;

    activeMatch.match.updateStage('PREPARATION');

    this.logger.debug('starting preparation time');
    this.logger.debug('match starts at ' + start_at.toISOString());

    const onPreparationTimeEnd = () => {
      this.startMatch(activeMatch);
    };

    // start match in 15 seconds after both players connected
    activeMatch.timers.preparation = setTimeout(
      onPreparationTimeEnd,
      seconds(PREPARATION_TIME_DURATION),
    );
  }

  private startMatch(match: ActiveMatch) {
    match.match.updateStage('ONGOING');
    match.match.resetPositions();

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

    match.timers.ongoing = setTimeout(onMatchFinished, seconds(MATCH_DURATION));
  }

  private finishMatch(match: ActiveMatch) {
    clearInterval(match.timers.update);
    clearInterval(match.timers.notify);
    match.match.updateStage('FINISHED');
  }

  private finishMatchByWalkOver(match: ActiveMatch, woUser: UserDto) {
    this.clearTimers(match);
    if (match.match.right_player.id == woUser.id) {
      match.match.right_player_score = 0;
      match.match.left_player_score = 3;
    } else {
      match.match.right_player_score = 3;
      match.match.left_player_score = 0;
    }
    this.logger.warn(`finishing match ${match.match.id} by WO`);
    match.match.updateStage('FINISHED');
  }

  private findMatchById(matchId: string): ActiveMatch {
    return this.activeMatches.find(
      (activeMatch) => activeMatch.match.id === matchId,
    );
  }

  private isAPlayer(playerId: number, match: MemoryMatch) {
    return (
      playerId === match.left_player.id || playerId === match.right_player.id
    );
  }
}
