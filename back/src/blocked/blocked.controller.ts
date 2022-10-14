import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { BlockedService } from './blocked.service';

@Controller('/users/:from/blocked_users')
export class BlockedController {
  constructor(private readonly blockedService: BlockedService) {}

  @Get()
  async get(@Param('from') from: number) {
    return await this.blockedService.get(from);
  }

  @Post()
  async block(@Param('from') from: number, @Body('user_id') to: number) {
    return await this.blockedService.block(from, to);
  }

  @Delete(':to')
  async unblock(@Param('from') from: number, @Param('to') to: number) {
    return await this.blockedService.unblock(from, to);
  }
}
