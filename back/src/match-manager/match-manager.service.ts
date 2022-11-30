import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from 'src/entities/match.entity';
import { UserDto } from 'src/users/dto/user.dto';
import { Repository } from 'typeorm';
import { MemoryMatch } from './model/MemoryMatch';

@Injectable()
export class MatchManagerService {
  private readonly logger = new Logger('Match Manager');

  private memoryMatches: MemoryMatch[] = [];

  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  async createMatch(user1: UserDto, user2: UserDto) {
    const match = this.matchRepository.create({
      left_player: user1,
      right_player: user2,
    });

    await this.matchRepository.save(match);

    const memoryMatch = new MemoryMatch(match.id, user1, user2);
    memoryMatch.onCancel = () => {
      this.logger.warn('match was cancelled');
    };

    memoryMatch.onStart = () => {
      this.logger.warn('match is starting');
    };

    memoryMatch.onStageChange = () => {
      match.stage = memoryMatch.stage;
      this.matchRepository.save(match);
    };
    memoryMatch.waitForPlayers();
    this.memoryMatches.push(memoryMatch);

    return memoryMatch;
  }

  getActiveMatch(matchId: string): MemoryMatch {
    return this.memoryMatches.find((match) => match.id === matchId);
  }

  connectPlayer(matchId: string, playerId: number) {
    const match = this.memoryMatches.find((match) => match.id === matchId);
    if (!match) throw new Error('Match not found');

    match.connectPlayer(playerId);
  }
}
