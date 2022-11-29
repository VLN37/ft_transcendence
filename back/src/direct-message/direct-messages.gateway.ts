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
import { iDirectMessage, UserMessage } from './direct-messages.interface';
import { UserDto } from 'src/users/dto/user.dto';
import { faker } from '@faker-js/faker';

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
    this.logger.warn(this.usersSocketId);
  }

  async handleDisconnect(client: Socket) {
    const token = client.handshake.auth.token;
    const userId = (await this.usersService.getUserId(token)).toString();
    delete this.usersSocketId[userId];
    this.logger.log(`Client disconnected ${client.id}`);
  }

  @SubscribeMessage('chat')
  async handleMessage(client: Socket, data: UserMessage) {
    const token = client.handshake.auth.token;
    const fromUser: UserDto = await this.usersService.getMe(token);
    const toUser = this.usersSocketId[data.user_id] || '';
	const ID = faker.random.numeric();
    const newMessage: iDirectMessage = {
      id: parseInt(ID),
      message: data.message,
      user: fromUser,
    };
    //receiver
    this.server.to(toUser).emit('chat', newMessage);
    //sender
    this.server.to(client.id).emit('chat', newMessage);
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
