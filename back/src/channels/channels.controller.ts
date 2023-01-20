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
  Patch,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import {
  ChannelsDeleteInterceptor,
  ChannelsGetAllInterceptor,
  ChannelsGetMessagesInterceptor,
  ChannelsInterceptor,
} from './channels.interceptor';
import { ChannelsService } from './channels.service';
import { ChannelDto } from './dto/channel.dto';

@UseGuards(JwtAuthGuard)
@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  @UseInterceptors(ChannelsInterceptor)
  create(@Body() dto: ChannelDto) {
    return this.channelsService.create(dto);
  }

  @Get()
  @UseInterceptors(ChannelsGetAllInterceptor)
  getAll() {
    return this.channelsService.getAll();
  }

  @Get(':id')
  @UseInterceptors(ChannelsInterceptor)
  getOne(@Param('id') id: number) {
    return this.channelsService.getOne(id);
  }

  @Get(':id/messages')
  @UseInterceptors(ChannelsGetMessagesInterceptor)
  getMessages(@Param('id') id: number) {
    return this.channelsService.getMessages(id);
  }

  @Patch(':id')
  updateChannel(
    @Req() request: Request,
    @Body()
    data: {
      channel: ChannelDto;
      oldPassword: string | null;
      newPassword: string | null;
    },
  ) {
    return this.channelsService.updateChannel(request.user, data);
  }

  @Post(':channel/ban/:id')
  banUser(
    @Req() req: Request,
    @Param('channel') channelId: number,
    @Param('id') userId,
    @Body('seconds') time: number,
  ) {
    return this.channelsService.banUser(req.user, channelId, userId, time);
  }

  @Delete(':channel/ban/:id')
  unbanUser(
    @Req() req: Request,
    @Param('channel') channelId: number,
    @Param('id') userId,
  ) {
    return this.channelsService.unbanUser(req.user, channelId, userId);
  }

  @Delete(':id')
  @UseInterceptors(ChannelsDeleteInterceptor)
  delete(@Param('id') id: number) {
    //TODO: disconnect all users from this channel/socket
    return this.channelsService.delete(id);
  }

  @Post(':channel/admin/:id')
  addAdmin(
    @Headers('Authorization') token: string,
    @Param('id') target: number,
    @Param('channel') channel: number,
  ) {
    return this.channelsService.addAdmin(token, channel, target);
  }

  @Delete(':channel/admin/:id')
  delAdmin(
    @Headers('Authorization') token: string,
    @Param('id') target: number,
    @Param('channel') channel: number,
  ) {
    return this.channelsService.delAdmin(token, channel, target);
  }

  @Delete(':id/leave')
  leaveChannel(
    @Headers('Authorization') token: string,
    @Param('id') id: number,
  ) {
    return this.channelsService.leaveChannel(token, id);
  }
}
