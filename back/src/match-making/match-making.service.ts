import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from 'src/entities/match.entity';
import { User } from 'src/entities/user.entity';
import { MatchManagerService } from 'src/match-manager/match-manager.service';
import { MemoryMatch } from 'src/match-manager/model/MemoryMatch';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { MatchType, MATCH_TYPES } from './dto/AppendToQueueDTO';

class MemoryQueue {
  CLASSIC: User[] = [];
  TURBO: User[] = [];
}

@Injectable()
export class MatchMakingService {
  private readonly logger = new Logger(MatchMakingService.name);

  private memoryQueue = new MemoryQueue();

  constructor(
    @InjectRepository(Match)
    private usersService: UsersService,
    private matchManager: MatchManagerService,
  ) {}

  // PERF: we could save the queue the user is on in the database for better dequeueing
  async enqueue(user: User, matchType: MatchType): Promise<MemoryMatch> {
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

  private isMatchAvailable(queue: User[]): boolean {
    return queue.length >= 2;
  }

  private async createMatch(queue: User[]): Promise<MemoryMatch> {
    const user1 = queue.shift();
    const user2 = queue.shift();

    this.logger.debug(
      `Creating a match between users ${user1.login_intra} and ${user2.login_intra}`,
    );

    return this.matchManager.createMatch(user1, user2);
  }
}
