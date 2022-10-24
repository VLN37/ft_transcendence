import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelDto } from './dto/channel.dto';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get('generate/:amount')
  generateChannels(@Param('amount') amount: number) {
    return this.channelsService.generateChannels(amount);
  }

  @Post()
  create(@Body() dto: ChannelDto) {
    return this.channelsService.create(dto);
  }

  @Get()
  getAll() {
    return this.channelsService.getAll();
  }
}
