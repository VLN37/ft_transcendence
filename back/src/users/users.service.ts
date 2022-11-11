import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ProfileService } from 'src/profile/profile.service';
import { makeUsers } from 'test/utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private profileService: ProfileService,
    private jwtService: JwtService,
  ) {}

  async create(dto: UserDto): Promise<User> {
    const find = await this.usersRepository.findOne({
      where: { id: dto.id },
      relations: ['profile'],
    });
    if (find?.id == dto.id)
      throw new BadRequestException(`User: (id)=(${dto.id}) already exists.`);
    const profile = await this.profileService.create(dto.profile);
    const newUser = await this.usersRepository
      .save({
        id: dto.id,
        login_intra: dto.login_intra,
        tfa_enabled: dto.tfa_enabled,
        tfa_secret: dto.tfa_secret,
        profile: profile,
      })
      .catch((err: any) => {
        throw new BadRequestException(
          'User: ' + (err.driverError.detail ?? err),
        );
      });
    this.logger.debug('User created', { newUser });
    return newUser;
  }

  async generateUsers(amount: number) {
    return await makeUsers(amount);
  }

  async edit(id: number, user: UserDto) {
    const oldUser = await this.findUserById(id);
    const error = await this.userChangedForbiddenFields(oldUser, user);
    if (error) throw new ForbiddenException(`You cannot change user ${error}`);
    delete user.friends;
    delete user.blocked;
    delete user.friend_requests;
    await this.usersRepository.save(user).catch((err: any) => {
      throw new BadRequestException('User: ' + (err.driverError.detail ?? err));
    });
    const updatedUser = await this.findCompleteUserById(id);
    delete updatedUser.tfa_secret;
    delete updatedUser.friends;
    delete updatedUser.blocked;
    delete updatedUser.friend_requests;
    this.logger.debug('User updated', { updatedUser });
    return updatedUser;
  }

  async delete(id: number) {
    const user = await this.findUserById(id);
    this.logger.debug('User deleted', { user });
    await this.usersRepository.delete({ id: id });
  }

  async getAll(sort: string = 'id', order: string = 'ASC'): Promise<UserDto[]> {
    const users = await this.usersRepository.find({
      relations: ['profile'],
      order: {
        profile: {
          [sort]: order,
        },
      },
    });
    users.map((user) => {
      delete user.tfa_enabled;
      delete user.tfa_secret;
    });
    this.logger.debug('Returning users', { users });
    return users;
  }

  async getMe(token: string): Promise<UserDto> {
    let id: number;
    try {
      token = token.replace('Bearer ', '');
      id = this.jwtService.decode(token)['sub'];
    } catch (error) {
      throw new ForbiddenException(
        'User token format invalid, cannot read property id',
      );
    }
    const user = await this.findCompleteUserById(id);
    delete user.tfa_secret;
    if (!user) throw new NotFoundException(`User with id=${id} not found`);
    this.logger.debug('Returning my user', { user });
    return user;
  }

  async getOne(id: number): Promise<UserDto> {
    const user = await this.findUserById(id);
    delete user.tfa_enabled;
    delete user.tfa_secret;
    delete user.blocked;
    delete user.friend_requests;
    user.friends.map((user) => {
      delete user.tfa_enabled;
      delete user.tfa_secret;
    });
    this.logger.debug('Returning user', { user });
    return user;
  }

  async set2faSecret(userId: number, secret?: string) {
    // FIX: check if user already has a secret
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) throw new NotFoundException('User not found');

    user.tfa_secret = secret;
    this.usersRepository.save(user);
  }

  async set2faEnabled(userId: number, enable: boolean) {
    const user = await this.usersRepository.findOneBy({
      id: userId,
    });

    if (!user) throw new NotFoundException('User not found');

    user.tfa_enabled = enable;
    this.usersRepository.save(user);
  }

  async update(user: UserDto) {
    return await this.usersRepository.save(user);
  }

  async findUserById(id: number): Promise<UserDto> {
    try {
      const find = await this.usersRepository.findOne({
        where: { id },
        relations: [
          'profile',
          'friends.profile',
          'blocked.profile',
          'friend_requests.profile',
        ],
      });
      if (!find) throw new NotFoundException(`User with id=${id} not found`);
      delete find.tfa_enabled;
      delete find.tfa_secret;
      this.logger.debug('Returning user', { find });
      return find;
    } catch (error) {
      throw new BadRequestException(
        `Failed to process request with id '${id}'`,
      );
    }
  }

  async findCompleteUserById(id: number): Promise<UserDto> {
    const find = await this.usersRepository.findOne({
      where: { id },
      relations: [
        'profile',
        'friends.profile',
        'blocked.profile',
        'friend_requests.profile',
      ],
    });
    if (!find) return null;
    find.friends.map((user) => {
      delete user.tfa_enabled;
      delete user.tfa_secret;
    });
    find.blocked.map((user) => {
      delete user.tfa_enabled;
      delete user.tfa_secret;
    });
    find.friend_requests.map((user) => {
      delete user.tfa_enabled;
      delete user.tfa_secret;
    });
    this.logger.debug('Returning user', { find });
    return find;
  }

  async findOne(id: number): Promise<UserDto> {
    const find = await this.usersRepository.findOne({
      where: { id },
      relations: ['profile', 'friends', 'blocked', 'friend_requests'],
    });
    if (!find) return;
    delete find.tfa_enabled;
    delete find.tfa_secret;
    this.logger.debug('Returning user', { find });
    return find;
  }

  async findMany(users_id: number[]): Promise<UserDto[]> {
    if (!users_id) return [];
    const users = await this.usersRepository.find({
      relations: ['profile'],
      where: { id: In(users_id) },
    });
    if (users.length != users_id.length)
      throw new BadRequestException('User not found in database');
    users.map((user) => {
      delete user.tfa_enabled;
      delete user.tfa_secret;
    });
    this.logger.debug('Returning users', { users });
    return users;
  }

  private async userChangedForbiddenFields(
    oldUser: UserDto,
    user: UserDto,
  ): Promise<string> {
    if (oldUser.id != user?.id) return 'id';
    if (oldUser.login_intra != user?.login_intra) return 'login_intra';
    if (oldUser.tfa_secret != user?.tfa_secret) return 'tfa_secret';
    if (oldUser.profile.id != user?.profile?.id) return 'profile id';
    if (oldUser.profile.nickname != user?.profile?.nickname)
      return 'profile nickname';
    return '';
  }
}
