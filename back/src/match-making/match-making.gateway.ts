import { Logger, NotImplementedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MemoryMatch } from 'src/match-manager/model/MemoryMatch';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { validateWsJwt } from 'src/utils/functions/validateWsConnection';
import { MatchType } from './dto/MatchType';
import { MatchMakingService } from './match-making.service';

@WebSocketGateway({
  namespace: 'match-making',
  cors: {
    origin: '*',
  },
})
export class MatchMakingGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private readonly logger = new Logger(MatchMakingGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly matchMakingService: MatchMakingService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  afterInit(_: Server) {
    this.logger.debug('match-making gateway afterInit');
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

  async handleConnection(client: Socket) {
    this.logger.debug(
      `new connection from client ${client.handshake.auth.user.login_intra}`,
    );
  }

  @SubscribeMessage('enqueue')
  async enqueue(
    @MessageBody('type') type: MatchType,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const user = await this.getUser(client);
      const matchAvailable = this.matchMakingService.enqueue(user, type);
      client.join(user.login_intra); // only the user

      if (matchAvailable) {
        this.logger.debug('match created, notifying players');
        const notifyPlayers = () => {
          this.server
            .to(matchAvailable.user1.login_intra)
            .to(matchAvailable.user2.login_intra)
            .emit('match-found');
        };

        setTimeout(notifyPlayers, 200);
      }
    } catch (e) {
      this.logger.error('socket exception caught', {e});
      this.server.to(e.response.recipient).emit('mm-failed', {
        message: e.response.message,
        match: e.response.match,
      });
      throw new WsException(e);
    }
  }

  private async dequeueUser(client: Socket) {
    const user = client.handshake.auth['user'];
    this.matchMakingService.dequeueUser(user.id);
    try {
    } catch (e) {
      throw new WsException(e);
    }
  }

  @SubscribeMessage('dequeue')
  dequeue(@ConnectedSocket() client: Socket) {
    this.dequeueUser(client);
  }

  @SubscribeMessage('accept')
  async accept(@ConnectedSocket() client: Socket) {
    const user: UserDto = client.handshake.auth['user'];
    const result = await this.matchMakingService.acceptMatch(user);
    if ('login_intra' in result) {
      this.notifyMatchMakingUpdate(result.login_intra, 'ACCEPTED');
    } else {
      this.notifyMatchCreated(result);
    }
  }

  @SubscribeMessage('decline')
  decline(@ConnectedSocket() client: Socket) {
    const user: UserDto = client.handshake.auth['user'];
    const otherUser = this.matchMakingService.declineMatch(user);
    this.notifyMatchMakingUpdate(otherUser.login_intra, 'DECLINED');
  }

  handleDisconnect(client: Socket) {
    this.dequeueUser(client);
    this.logger.debug(`client ${client.id} disconnected`);
  }

  notifyMatchMakingUpdate(user: string, state: string) {
    this.server.to(user).emit('match-making-update', state);
  }

  notifyMatchCreated(match: MemoryMatch) {
    this.server
      .to(match.left_player.login_intra)
      .to(match.right_player.login_intra)
      .emit('match-created', { id: match.id });
  }

  private async getUser(client: Socket) {
    const user = client.handshake.auth['user'];
    return this.usersService.findOne(user.id);
  }
}
