import {
  Controller,
  Get,
  Logger,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { rules } from './game/rules';
import { MatchManager } from './match-manager';
import { MatchManagerInterceptor } from './match-manager.interceptor';
import { MatchManagerService } from './match-manager.service';
import { MatchStage } from './model/MemoryMatch';

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
    for (var i = 0; i < qty; i++) this.matchManager.createMatch(p1, p2);
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

  @Get('rules')
  getRules() {
    return rules;
  }
}
