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
import {
  iFriendRequestWsPayload,
  UserMessage,
} from './direct-messages.interface';
import { UserDto } from 'src/users/dto/user.dto';

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
    try {
      const userId = (await this.usersService.getUserId(token)).toString();
      const me = await this.usersService.getMe(token);
      me.profile.status = 'ONLINE';
      await this.usersService.update(me);
      this.usersSocketId[userId] = client.id;
      const updateStatus = [];
      for (const index in me.friends)
        updateStatus.push(this.usersSocketId[me.friends[index].id]);
      this.pingStatusChange(updateStatus, me);
      this.logger.log(`Client connected ${client.id} ${me.login_intra}`);
    } catch (error) {
      this.logger.error(`handleConnection ${error}`);
    }
  }

  async handleDisconnect(client: Socket) {
    const token = client.handshake.auth.token;
    try {
      const userId = (await this.usersService.getUserId(token)).toString();
      const me = await this.usersService.getMe(token);
      me.profile.status = 'OFFLINE';
      await this.usersService.update(me);
      delete this.usersSocketId[userId];
      const updateStatus = [];
      for (const index in me.friends)
        updateStatus.push(this.usersSocketId[me.friends[index].id]);
      this.pingStatusChange(updateStatus, me);
      this.logger.log(`Client disconnected ${client.id} ${me.login_intra}`);
    } catch (error) {
		this.logger.error(`handleDisconnect ${error}`);
    }
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
    // this.logger.error('socket: ', receiverSocket);
    if (!receiverSocket) return;
    this.server.to(receiverSocket).emit('friend_request', data);
  }

  async pingStatusChange(receiver: string[], user: UserDto) {
    console.log('to aqui', {data: user});
    console.log('to aqui', receiver);
    if (!receiver.length) {
      console.log('nothing to report')
      return;
    }
    return this.server.to(receiver).emit('user_status', { user: user });
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
