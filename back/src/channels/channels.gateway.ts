import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
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
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({
  namespace: '/channel',
  cors: {
    origin: '*',
  },
})
export class ChannelsSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChannelsSocketGateway.name);

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  afterInit(_: Server) {
    this.logger.debug('channel gateway afterInit');
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

  handleConnection(client: any) {
    this.logger.log(`Client connected ${client.id}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected ${client.id}`);
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, room: string): void {
    client.join(room);
    console.log(`Client connected to the room ${room}`);
  }

  @SubscribeMessage('chat')
  handleMessage(client: Socket, data): void {
    this.logger.debug('Received a message from ' + client.id);
    this.logger.debug('Sending a message to ' + client.id);
    this.server.to(data.room).emit('chat', data);
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
