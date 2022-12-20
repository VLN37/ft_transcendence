import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from 'src/entities/match.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MatchManagerService {
  private readonly logger = new Logger(MatchManagerService.name);

  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
  ) {}

  async getLiveMatches(qty: number): Promise<Match[]> {
    let finishedMatches = [];
    const liveMatches = await this.matchRepository.find({
      where: {
        stage: 'ONGOING',
      },
      relations: ['left_player.profile', 'right_player.profile'],
      take: qty,
    });
    if (liveMatches.length < qty) {
      finishedMatches = await this.matchRepository.find({
        where: {
          stage: 'FINISHED',
        },
        take: qty - liveMatches.length,
      });
    }
    const matches = liveMatches.concat(finishedMatches);
    this.logger.debug('Returning live matches');
    return matches;
  }
}
