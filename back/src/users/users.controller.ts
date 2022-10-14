import {
  Controller,
  Param,
  Body,
  Get,
  Patch,
  Post,
  Delete,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: UserDto) {
    return this.usersService.create(dto);
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
    return this.usersService.getSingleUser(id);
  }
}
