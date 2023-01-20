import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { MatchManager } from 'src/match-manager/match-manager';
import { MemoryMatch } from 'src/match-manager/model/MemoryMatch';
import { UserDto } from 'src/users/dto/user.dto';
import { MatchType, MATCH_TYPES } from './dto/MatchType';

class MemoryQueue {
  CLASSIC: UserDto[] = [];
  TURBO: UserDto[] = [];
}

type MatchInformation = {
  accepted: boolean;
  user: UserDto;
  matchType: MatchType;
};

@Injectable()
export class MatchMakingService {
  private readonly logger = new Logger(MatchMakingService.name);

  private memoryQueue = new MemoryQueue();

  private assignedPlayers: {
    [key: string]: MatchInformation;
  } = {};

  constructor(private matchManager: MatchManager) {}

  // PERF: we could save the queue the user is on in the database for better dequeueing
  enqueue(user: UserDto, matchType: MatchType) {
    if (this.matchManager.isPlayerPlaying(user)) {
      const match = this.matchManager.getActiveMatches().find((i) => {
        return (i.left_player.id == user.id || i.right_player.id == user.id)
      }).id;
      throw new BadRequestException({
        message: 'You are already playing!',
        match: match,
        recipient: user.login_intra,
      });
    }
    const queue = this.memoryQueue[matchType];

    if (queue.some((enqueuedUser) => enqueuedUser.id === user.id)) {
      throw new Error('User is already in a queue');
    }
    this.logger.log(
      `user ${user.login_intra} entered the ${matchType} match-making queue`,
    );

    queue.push(user);

    if (this.isMatchAvailable(queue)) {
      return this.startMatchCreation(queue, matchType);
    }
  }

  dequeueUser(userId: number) {
    MATCH_TYPES.forEach((type) => {
      const queue = this.memoryQueue[type];
      const i = queue.findIndex((queuedUser) => queuedUser.id === userId);
      if (i >= 0) {
        const user = queue.splice(i, 1);
        this.logger.log(
          `removing user ${user[0].login_intra} from the ${type} queue`,
        );
      }
    });
  }

  async acceptMatch(user: UserDto): Promise<MemoryMatch | UserDto> {
    if (!this.assignedPlayers[user.login_intra])
      throw new Error('user is not assigned to any match');
    const info = this.assignedPlayers[user.login_intra];
    info.accepted = true;
    const otherUser = info.user;

    if (this.bothPlayersAccepted(user, otherUser)) {
      const matchType = this.assignedPlayers[user.login_intra].matchType;
      delete this.assignedPlayers[user.login_intra];
      delete this.assignedPlayers[otherUser.login_intra];

      return this.matchManager.createMatch(user, otherUser, matchType);
    }
    return otherUser;
  }

  private bothPlayersAccepted(user1: UserDto, user2: UserDto) {
    return (
      this.assignedPlayers[user1.login_intra].accepted &&
      this.assignedPlayers[user2.login_intra].accepted
    );
  }

  declineMatch(user: UserDto): UserDto {
    if (!this.assignedPlayers[user.login_intra])
      throw new Error('user is not assigned to any match');
    const otherUser = this.assignedPlayers[user.login_intra].user;
    delete this.assignedPlayers[user.login_intra];
    delete this.assignedPlayers[otherUser.login_intra];
    return otherUser;
  }

  private isMatchAvailable(queue: UserDto[]): boolean {
    return queue.length >= 2;
  }

  private startMatchCreation(queue: UserDto[], type: MatchType) {
    this.logger.debug('match is available');
    const user1 = queue.shift();
    const user2 = queue.shift();

    this.assignedPlayers[user1.login_intra] = {
      accepted: false,
      user: user2,
      matchType: type,
    };
    this.assignedPlayers[user2.login_intra] = {
      accepted: false,
      user: user1,
      matchType: type,
    };

    return { user1, user2 };
  }
}
