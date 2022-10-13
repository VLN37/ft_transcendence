import { Controller, Get, Param } from '@nestjs/common';
import { FriendService } from './friends.service';

@Controller('/users/:id/friends')
export class FriendsController {
  constructor(private readonly friendService: FriendService) {}

  @Get()
  async get(@Param('id') id: number) {
    return await this.friendService.get(id);
  }
}
