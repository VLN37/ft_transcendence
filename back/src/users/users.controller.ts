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
  forwardRef,
  Inject,
} from '@nestjs/common';
import { DirectMessagesGateway } from 'src/direct-message/direct-messages.gateway';
import { DirectMessagesService } from 'src/direct-message/direct-messages.service';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => DirectMessagesGateway))
    private readonly dmService: DirectMessagesGateway
  ) {}

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

  @Get('me')
  getMe(@Headers('Authorization') token: string) {
    return this.usersService.getMe(token);
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.usersService.getOne(id);
  }
}
