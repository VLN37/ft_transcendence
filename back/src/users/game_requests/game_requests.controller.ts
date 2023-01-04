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
  async invite(
    @Body('user') user: UserDto,
    @Param('target') target: number,
  ) {
    return await this.gameRequestsService.invite(target, user);
  }

  @Put()
  updateInvite(
    @Param('me') me: number,
    @Param('target') target: number,
    @Body('status') status: 'ACCEPTED' | 'DECLINED',
  ) {
    return this.gameRequestsService.updateInvite(me, target, status);
  }
}
