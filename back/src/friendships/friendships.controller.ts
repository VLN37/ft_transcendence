import { Body, Controller, Param, Post } from '@nestjs/common';
import { FriendshipsService } from './friendships.service';

@Controller('friends')
export class FriendshipsController {
  constructor(private readonly friendshipsService: FriendshipsService) {}

  @Post(':id/add')
  async add(@Param('id') id: any, @Body() user: any) {
    return await this.friendshipsService.add(id, user.user_id);
  }
}
