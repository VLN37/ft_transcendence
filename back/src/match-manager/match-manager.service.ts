import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from 'src/entities/match.entity';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { MatchManager } from './match-manager';
import { MemoryMatch } from './model/MemoryMatch';

@Injectable()
export class MatchManagerService {
  private readonly logger = new Logger(MatchManagerService.name);
  private inviteNotifyService: (
    receiver: number,
    user: UserDto,
  ) => void | null = null;
  private updateNotifyService: (
    status: string,
    user1: UserDto,
    user2: UserDto,
    id: string,
  ) => void | null = null;

  setInviteNotify(callback: (receiver: number, user: UserDto) => void) {
    this.inviteNotifyService = callback;
  }

  setUpdateNotify(
    callback: (
      status: string,
      user1: UserDto,
      user2: UserDto,
      id: string,
    ) => void,
  ) {
    this.updateNotifyService = callback;
  }

  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private usersService: UsersService,
    private matchManager: MatchManager,
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

  async invite(target: number, user: UserDto) {
    await this.usersService.findUserById(target);
    await this.usersService.findUserById(user.id);

    if (target == user.id)
      throw new BadRequestException(
        "You can't invite yourself to play a match",
      );

    this.inviteNotifyService(target, user);
  }

  async updateInvite(status: string, user1: UserDto, user2: UserDto) {
    await this.usersService.findUserById(user1.id);
    await this.usersService.findUserById(user2.id);

    if (status != 'ACCEPTED' && status != 'DECLINED')
      throw new BadRequestException('Invalid friendly match invite status');

    const match: MemoryMatch = await this.matchManager.createMatch(
      user1,
      user2,
    );

    if (!match || !match.id)
      throw new BadRequestException('Failed to create friendly match');
    this.updateNotifyService(status, user1, user2, match.id);
  }
}
