import { Controller, Delete, Get, Param } from '@nestjs/common';
import { FriendService } from './friends.service';

@Controller('/users/:from/friends')
export class FriendsController {
  constructor(private readonly friendService: FriendService) {}

  @Get()
  async get(@Param('from') from: number) {
    return await this.friendService.get(from);
  }

  @Delete(':to')
  async del(@Param('from') from: number, @Param('to') to: number) {
    return await this.friendService.del(from, to);
  }
}
