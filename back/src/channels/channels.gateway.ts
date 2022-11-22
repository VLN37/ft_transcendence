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
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { ChannelRoomAuth, ChannelRoomMessage } from './channels.interface';
import { ChannelsService } from './channels.service';
import { ChannelDto } from './dto/channel.dto';
import * as bcrypt from 'bcrypt';

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
    private channelsService: ChannelsService,
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
  async handleJoin(client: Socket, data: ChannelRoomAuth) {
    const invalidJoin = await this.joinChannel(client, data);
    if (invalidJoin) return invalidJoin;
    this.logger.log(`Client ${client.id} connected to the room ${data.room}`);
    return { status: 200, message: 'Ok' };
  }

  @SubscribeMessage('chat')
  async handleMessage(client: Socket, data: ChannelRoomMessage) {
    this.logger.debug('Received a message from ' + client.id);
    this.logger.debug('Sending a message to ' + client.id);
    const newMessage = await this.channelsService.saveMessage(client, data);
    this.server.to(newMessage.channel.id.toString()).emit('chat', newMessage);
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

  private async joinChannel(client: Socket, data: ChannelRoomAuth) {
    if (!data || !data.room)
      return { status: 400, message: 'Invalid channel data' };

    const token = client.handshake.auth.token;
    const user: UserDto = await this.usersService.getMe(token);
    const channel: ChannelDto = await this.channelsService.getOne(data.room);

    if (channel.type == 'PRIVATE') {
      if (
        channel.owner_id != user.id &&
        !channel.allowed_users.find(
          (channel_user) => channel_user.id == user.id,
        )
      ) {
        return {
          status: 403,
          message: 'You are not allowed to join this channel',
        };
      }
    }
    if (channel.type == 'PROTECTED') {
      const isMatch = await bcrypt.compare(data.password, channel.password);
      if (!isMatch) return { status: 401, message: 'Invalid password' };
    }
    if (!channel.users.find((channel_user) => channel_user.id == user.id)) {
      user.channels.push(channel);
      this.usersService.update(user);
    }
    client.join(data.room.toString());
    return null;
  }
}
