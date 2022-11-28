import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DirectMessages } from 'src/entities/direct_messages.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class DirectMessagesService {
  private readonly logger = new Logger(DirectMessagesService.name);

  constructor(
    @InjectRepository(DirectMessages)
    private dmRepository: Repository<DirectMessages>,
    private usersService: UsersService,
  ) {}
}
