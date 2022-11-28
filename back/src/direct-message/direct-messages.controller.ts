import { Controller } from '@nestjs/common';
import { DirectMessagesService } from './direct-messages.service';

@Controller('direct_messages')
export class DirectMessagesController {
  constructor(private readonly dmService: DirectMessagesService) {}
}
