import { Controller, Get, Param } from '@nestjs/common';
import { BlockedService } from './blocked.service';

@Controller('/users/:id/blocked_users')
export class BlockedController {
  constructor(private readonly blockedService: BlockedService) {}

  @Get()
  async get(@Param('id') id: number) {
    return await this.blockedService.get(id);
  }
}
