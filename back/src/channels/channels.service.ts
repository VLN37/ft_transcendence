import { faker } from '@faker-js/faker';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'src/entities/channel.entity';
import { Repository } from 'typeorm';
import { ChannelDto } from './dto/channel.dto';

@Injectable()
export class ChannelsService {
  private readonly logger = new Logger(ChannelsService.name);

  constructor(
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
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

  async create(dto: ChannelDto) {
    const newChannel = await this.channelsRepository.save({
      name: dto.name,
      owner_id: dto.owner_id,
      type: dto.type,
      password: dto.password,
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
}
