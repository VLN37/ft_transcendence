import { Injectable, Logger } from '@nestjs/common';
import { UserDto } from '../dto/user.dto';
import { UsersService } from '../users.service';

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
  ) => void | null = null;

  constructor(private usersService: UsersService) {}

  setInviteNotify(callback: (receiver: number, user: UserDto) => void) {
    this.inviteNotifyService = callback;
  }

  setUpdateNotify(
    callback: (status: string, user1: UserDto, user2: UserDto) => void,
  ) {
    this.updateNotifyService = callback;
  }

  async invite(target: number, user: UserDto) {
    this.inviteNotifyService(target, user);
    return;
  }

  updateInvite(status: string, user1: UserDto, user2: UserDto) {
    if (status == 'DECLINED') {
      this.updateNotifyService(status, user1, user2);
    }
    return;
  }
}
