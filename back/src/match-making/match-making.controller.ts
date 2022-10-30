import { Body, Controller, Logger, Post, Req } from '@nestjs/common';
import { Request } from 'express';

import { MatchType } from './dto/AppendToQueueDTO';
import { MatchMakingService } from './match-making.service';

@Controller('match-making')
export class MatchMakingController {
  private readonly logger = new Logger(MatchMakingController.name);

  constructor(private matchMakingService: MatchMakingService) {}

  @Post()
  enqueue(@Req() req: Request, @Body('type') matchType: MatchType) {
    this.logger.debug(`match type: ${matchType}`);
    const user = req.user;

    this.matchMakingService.enqueue(user, matchType);
  }
}
