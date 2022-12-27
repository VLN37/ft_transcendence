import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { FriendRequestsService } from './friend_requests.service';

@UseGuards(JwtAuthGuard)
@Controller('/users/:me/friend_requests')
export class FriendRequestsController {
  private readonly logger = new Logger(FriendRequestsController.name);

  constructor(private readonly friendRequestsService: FriendRequestsService) {}

  @HttpCode(200)
  @Post()
  async request(@Body('user_id') me: number, @Param('me') target: number) {
    return await this.friendRequestsService.request(me, target);
  }

  @Delete(':target')
  async cancelRequest(@Param('me') me: number, @Param('target') him: number) {
    return await this.friendRequestsService.cancelRequest(me, him);
  }

  @Put(':target')
  async updateRequest(
    @Param('me') me: number,
    @Param('him') him: number,
    @Body('status') status: 'ACCEPTED' | 'DECLINED',
  ) {
    return await this.friendRequestsService.updateRequest(me, him, status);
  }

  @Get()
  async pendingRequest(@Param('me') me: number, @Query('type') type: string) {
    return await this.friendRequestsService.pendingRequest(me, type);
  }
}
