import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from 'src/entities/match.entity';
import { User } from 'src/entities/user.entity';
import { UserDto } from 'src/users/dto/user.dto';
import { Repository } from 'typeorm';
import { MemoryMatch } from './model/MemoryMatch';

@Injectable()
export class MatchManagerService {
  private readonly logger = new Logger();

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
    this.logger.warn('created match', match.id);

    const memoryMatch = new MemoryMatch(match.id, user1, user2);
    this.memoryMatches.push(match);

    return memoryMatch;
  }
}
