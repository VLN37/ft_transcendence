import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UsersService } from 'src/users/users.service';
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

  constructor(private usersService: UsersService) {}

  // PERF: we could save the queue the user is on in the database for better dequeueing
  enqueue(user: Express.User, matchType: MatchType) {
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

  private createMatch(queue: Express.User[]): MemoryMatch {
    const [user1, user2] = queue;
    this.logger.debug(
      `Creating a match between users ${user1.login_intra} and ${user2.login_intra}`,
    );

    const match = new MemoryMatch(randomUUID(), user1, user2);
    this.memoryMatches.push(match);

    queue.shift();
    queue.shift();

    return match;
  }
}
