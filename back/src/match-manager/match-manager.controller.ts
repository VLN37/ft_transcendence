import {
  Controller,
  Get,
  Logger,
  Param,
  Headers,
  Query,
  UseInterceptors,
  Post,
  UseGuards,
  Body,
  Put,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { Jwt2faAuthGuard } from 'src/auth/guard/jwt2fa.guard';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { rules } from './game/rules';
import { MatchManager } from './match-manager';
import { MatchManagerInterceptor } from './match-manager.interceptor';
import { MatchManagerService } from './match-manager.service';
import { MatchStage } from './model/MatchStage';

@Controller('/matches')
export class MatchManagerController {
  private readonly logger = new Logger(MatchManagerController.name);

  constructor(
    private readonly matchManager: MatchManager,
    private readonly matchManagerService: MatchManagerService,
    private readonly usersService: UsersService,
  ) {}

  @Get('/generate/:qty')
  async generateMatches(@Param('qty') qty: number) {
    const p1 = await this.usersService.getOne(43);
    const p2 = await this.usersService.getOne(44);
    for (var i = 0; i < qty; i++)
      this.matchManager.createMatch(p1, p2, 'CLASSIC');
  }

  @Get()
  getOngoingMatches(@Query('stage') stage: MatchStage) {
    if (stage) {
      if (stage === 'FINISHED') {
        return this.matchManager.getFinishedMatches();
      }
      return this.matchManager
        .getActiveMatches()
        .filter((match) => match.stage === stage);
    }
    return this.matchManager.getActiveMatches();
  }

  @Get('/live/:qty')
  @UseInterceptors(MatchManagerInterceptor)
  getLiveMatches(@Param('qty') qty: number) {
    return this.matchManagerService.getLiveMatches(qty);
  }

  @Get('/user/:id')
  @UseInterceptors(MatchManagerInterceptor)
  getUserMatches(@Param('id') id: number, @Query('qty') qty: number = 10) {
    return this.matchManagerService.getUserMatches(id, qty);
  }

  @Get('rules')
  getRules() {
    return rules;
  }

  @Get('/:match_id')
  async getActiveMatchInfo(@Param('match_id') matchId: string) {
    if (!isUUID(matchId)) {
      throw new BadRequestException('Invalid uuid');
    }
    const match = await this.matchManagerService.getActiveMatchInfo(matchId);
    if (!match)
      throw new NotFoundException('Match is not active or does not exist');

    return match;
  }

  @UseGuards(Jwt2faAuthGuard)
  @Post('/friendly/:target')
  async invite(@Body('user') user: UserDto, @Param('target') target: number) {
    return this.matchManagerService.invite(target, user);
  }

  @UseGuards(Jwt2faAuthGuard)
  @Put('/friendly')
  async updateInvite(
    @Body('status') status: 'ACCEPTED' | 'DECLINED',
    @Body('user1') user1: UserDto,
    @Body('user2') user2: UserDto,
  ) {
    return this.matchManagerService.updateInvite(status, user1, user2);
  }
}
