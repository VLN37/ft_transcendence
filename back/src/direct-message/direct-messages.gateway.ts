import { Logger, OnApplicationBootstrap } from '@nestjs/common';
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
import { Server, Socket } from 'socket.io';
import { DirectMessagesService } from './direct-messages.service';
import {
  iFriendRequestWsPayload,
  UserMessage,
} from './direct-messages.interface';
import { UserDto } from 'src/users/dto/user.dto';
import { FriendRequestsService } from 'src/users/friend_requests/friend_requests.service';
import { UsersService } from 'src/users/users.service';
import { ChannelsService } from 'src/channels/channels.service';
import { ChannelDto } from 'src/channels/dto/channel.dto';
import { MatchManagerService } from 'src/match-manager/match-manager.service';
import { Match } from 'src/entities/match.entity';
import { MatchManager } from 'src/match-manager/match-manager';

@WebSocketGateway({
  namespace: '/direct_messages',
  cors: {
    origin: '*',
  },
})
export class DirectMessagesGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnApplicationBootstrap
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(DirectMessagesGateway.name);
  private usersSocketId = [];

  constructor(
    private dmService: DirectMessagesService,
    private jwtService: JwtService,
    private friendRequestsService: FriendRequestsService,
    private usersService: UsersService,
    private channelsService: ChannelsService,
    private matchManagerService: MatchManagerService,
    private matchManager: MatchManager,
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

  onApplicationBootstrap() {
    this.friendRequestsService.setNotify(this.pingFriendRequest.bind(this));
    this.usersService.setNotify(this.pingUserUpdate.bind(this));
    this.channelsService.setNotify(this.pingChannelUpdate.bind(this));
    this.matchManagerService.setInviteNotify(this.pingGameRequest.bind(this));
    this.matchManagerService.setUpdateNotify(
      this.pingUpdateGameRequest.bind(this),
    );
    this.matchManager.setNotify(this.pingMatchUpdate.bind(this));
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
    this.server.to(toUser).emit('chat_notify', newMessage);
  }

  async pingFriendRequest(receiver: number, data: iFriendRequestWsPayload) {
    const receiverSocket = this.usersSocketId[receiver];
    // this.logger.error('socket: ', receiverSocket);
    if (!receiverSocket) return;
    this.server.to(receiverSocket).emit('friend_request', data);
  }

  async pingStatusChange(receiver: string[], user: UserDto) {
    if (!receiver.length) return;
    return this.server.to(receiver).emit('user_status', { user: user });
  }

  async pingUserUpdate(receiver: number, user: UserDto) {
    const receiverSocket = this.usersSocketId[receiver];
    return this.server.to(receiverSocket.toString()).emit('user_updated', user);
  }

  pingChannelUpdate(event: string, channel: ChannelDto) {
    this.server.emit('channel_status', {
      event,
      channel,
    });
  }

  pingMatchUpdate(event: string, match: Match) {
    this.server.emit('match_status', {
      event,
      match,
    });
  }

  pingGameRequest(receiver: number, user: UserDto) {
    const receiverSocket = this.usersSocketId[receiver];
    if (!receiverSocket) return;
    this.server.to(receiverSocket.toString()).emit('invite', { data: user });
  }

  pingUpdateGameRequest(
    status: string,
    user1: UserDto,
    user2: UserDto,
    id: string,
  ) {
    const receiverSocket1 = this.usersSocketId[user1.id];
    const receiverSocket2 = this.usersSocketId[user2.id];
    if (!receiverSocket1 || !receiverSocket2) return;
    this.server.to(receiverSocket1.toString()).emit('update', {
      data: {
        status,
        id,
        host: true,
        user: user2,
      },
    });
    this.server.to(receiverSocket2.toString()).emit('update', {
      data: {
        status,
        id,
        host: false,
        user: user1,
      },
    });
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
