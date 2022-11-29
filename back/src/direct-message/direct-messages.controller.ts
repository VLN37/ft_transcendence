import { Controller, Headers, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { DirectMessagesService } from './direct-messages.service';

@Controller('direct_messages')
export class DirectMessagesController {
  constructor(private readonly dmService: DirectMessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getMessages(
    @Headers('Authorization') token: string,
    @Param('id') id: number,
  ) {
    return this.dmService.getMessages(token, id);
  }
}
