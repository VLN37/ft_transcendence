import { faker } from '@faker-js/faker';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isArray } from 'class-validator';
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

    for (let i = 0; i < amount; i++) {
      const status: any = statusArr[faker.datatype.number({ min: 0, max: 2 })];
      await this.channelsRepository.save({
        name: faker.name.jobArea().toLocaleLowerCase(),
        owner_id: i,
        type: status,
        password: null,
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
        allowed_users: await this.usersService.findMany(
          channel.allowed_users as number[],
        ),
      })
      .catch((err: any) => {
        console.log(err);
        throw new BadRequestException('Channel: ' + err?.driverError);
      });
    this.logger.debug('Channel created', { newChannel });
    return newChannel;
  }

  async getAll(): Promise<ChannelDto[]> {
    const channels = await this.channelsRepository.find({});
    // this.logger.debug('Returning channels', { channels });
    this.logger.debug('Returning channels');
    return channels;
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
      if (channel.allowed_users.some((user) => !Number.isInteger(user)))
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
