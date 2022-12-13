import { faker } from '@faker-js/faker';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isArray, isString } from 'class-validator';
import { Channel } from 'src/entities/channel.entity';
import { UsersService } from 'src/users/users.service';
import { MoreThan, Repository } from 'typeorm';
import { ChannelDto } from './dto/channel.dto';
import * as bcrypt from 'bcrypt';
import { ChannelRoomMessage, Message } from './channels.interface';
import { ChannelMessages } from 'src/entities/channel_messages.entity';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/users/dto/user.dto';
import { BannedUsers } from 'src/entities/channel.banned.entity';
import { ChannelsSocketGateway } from './channels.gateway';

@Injectable()
export class ChannelsService {
  private readonly logger = new Logger(ChannelsService.name);

  constructor(
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
    @InjectRepository(ChannelMessages)
    private channelsMesssagesRepository: Repository<ChannelMessages>,
    @InjectRepository(BannedUsers)
    private bannedUsersRepository: Repository<BannedUsers>,
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(forwardRef(() => ChannelsSocketGateway))
    private channelsSocketGateway: ChannelsSocketGateway,
  ) {}

  async generateChannels(amount: number) {
    const statusArr = ['PUBLIC', 'PRIVATE', 'PROTECTED'];
    let users = await this.usersService.getAll();
    users = users.filter((user, i) => {
      if (i < 4) return user;
    });

    for (let i = 0; i < amount; i++) {
      const status: any = statusArr[faker.datatype.number({ min: 0, max: 2 })];
      await this.channelsRepository.save({
        name: faker.name.jobArea().toLocaleLowerCase(),
        owner_id: i,
        type: status,
        password: await this.hashPass('12345678'),
        allowed_users: users,
      });
    }
    return this.getAll();
  }

  async banUser(token: Express.User, chId: number, ban: number, time: number) {
    const channel: ChannelDto = await this.getOne(chId);
    if (!time) throw new BadRequestException('missing time parameter');
    if (channel.banned_users.find((elem) => elem.user_id == ban))
      throw new BadRequestException('User is already banned');
    if (!channel.admins.find((elem) => elem.id == token.id))
      throw new BadRequestException('You are not an admin of this channel');
    if (!channel.users.find((elem) => elem.id == token.id))
      throw new BadRequestException('User is not in the channel');
    this.channelsSocketGateway.removeUser(ban, chId.toString());
    channel.users = channel.users.filter((user) => user.id != ban);
    channel.admins = channel.admins.filter((user) => user.id != ban);
    channel.allowed_users = channel.allowed_users.filter(
      (user) => user.id != ban,
    );
    await this.update(channel);
    const date = new Date();
    date.setSeconds(date.getSeconds() + time);
    this.logger.debug(`User ${ban} banned`);
    return this.bannedUsersRepository.save({
      user_id: ban,
      channel: { id: channel.id },
      expiration: date.toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
      }),
    });
  }

  async unbanUser(token: Express.User, chId: number, unban: number) {
    const channel: ChannelDto = await this.getOne(chId);
    if (!channel.admins.find((elem) => elem.id == token.id))
      throw new BadRequestException('you are not an admin of this channel');
    if (!channel.users.find((elem) => elem.id == token.id))
      throw new BadRequestException('user is not in the channel');
    return this.bannedUsersRepository.delete({ user_id: unban });
  }

  async create(channel: ChannelDto): Promise<Channel> {
    const invalidChannel = this.validateChannel(channel);
    if (invalidChannel) throw new BadRequestException(invalidChannel);
    const newChannel = await this.channelsRepository
      .save({
        name: channel.name,
        owner_id: channel.owner_id,
        type: channel.type,
        password: await this.hashPass(channel.password),
        allowed_users: await this.usersService.findManyByNickname(
          channel.allowed_users as string[],
        ),
        admins: [{ id: channel.owner_id }],
      })
      .catch((err: any) => {
        console.log(err);
        throw new BadRequestException('Channel: ' + err?.driverError);
      });
    this.logger.debug('Channel created', { newChannel });
    return newChannel;
  }

  async updateChannel(user: Express.User, data: any) {
    const channel: ChannelDto = await this.getOne(data.channel.id);
    if (!channel) throw new NotFoundException('Channel does not exist');
    if (data.channel.owner_id != user.id) {
      throw new BadRequestException({
        statusCode: 403,
        message: 'you are not the owner of this channel',
      });
    }
    if (data.oldPassword && data.newPassword) {
      const isMatch = await bcrypt.compare(data.oldPassword, channel.password);
      if (!isMatch) throw new BadRequestException('Incorrect password');
      data.channel.password = await this.hashPass(data.newPassword);
      this.logger.debug('Channel password updated');
    } else if (data.oldPassword && !data.newPassword) {
      const isMatch = await bcrypt.compare(data.oldPassword, channel.password);
      if (!isMatch) throw new BadRequestException('Incorrect password');
      delete data.channel.password;
      this.logger.debug('Channel password removed');
    } else if (!data.oldPassword && data.newPassword) {
      data.channel.password = await this.hashPass(data.newPassword);
      this.logger.debug('Channel password created');
    } else throw new BadRequestException('invalid api call');
    delete data.channel.allowed_users;
    const invalidChannel = this.validateChannel(data.channel);
    if (invalidChannel) throw new BadRequestException(invalidChannel);
    delete data.channel.users;
    delete data.channel.channel_messages;
    delete data.channel.admins;
    delete data.channel.banned_users;
    this.logger.debug('Channel updated', data.channel);
    return this.channelsRepository.update(
      { id: data.channel.id },
      data.channel,
    );
  }

  async getAll(): Promise<ChannelDto[]> {
    const channels = await this.channelsRepository.find({
      relations: ['allowed_users.profile'],
    });
    // this.logger.debug('Returning channels', { channels });
    this.logger.debug('Returning channels');
    return channels;
  }

  async getOne(id: number): Promise<ChannelDto> {
    const date = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
    });
    const localeDate = new Date(date);
    const channel = await this.channelsRepository.findOne({
      relations: [
        'users',
        'users.profile',
        'allowed_users.profile',
        'channel_messages.user.profile',
        'channel_messages.channel',
        'banned_users',
        'admins',
      ],
      where: { id },
      // where: {
      //   id,
      //   banned_users: { expiration: MoreThan(new Date(date)) }
      // },
    });
    channel.banned_users = channel.banned_users.filter(
      (elem) => elem.expiration > localeDate,
    );
    if (!channel) throw new NotFoundException('Channel not found');
    this.logger.debug('Returning channel', { channel });
    return channel;
  }

  async getMessages(id: number): Promise<ChannelMessages[]> {
    const channel = await this.channelsRepository.findOne({
      where: { id },
      relations: [
        'users',
        'users.profile',
        'allowed_users.profile',
        'channel_messages.user.profile',
        'channel_messages.channel',
      ],
    });
    if (!channel) throw new NotFoundException('Channel not found');
    // this.logger.debug('Returning channel messages', channel.channel_messages);
    this.logger.debug('Returning channel messages');
    return channel.channel_messages;
  }

  async delete(id: number) {
    const channel = await this.getOne(id);
    this.logger.debug('Channel deleted', { channel });
    await this.channelsRepository.delete({ id: id });
  }

  async update(channel: ChannelDto) {
    return await this.channelsRepository.save(channel);
  }

  async saveMessage(
    client: Socket,
    data: ChannelRoomMessage,
  ): Promise<Message> {
    const token = client.handshake.auth.token;
    const channel_id = data.channel_id;
    const user_id = await this.usersService.getUserId(token);
    const user = await this.usersService.getOne(user_id);
    const channel: ChannelDto = await this.channelsRepository.findOne({
      where: { id: channel_id },
      relations: ['channel_messages'],
    });

    const newMessage = await this.channelsMesssagesRepository.save({
      message: data.message,
      user: user,
      channel: channel,
    });
    channel.channel_messages.push(newMessage);
    this.channelsRepository.save(channel);
    delete newMessage.channel.password;
    delete newMessage.channel.channel_messages;
    return newMessage;
  }

  async addAdmin(token: string, channelId: number, target: number) {
    this.logger.debug('Add admin request');

    token = token.replace('Bearer ', '');
    const userId: number = this.jwtService.decode(token)['sub'];
    if (!userId) throw new BadRequestException('invalid jwt token');
    const channel: ChannelDto = await this.getOne(channelId);
    if (channel.owner_id != userId)
      throw new BadRequestException('You are not the owner of this channel');
    const newAdmin: UserDto = await this.usersService.getOne(target);
    if (!newAdmin)
      throw new BadRequestException('user does not exist in the database');
    channel.admins.push(newAdmin);
    if (channel.type == 'PUBLIC') delete channel.allowed_users;
    await this.update(channel);
    this.logger.log(`Admin added. Updated channel: ${channel}`);
  }

  async delAdmin(token: string, channelId: number, target: number) {
    this.logger.debug('Delete admin request');

    token = token.replace('Bearer ', '');
    const userId: number = this.jwtService.decode(token)['sub'];
    if (!userId) throw new BadRequestException('invalid jwt token');
    const channel: ChannelDto = await this.getOne(channelId);
    if (channel.owner_id != userId)
      throw new BadRequestException('You are not the owner of this channel');
    const index = channel.admins.findIndex((elem) => elem.id == target);
    if (index == -1)
      throw new BadRequestException('This user is not an administrator');
    channel.admins.splice(index);
    if (channel.type == 'PUBLIC') delete channel.allowed_users;
    await this.update(channel);
    console.log(channel);
    this.logger.log(`Delete succesful. Updated channel ${channel}`);
  }

  async leaveChannel(token: string, channel_id: number) {
    const user_id = await this.usersService.getUserId(token);
    const channel = await this.getOne(channel_id);

    channel.users = channel.users.filter((user) => user.id != user_id);
    channel.admins = channel.admins.filter((user) => user.id != user_id);

    if (channel.owner_id == user_id) {
      if (channel.admins.length) {
        channel.owner_id = channel.admins[0].id;
      } else if (channel.users.length) {
        channel.owner_id = channel.users[0].id;
        channel.admins.push(
          await this.usersService.getOne(channel.users[0].id),
        );
      } else {
        this.channelsSocketGateway.removeUser(user_id, channel_id.toString());
        return await this.delete(channel.id);
      }
    }

    await this.update(channel);

    this.channelsSocketGateway.removeUser(user_id, channel_id.toString());
    return channel;
  }

  private validateChannel(channel: ChannelDto): string {
    if (channel.type == 'PUBLIC') {
      if (channel.password) return 'Public channels cannot have password';
      if (channel.allowed_users)
        return 'Public channels cannot have allowed users field';
    }
    if (channel.type == 'PROTECTED') {
      if (channel.allowed_users)
        return 'Protected channels cannot have allowed users field';
    }
    if (channel.type == 'PRIVATE') {
      if (channel.password) return 'Private channels cannot have password';
      if (!isArray(channel.allowed_users))
        return 'Private channels allowed_users format error';
      if (!channel.allowed_users[0])
        return 'Private channels allowed_users cannot be empty';
      if (channel.allowed_users.some((user) => !isString(user)))
        return 'Private channels allowed_users format error';
      if (
        channel.allowed_users.some(
          (user, i) => channel.allowed_users.indexOf(user) != i,
        )
      )
        return 'Private channels allowed_users should have unique values';
    }
    return null;
  }

  private async hashPass(password: string): Promise<string> {
    if (!password) return null;
    return await bcrypt.hash(password, await bcrypt.genSalt());
  }
}
