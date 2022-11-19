import { faker } from '@faker-js/faker';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isArray, isString } from 'class-validator';
import { Channel } from 'src/entities/channel.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { ChannelDto } from './dto/channel.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChannelsService {
  private readonly logger = new Logger(ChannelsService.name);

  constructor(
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
    private usersService: UsersService,
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
        administrators: [{id: channel.owner_id}],
      })
      .catch((err: any) => {
        console.log(err);
        throw new BadRequestException('Channel: ' + err?.driverError);
      });
    this.logger.debug('Channel created', { newChannel });
    return newChannel;
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
    const channel = await this.channelsRepository.findOne({
      where: { id },
      relations: ['users', 'users.profile', 'allowed_users.profile'],
    });
    if (!channel) throw new NotFoundException('Channel not found');
    this.logger.debug('Returning channel', { channel });
    return channel;
  }

  async delete(id: number) {
    //TODO: disconnect all users from this channel/socket
    const channel = await this.getOne(id);
    this.logger.debug('Channel deleted', { channel });
    await this.channelsRepository.delete({ id: id });
  }

  async update(channel: ChannelDto) {
    return await this.channelsRepository.save(channel);
  }

  private validateChannel(channel: ChannelDto) {
    if (channel.type == 'PUBLIC') {
      if (channel.password) return 'Public channels cannot have password';
      if (channel.allowed_users)
        return 'Public channels cannot have allowed users';
    }
    if (channel.type == 'PROTECTED') {
      if (channel.allowed_users)
        return 'Protected channels cannot have allowed users';
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
