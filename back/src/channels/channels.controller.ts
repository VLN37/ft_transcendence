import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Headers,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import {
  ChannelsDeleteInterceptor,
  ChannelsGetAllInterceptor,
  ChannelsGetMessagesInterceptor,
  ChannelsInterceptor,
} from './channels.interceptor';
import { ChannelsService } from './channels.service';
import { ChannelDto } from './dto/channel.dto';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get('generate/:amount')
  generateChannels(@Param('amount') amount: number) {
    return this.channelsService.generateChannels(amount);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(ChannelsInterceptor)
  create(@Body() dto: ChannelDto) {
    return this.channelsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @UseInterceptors(ChannelsGetAllInterceptor)
  getAll() {
    return this.channelsService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @UseInterceptors(ChannelsInterceptor)
  getOne(@Param('id') id: number) {
    return this.channelsService.getOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/messages')
  @UseInterceptors(ChannelsGetMessagesInterceptor)
  getMessages(@Param('id') id: number) {
    return this.channelsService.getMessages(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @UseInterceptors(ChannelsDeleteInterceptor)
  delete(@Param('id') id: number) {
    //TODO: disconnect all users from this channel/socket
    return this.channelsService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':channel/admin/:id')
  addAdmin(
    @Headers('Authorization') token: string,
    @Param('id') target: number,
    @Param('channel') channel: number,
  ) {
    this.channelsService.addAdmin(token, channel, target);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':channel/admin/:id')
  delAdmin(
    @Headers('Authorization') token: string,
    @Param('id') target: number,
    @Param('channel') channel: number,
  ) {
    this.channelsService.delAdmin(token, channel, target);
  }
}
