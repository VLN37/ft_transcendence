import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  WsException,
} from '@nestjs/websockets';
import { TokenPayload } from 'src/auth/dto/TokenPayload';
import { ChannelRoomMessage } from 'src/channels/channels.interface';
import { UsersService } from 'src/users/users.service';
import { Server, Socket } from 'socket.io';
import { DirectMessagesService } from './direct-messages.service';

@WebSocketGateway({
  namespace: '/direct_messages',
  cors: {
    origin: '*',
  },
})
export class DirectMessagesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(DirectMessagesGateway.name);

  constructor(
    private dmService: DirectMessagesService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  afterInit(_: Server) {
    this.logger.debug('Direct message gateway afterInit');
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

  @SubscribeMessage('chat')
  async handleMessage(client: Socket, data: ChannelRoomMessage) {
    // this.logger.debug('Received a message from ' + client.id);
    // this.logger.debug('Sending a message to ' + client.id);
    // const newMessage = await this.channelsService.saveMessage(client, data);
    // this.server.to(newMessage.channel.id.toString()).emit('chat', newMessage);
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
