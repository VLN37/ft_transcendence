import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchEntity } from 'src/entities/match.entity';
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
    @InjectRepository(MatchEntity)
    private matchRepository: Repository<MatchEntity>,
    private usersService: UsersService,
    private matchManager: MatchManager,
  ) {}

  async getActiveMatchInfo(matchId: string): Promise<MatchEntity> {
    return this.matchRepository.findOne({
      where: {
        id: matchId,
      },
      relations: ['left_player.profile', 'right_player.profile'],
    });
  }

  async getLiveMatches(qty: number): Promise<MatchEntity[]> {
    let finishedMatches = [];
    const liveMatches = await this.matchRepository.find({
      where: [{ stage: 'ONGOING' }, { stage: 'FINISHED' }],
      relations: ['left_player.profile', 'right_player.profile'],
      take: qty,
      order: { stage: 'ASC', created_at: 'DESC' },
    });
    const matches = liveMatches.concat(finishedMatches);
    this.logger.debug('Returning live matches');
    return matches;
  }

  async getUserMatches(id: number, qty: number): Promise<MatchEntity[]> {
    const matches = await this.matchRepository.find({
      where: [
        {
          left_player: {
            id: id,
          },
          stage: 'FINISHED',
        },
        {
          right_player: {
            id: id,
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
      'TURBO',
    );

    if (!match || !match.id)
      throw new BadRequestException('Failed to create friendly match');
    this.updateNotifyService(status, user1, user2, match.id);
  }
}
