import { Logger } from '@nestjs/common';
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
import { TokenPayload } from 'src/auth/dto/TokenPayload';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { MatchType } from './dto/AppendToQueueDTO';
import { MatchMakingService } from './match-making.service';

@WebSocketGateway({
  namespace: '/match-making',
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
      this.validateConnection(socket)
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
      const userDto: UserDto = client.handshake.auth['user'];
      const user = await this.usersService.findOne(userDto.id);
      const createdMatch = await this.matchMakingService.enqueue(user, type);
      client.join(userDto.login_intra); // only the user
      if (createdMatch) {
        const notifyPlayers = () => {
          const matchData = {
            id: createdMatch.id,
          };
          this.server
            .in(createdMatch.left_player.login_intra)
            .in(createdMatch.right_player.login_intra)
            .emit('match-found', {
              matchData,
            });
        };
        setTimeout(notifyPlayers, 1000);
      }
    } catch (e) {
      throw new WsException(e);
    }
  }

  private dequeueUser(client: Socket) {
    try {
      const user = client.handshake.auth['user'];
      this.matchMakingService.dequeue(user);
    } catch (e) {
      throw new WsException(e);
    }
  }

  @SubscribeMessage('dequeue')
  dequeue(@ConnectedSocket() client: Socket) {
    this.dequeueUser(client);
  }

  handleDisconnect(client: Socket) {
    this.dequeueUser(client);
    this.logger.debug(`client ${client.id} disconnected`);
  }

  private async validateConnection(client: Socket) {
    this.logger.debug('validating ws user connection');
    const token = client.handshake.auth.token;
    try {
      const payload = this.jwtService.verify<TokenPayload>(token, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.usersService.findCompleteUserById(payload.sub);
      if (!user) throw new Error();
      return user;
    } catch {
      throw new WsException('Token invalid or expired');
    }
  }
}
