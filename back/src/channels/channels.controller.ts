import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { ChannelsInterceptor } from './channels.interceptor';
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
}
