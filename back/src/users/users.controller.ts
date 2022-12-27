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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  edit(@Param('id') id: number, @Body() user: UserDto) {
    return this.usersService.edit(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.usersService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(@Query('sort') sort: string, @Query('order') order: string) {
    return this.usersService.getAll(sort, order);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.usersService.getOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/v2/me')
  getMe(@Headers('Authorization') token: string) {
    return this.usersService.getMe(token);
  }
}
