import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TokenPayload } from 'src/auth/dto/TokenPayload';
import { UsersService } from 'src/users/users.service';
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
          const type = socket.handshake.query.type;

          if (type != 'CLASSIC' && type != 'TURBO') {
            this.logger.error('invalid queue type: ' + type);
            return next(new Error('Invalid queue type'));
          }

          socket.handshake.auth['user'] = user;
          next();
        })
        .catch((err) => {
          return next(new Error(err));
        });
    });
  }

  async handleConnection(client: Socket) {
    const user = client.handshake.auth['user'];
    const type = client.handshake.query.type as 'CLASSIC' | 'TURBO';
    this.logger.debug(`new connection from client ${client.id}`);
    this.matchMakingService.enqueue(user, type);
  }

  handleDisconnect(client: Socket) {
    const user = client.handshake.auth['user'];
    this.matchMakingService.dequeue(user);
    this.logger.debug(`client ${client.id} disconnected`);
  }

  private validateConnection(client: Socket) {
    const token = client.handshake.auth.token;
    try {
      const payload = this.jwtService.verify<TokenPayload>(token, {
        secret: process.env.JWT_SECRET,
      });
      return this.usersService.findCompleteUserById(payload.sub);
    } catch {
      throw new WsException('Token invalid or expired');
    }
  }
}
