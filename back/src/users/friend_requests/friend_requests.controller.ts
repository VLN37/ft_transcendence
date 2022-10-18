import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { FriendRequestsService } from './friend_requests.service';

@Controller('/users/:me/friend_requests')
export class FriendRequestsController {
  constructor(private readonly friendRequestsService: FriendRequestsService) {}

  @HttpCode(200)
  @Post()
  async request(@Body('user_id') me: number, @Param('me') target: number) {
    return await this.friendRequestsService.request(me, target);
  }

  @Delete(':target')
  async cancelRequest(
    @Param('me') me: number,
    @Param('target') target: number,
  ) {
    return await this.friendRequestsService.cancelRequest(me, target);
  }

  @Put(':target')
  async updateRequest(
    @Param('me') me: number,
    @Param('target') target: number,
    @Body('status') status: string,
  ) {
    return await this.friendRequestsService.updateRequest(me, target, status);
  }

  @Get()
  async pendingRequest(@Param('me') me: number, @Query('type') type: string) {
    return await this.friendRequestsService.pendingRequest(me, type);
  }
}
