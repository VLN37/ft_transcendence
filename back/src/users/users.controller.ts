import {
  Controller,
  Param,
  Body,
  Get,
  Patch,
  Post,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() user: any) {
    return this.usersService.create(user);
  }

  @Post(':id/friends')
  async addFriend(@Param('id') id: any, @Body() friend: any) {
    const friendId = friend.id;
    const user = await this.usersService.findOne(id);
    return this.usersService.addFriend(user, friendId);
  }

  @Patch(':id')
  edit(@Param('id') id: any, @Body() user: any) {
    return this.usersService.edit(id, user);
  }

  @Delete(':id')
  delete(@Param('id') id: any) {
    return this.usersService.delete(id);
  }

  @Get()
  get() {
    return this.usersService.get();
  }

  @Get(':id')
  findOne(@Param('id') id: any) {
    return this.usersService.findOne(id);
  }
}
