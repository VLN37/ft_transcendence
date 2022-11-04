import { Body, Controller, Logger, Post, Req } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import { Request } from 'express';
import { Socket } from 'socket.io';

import { MatchType } from './dto/AppendToQueueDTO';
import { MatchMakingService } from './match-making.service';

@Controller('match-making')
export class MatchMakingController {
  private readonly logger = new Logger(MatchMakingController.name);

  constructor(private matchMakingService: MatchMakingService) {}

  @Post()
  enqueue(
    @Req() req: Request,
    @Body('type') matchType: MatchType,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.debug(`match type: ${matchType}`);
    const user = req.user;

    const result = this.matchMakingService.enqueue(user, matchType);

    client.emit('enqueue-respose', {
      message: 'Hello, world',
    });

    return 'feito';
  }
}
