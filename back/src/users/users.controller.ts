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

  //dev
  @Post()
  create(@Body() dto: UserDto) {
    return this.usersService.create(dto);
  }

  //dev
  @Get('generate/:amount')
  generateUsers(@Param('amount') amount: number) {
    return this.usersService.generateUsers(amount);
  }

  @Patch(':id')
  edit(@Param('id') id: number, @Body() user: UserDto) {
    return this.usersService.edit(id, user);
  }

  @Delete(':id')
  delete(@Param('id') id: any) {
    return this.usersService.delete(id);
  }

  @Get()
  getAll() {
    return this.usersService.getAll();
  }

  @Get(':id')
  findOne(@Param('id') id: any) {
    return this.usersService.getSingleUser(id);
  }
}
