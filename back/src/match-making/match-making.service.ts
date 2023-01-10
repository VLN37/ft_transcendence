import { Injectable, Logger } from '@nestjs/common';
import { MatchManager } from 'src/match-manager/match-manager';
import { MemoryMatch } from 'src/match-manager/model/MemoryMatch';
import { UserDto } from 'src/users/dto/user.dto';
import { MatchType, MATCH_TYPES } from './dto/MatchType';

class MemoryQueue {
  CLASSIC: UserDto[] = [];
  TURBO: UserDto[] = [];
}

@Injectable()
export class MatchMakingService {
  private readonly logger = new Logger(MatchMakingService.name);

  private memoryQueue = new MemoryQueue();

  constructor(private matchManager: MatchManager) {}

  // PERF: we could save the queue the user is on in the database for better dequeueing
  async enqueue(user: UserDto, matchType: MatchType): Promise<MemoryMatch> {
    const queue = this.memoryQueue[matchType];

    if (queue.some((enqueuedUser) => enqueuedUser.id === user.id)) {
      throw new Error('User is already in a queue');
    }
    this.logger.log(
      `user ${user.login_intra} is entering the ${matchType} match-making queue`,
    );

    queue.push(user);

    if (this.isMatchAvailable(queue)) {
      return this.createMatch(queue, matchType);
    }
    return null;
  }

  dequeueUser(userId: number) {
    MATCH_TYPES.forEach((type) => {
      const queue = this.memoryQueue[type];
      const i = queue.findIndex((queuedUser) => (queuedUser.id = userId));
      if (i >= 0) {
        const user = queue.splice(i, 1);
        this.logger.debug(
          `removing user ${user[0].login_intra} from the ${type} queue`,
        );
      }
    });
  }

  private isMatchAvailable(queue: UserDto[]): boolean {
    return queue.length >= 2;
  }

  private async createMatch(
    queue: UserDto[],
    matchType: MatchType,
  ): Promise<MemoryMatch> {
    this.logger.debug('match is available');
    const user1 = queue.shift();
    const user2 = queue.shift();

    this.logger.debug(
      `Creating a match between users ${user1.login_intra} and ${user2.login_intra}`,
    );

    return this.matchManager.createMatch(user1, user2, matchType);
  }
}
