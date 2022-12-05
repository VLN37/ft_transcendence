import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from 'src/entities/match.entity';
import { UserDto } from 'src/users/dto/user.dto';
import { minutes, seconds } from 'src/utils/functions/timeConvertion';
import { Repository } from 'typeorm';
import { MemoryMatch } from './model/MemoryMatch';

export type ActiveMatch = {
  timers: {
    waiting_timeout?: NodeJS.Timeout;
    preparation?: NodeJS.Timeout;
    ongoing?: NodeJS.Timeout;
  };
  match: MemoryMatch;
};

@Injectable()
export class MatchManagerService {
  private readonly logger = new Logger('Match Manager');

  private memoryMatches: MemoryMatch[] = [];
  private activeMatches: ActiveMatch[] = [];

  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  async createMatch(user1: UserDto, user2: UserDto) {
    // TODO: check if users are already playing a match
    const match = this.matchRepository.create({
      left_player: user1,
      right_player: user2,
    });

    await this.matchRepository.save(match);

    const memoryMatch = new MemoryMatch(match.id, user1, user2);

    memoryMatch.onStageChange = (stage) => {
      this.logger.log('match entering the stage ' + stage);
      this.matchRepository.save(memoryMatch);
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

    const activeMatch: ActiveMatch = {
      match: memoryMatch,
      timers: {},
    };

    this.startWaitingTime(activeMatch);
    this.activeMatches.push(activeMatch);

    return memoryMatch;
  }

  getActiveMatch(matchId: string): MemoryMatch {
    return this.memoryMatches.find((match) => match.id === matchId);
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
    const match = this.activeMatches.find(
      (match) => match.match.id === matchId,
    );
    if (!match) throw new Error('Match not found');

    if (
      playerId !== match.match.left_player.id &&
      playerId !== match.match.right_player.id
    )
      throw new Error('User is not a player');

    if (playerId === match.match.left_player.id)
      match.match.left_player_connected = true;

    if (playerId === match.match.right_player.id)
      match.match.right_player_connected = true;

    if (match.match.left_player_connected && match.match.right_player_connected)
      this.onBothPlayersConnected(match);
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
    this.logger.debug('both players connected');
    clearTimeout(match.timers.waiting_timeout); // so we don't cancel the match
    this.startPreparationTime(match);
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
      seconds(15),
    );
  }

  private startMatch(match: ActiveMatch) {
    match.match.updateStage('ONGOING');

    const end_at = new Date();
    end_at.setMinutes(end_at.getMinutes() + 5);
    this.logger.debug('match finishes at ' + end_at.toISOString());
    match.match.ends_at = end_at;

    const onMatchFinished = () => {
      this.logger.debug(
        'match finished exactly at ' + new Date().toISOString(),
      );
      this.finishMatch(match);
    };

    match.timers.ongoing = setTimeout(onMatchFinished, minutes(5));
  }

  private finishMatch(match: ActiveMatch) {
    match.match.updateStage('FINISHED');
  }
}
