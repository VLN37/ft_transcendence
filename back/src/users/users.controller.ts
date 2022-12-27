import {
  Controller,
  Param,
  Body,
  Get,
  Patch,
  Post,
  Delete,
  Query,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
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
  delete(@Param('id') id: number) {
    return this.usersService.delete(id);
  }

  @Get()
  getAll(@Query('sort') sort: string, @Query('order') order: string) {
    return this.usersService.getAll(sort, order);
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.usersService.getOne(id);
  }

  @Get('/v2/me')
  getMe(@Headers('Authorization') token: string) {
    return this.usersService.getMe(token);
  }
}
