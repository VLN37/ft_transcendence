import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from 'src/entities/match.entity';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class MatchManagerService {
  private readonly logger = new Logger(MatchManagerService.name);

  private notifyService: (userId: number, user: UserDto) => void | null = null;
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private usersService: UsersService,
  ) {}

  async getLiveMatches(qty: number): Promise<Match[]> {
    let finishedMatches = [];
    const liveMatches = await this.matchRepository.find({
      where: {
        stage: 'ONGOING',
      },
      relations: ['left_player.profile', 'right_player.profile'],
      take: qty,
      order: { created_at: 'DESC' },
    });
    if (liveMatches.length < qty) {
      finishedMatches = await this.matchRepository.find({
        where: {
          stage: 'FINISHED',
        },
        relations: ['left_player.profile', 'right_player.profile'],
        take: qty - liveMatches.length,
        order: { created_at: 'DESC' },
      });
    }
    const matches = liveMatches.concat(finishedMatches);
    this.logger.debug('Returning live matches');
    return matches;
  }

  setNotify(callback: (userId: number, user: UserDto) => void) {
    this.notifyService = callback;
  }

  async getUserMatches(token: string, qty: number): Promise<Match[]> {
    const myId = await this.usersService.getUserId(token);
    // this.logger.error(myId);
    const matches = await this.matchRepository.find({
      where: [
        {
          left_player: {
            id: myId,
          },
          stage: 'FINISHED',
        },
        {
          right_player: {
            id: myId,
          },
          stage: 'FINISHED',
        },
      ],
      relations: ['left_player.profile', 'right_player.profile'],
      take: qty,
      order: { created_at: 'DESC' },
    });
    this.logger.debug('Returning user matches');
    return matches;
  }

  async sendGameRequest(user: UserDto, recipient: number) {
    this.notifyService(recipient, user);
  }
}
