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
import { UsersService } from 'src/users/users.service';
import { Server, Socket } from 'socket.io';
import { DirectMessagesService } from './direct-messages.service';
import { iFriendRequestWsPayload, UserMessage } from './direct-messages.interface';

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
  private usersSocketId = [];

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

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    const userId = (await this.usersService.getUserId(token)).toString();
    this.usersSocketId[userId] = client.id;
    this.logger.log(`Client connected ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    const token = client.handshake.auth.token;
    const userId = (await this.usersService.getUserId(token)).toString();
    delete this.usersSocketId[userId];
    this.logger.log(`Client disconnected ${client.id}`);
  }

  @SubscribeMessage('chat')
  async handleMessage(client: Socket, data: UserMessage) {
    const fromUser = client.id;
    const toUser = this.usersSocketId[data.user_id] || '';
    const newMessage = await this.dmService.saveMessage(client, data);
    //sender
    this.server.to(fromUser).emit('chat', newMessage);
    //receiver
    this.server.to(toUser).emit('chat', newMessage);
  }

  async pingFriendRequest(receiver: number, data: iFriendRequestWsPayload) {
    const receiverSocket = this.usersSocketId[receiver];
    if (!receiverSocket) return;
    this.server.to(receiverSocket).emit('friend_request', data);
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
