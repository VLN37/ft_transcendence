import { Logger, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { MatchMakingService } from './match-making.service';

@WebSocketGateway({
  namespace: '/match-making',
  cors: {
    origin: '*',
  },
})
export class MatchMakingGateway {
  private readonly logger = new Logger(MatchMakingGateway.name);

  constructor(private readonly matchMakingService: MatchMakingService) {}

  @SubscribeMessage('enqueue')
  handleQueueRequest(@MessageBody() body: any) {
    this.logger.debug('new message for event "enqueue"', { body });
    this.matchMakingService.enqueue(
      {
        id: 42,
        login_intra: 'psergio-',
        tfa_enabled: false,
        tfa_secret: null,
      },
      body.matchType,
    );
  }

  @SubscribeMessage('dequeue')
  handleDequeueRequest() {
    this.logger.debug('new message for event "dequeue"');
    this.matchMakingService.dequeue({
      id: 42,
      login_intra: 'psergio-',
      tfa_enabled: false,
      tfa_secret: null,
    });
  }
}
