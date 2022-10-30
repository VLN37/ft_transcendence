import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { MatchType, MATCH_TYPES } from './dto/AppendToQueueDTO';

class MemoryQueue {
  CLASSIC: Express.User[] = [];
  TURBO: Express.User[] = [];
}

@Injectable()
export class MatchMakingService {
  private readonly logger = new Logger(MatchMakingService.name);

  private memoryQueue = new MemoryQueue();

  constructor(private usersService: UsersService) {}

  // PERF: we could save the queue the user is on in the database for better dequeueing
  enqueue(user: Express.User, matchType: MatchType) {
    const queue = this.memoryQueue[matchType];
    this.logger.log(
      `user ${user.login_intra} is entering the ${matchType} match-making queue`,
    );

    if (queue.some((enqueuedUser) => enqueuedUser.id === user.id)) {
      throw new BadRequestException('User is already in a queue');
    }
    queue.push(user);
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
}
