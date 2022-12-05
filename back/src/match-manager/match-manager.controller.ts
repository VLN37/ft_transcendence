import { Controller, Get, Logger, Query } from '@nestjs/common';
import { MatchManagerService } from './match-manager.service';
import { MatchStage } from './model/MemoryMatch';

@Controller('/matches')
export class MatchManagerController {
  private readonly logger = new Logger(MatchManagerController.name);

  constructor(private readonly matchManager: MatchManagerService) {}

  @Get()
  getOngoingMatches(@Query('stage') stage: MatchStage) {
    this.logger.error('caiu no controller matches');
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
}
