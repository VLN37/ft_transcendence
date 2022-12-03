import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { validateWsJwt } from 'src/utils/functions/validateWsConnection';
import { MatchManagerService } from './match-manager.service';

@WebSocketGateway({
  namespace: '/match-manager',
  cors: {
    origin: '*',
  },
})
export class MatchManagerGateway implements OnGatewayInit {
  private readonly logger = new Logger(MatchManagerGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private matchManager: MatchManagerService,
  ) {}

  afterInit(server: any) {
    this.logger.debug('match-manager gateway afterInit');
    this.server.use((socket, next) => {
      validateWsJwt(this.usersService, this.jwtService, socket)
        .then((user) => {
          this.logger.debug('user validated');
          socket.handshake.auth['user'] = user;

          next();
        })
        .catch((err) => {
          return next(new Error(err));
        });
    });
  }

  @SubscribeMessage('connect-as-player')
  async connectAsPlayer(
    @MessageBody('match_id') matchId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.handshake.auth.user;
    const playerId = user.id;
    this.matchManager.connectPlayer(matchId, playerId);
  }
}
