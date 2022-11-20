import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { BlockedService } from './blocked.service';

@Controller('/users/:target/blocked_users')
export class BlockedController {
  constructor(private readonly blockedService: BlockedService) {}

  @Get()
  async get(@Param('target') me: number) {
    return await this.blockedService.get(me);
  }

  @HttpCode(201)
  @Post()
  async block(@Param('target') target: number, @Body('user_id') me: number) {
    return await this.blockedService.block(me, target);
  }

  @Delete()
  async unblock(@Param('target') me: number, @Body('user_id') target: number) {
    return await this.blockedService.unblock(me, target);
  }
}
