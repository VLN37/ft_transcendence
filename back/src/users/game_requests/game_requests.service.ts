import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { MatchManager } from 'src/match-manager/match-manager';
import { MemoryMatch } from 'src/match-manager/model/MemoryMatch';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class GameRequestsService {
  private readonly logger = new Logger(GameRequestsService.name);
  private inviteNotifyService: (
    receiver: number,
    user: UserDto,
  ) => void | null = null;
  private updateNotifyService: (
    status: string,
    user1: UserDto,
    user2: UserDto,
    id: string,
  ) => void | null = null;

  constructor(
    @Inject(forwardRef(() => MatchManager))
    private matchManager: MatchManager,
  ) {}

  setInviteNotify(callback: (receiver: number, user: UserDto) => void) {
    this.inviteNotifyService = callback;
  }

  setUpdateNotify(
    callback: (
      status: string,
      user1: UserDto,
      user2: UserDto,
      id: string,
    ) => void,
  ) {
    this.updateNotifyService = callback;
  }

  async invite(target: number, user: UserDto) {
    this.inviteNotifyService(target, user);
    return;
  }

  async updateInvite(status: string, user1: UserDto, user2: UserDto) {
    const match: MemoryMatch = await this.matchManager.createMatch(user1, user2);
    this.updateNotifyService(status, user1, user2, match.id);
    return;
  }
}
