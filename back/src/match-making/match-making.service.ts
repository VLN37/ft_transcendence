import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Match } from 'src/entities/match.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { MatchType, MATCH_TYPES } from './dto/AppendToQueueDTO';

class MemoryQueue {
  CLASSIC: Express.User[] = [];
  TURBO: Express.User[] = [];
}

class MemoryMatch {
  id: string;
  left_player: Express.User;
  right_player: Express.User;
  left_player_score?: number = 0;
  right_player_score?: number = 0;

  constructor(id: string, leftPlayer: Express.User, rightPlayer: Express.User) {
    this.id = id;
    this.left_player = leftPlayer;
    this.right_player = rightPlayer;
    this.left_player_score = 0;
    this.right_player_score = 0;
  }
}

@Injectable()
export class MatchMakingService {
  private readonly logger = new Logger(MatchMakingService.name);

  private memoryQueue = new MemoryQueue();
  private memoryMatches: MemoryMatch[] = [];

  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private usersService: UsersService,
  ) {}

  // PERF: we could save the queue the user is on in the database for better dequeueing
  async enqueue(
    user: Express.User,
    matchType: MatchType,
  ): Promise<MemoryMatch> {
    const queue = this.memoryQueue[matchType];

    if (queue.some((enqueuedUser) => enqueuedUser.id === user.id)) {
      throw new Error('User is already in a queue');
    }
    this.logger.log(
      `user ${user.login_intra} is entering the ${matchType} match-making queue`,
    );

    queue.push(user);

    if (this.isMatchAvailable(queue)) {
      return this.createMatch(queue);
    }
    return null;
  }

  dequeue(user: Express.User) {
    MATCH_TYPES.forEach((type) => {
      const queue = this.memoryQueue[type];
      const i = queue.findIndex((queuedUser) => (queuedUser.id = user.id));
      if (i >= 0) {
        this.logger.debug(
          `removing user ${user.login_intra} from the ${type} queue`,
        );
        queue.splice(i, 1);
      }
    });
  }

  private isMatchAvailable(queue: Express.User[]): boolean {
    return queue.length >= 2;
  }

  private async createMatch(queue: Express.User[]): Promise<MemoryMatch> {
    const user1 = queue.shift();
    const user2 = queue.shift();

    this.logger.debug(
      `Creating a match between users ${user1.login_intra} and ${user2.login_intra}`,
    );

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
