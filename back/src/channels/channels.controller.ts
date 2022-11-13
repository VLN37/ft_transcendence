import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import {
  ChannelsDeleteInterceptor,
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
  @UseInterceptors(ChannelsInterceptor)
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
  @Delete(':id')
  @UseInterceptors(ChannelsDeleteInterceptor)
  delete(@Param('id') id: number) {
    //TODO: disconnect all users from this channel/socket
    return this.channelsService.delete(id);
  }
}
