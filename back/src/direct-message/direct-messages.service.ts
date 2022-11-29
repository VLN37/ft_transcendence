import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { DirectMessages } from 'src/entities/direct_messages.entity';
import { UsersService } from 'src/users/users.service';
import { In, Repository } from 'typeorm';
import { iDirectMessage, UserMessage } from './direct-messages.interface';

@Injectable()
export class DirectMessagesService {
  private readonly logger = new Logger(DirectMessagesService.name);

  constructor(
    @InjectRepository(DirectMessages)
    private dmRepository: Repository<DirectMessages>,
    private usersService: UsersService,
  ) {}

  async saveMessage(
    client: Socket,
    data: UserMessage,
  ): Promise<iDirectMessage> {
    const token = client.handshake.auth.token;
    const senderId = await this.usersService.getUserId(token);
    const senderUser = await this.usersService.getOne(senderId);
    const receiverUser = await this.usersService.getOne(parseInt(data.user_id));
    const newMessage = await this.dmRepository.save({
      sender: senderUser,
      receiver: receiverUser,
      message: data.message,
    });
    return newMessage;
  }

  async getMessages(token: string, id: number): Promise<DirectMessages[]> {
    const myId = await this.usersService.getUserId(token);
    const messages = await this.dmRepository.find({
      where: {
        sender: {
          id: In([id, myId]),
        },
        receiver: {
          id: In([id, myId]),
        },
      },
      relations: ['sender.profile', 'receiver.profile'],
    });
    return messages;
  }
}
