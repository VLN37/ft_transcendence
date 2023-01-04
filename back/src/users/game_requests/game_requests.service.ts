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
    receiver: number,
    user: UserDto,
  ) => void | null = null;

  constructor(private usersService: UsersService) {}

  setInviteNotify(callback: (receiver: number, user: UserDto) => void) {
    this.inviteNotifyService = callback;
  }

  async invite(target: number, user: UserDto) {
    this.inviteNotifyService(target, user);
    return;
  }

  updateInvite(me: number, target: number, status: string) {
    return;
  }
}
