import {
  Body,
  Controller,
  HttpCode,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { UserDto } from '../dto/user.dto';
import { GameRequestsService } from './game_requests.service';

@UseGuards(JwtAuthGuard)
@Controller('/users/:target/game_requests')
export class GameRequestsController {
  private readonly logger = new Logger(GameRequestsController.name);

  constructor(private readonly gameRequestsService: GameRequestsService) {}

  @Post()
  async invite(@Body('user') user: UserDto, @Param('target') target: number) {
    return await this.gameRequestsService.invite(target, user);
  }

  @Put()
  updateInvite(
    @Body('status') status: 'ACCEPTED' | 'DECLINED',
    @Body('user1') user1,
    @Body('user2') user2,
  ) {
    return this.gameRequestsService.updateInvite(status, user1, user2);
  }
}
