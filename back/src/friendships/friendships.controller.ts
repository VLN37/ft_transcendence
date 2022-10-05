import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { FriendshipsService } from './friendships.service';

@Controller('friends')
export class FriendshipsController {
  constructor(private readonly friendshipsService: FriendshipsService) {}

  @Post(':id/add')
  async add(@Param('id') id: any, @Body() user: any) {
    return await this.friendshipsService.add(id, user.user_id);
  }

  @Delete(':id/remove')
  async remove(@Param('id') id: any, @Body() user: any) {
    return await this.friendshipsService.remove(id, user.user_id);
  }

  @Post(':id/accept')
  async accept(@Param('id') id: any, @Body() user: any) {
    return await this.friendshipsService.accept(id, user.user_id);
  }
}
