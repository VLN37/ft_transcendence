import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { BlockedService } from './blocked.service';

@Controller('/users/:target/blocked_users')
export class BlockedController {
  private readonly logger = new Logger(BlockedService.name);

  constructor(private readonly blockedService: BlockedService) {}

  @Get()
  async get(@Param('target') me: number) {
    this.logger.log('list of blocked users request received');
    return await this.blockedService.get(me);
  }

  @HttpCode(201)
  @Post()
  async block(@Param('target') target: number, @Body('user_id') me: number) {
    this.logger.log('User block request received');
    return await this.blockedService.block(me, target);
  }

  @Delete()
  async unblock(@Param('target') me: number, @Body('user_id') target: number) {
    this.logger.log('User unblock request received');
    return await this.blockedService.unblock(me, target);
  }
}
