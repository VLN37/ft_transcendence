import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { validateWsJwt } from 'src/utils/functions/validateWsConnection';
import { MatchManager } from './match-manager';
import { PlayerCommand } from './model/PlayerCommands';

@WebSocketGateway({
  namespace: '/match-manager',
  cors: {
    origin: '*',
  },
})
export class MatchManagerGateway implements OnGatewayInit, OnGatewayDisconnect {
  private readonly logger = new Logger(MatchManagerGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private matchManager: MatchManager,
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
    try {
      this.logger.debug('match id: ', matchId);
      this.matchManager.connectPlayer(matchId, playerId);
      this.matchManager.setMatchTickHandler(matchId, (matchState) => {
        this.server.in(matchId).emit('match-tick', matchState);
      });
      client.join(matchId);
    } catch (e) {
      this.logger.warn('error connecting player', e);
      throw new WsException(e);
    }
  }

  @SubscribeMessage('player-command')
  async handlePlayerCommand(
    @MessageBody('match_id') matchId: string,
    @MessageBody('command') command: PlayerCommand,
    @ConnectedSocket() client: Socket,
  ) {
    // TODO: drop commands that are not sent by a player
    const user: UserDto = client.handshake.auth['user'];
    this.matchManager.handlePlayerCommand(user.id, command, matchId);
  }

  handleDisconnect(client: Socket) {
    try {
      const user: UserDto = client.handshake.auth['user'];
      this.matchManager.disconnectPlayer(user.id);
    } catch (e) {
      this.logger.warn('error disconnecting player', e);
    }
  }
}
