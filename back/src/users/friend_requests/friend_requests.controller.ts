import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { FriendRequestsService } from './friend_requests.service';

@Controller('/users/:from/friend_requests')
export class FriendRequestsController {
  constructor(private readonly friendRequestsService: FriendRequestsService) {}

  @HttpCode(200)
  @Post()
  async request(@Param('from') from: number, @Body('user_id') to: number) {
    return await this.friendRequestsService.request(from, to);
  }
}
