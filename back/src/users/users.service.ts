import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ProfileService } from 'src/profile/profile.service';
import { makeUsers } from 'test/utils';

function byId(id: number) {
  return {
    where: { id },
    relations: ['profile'],
  };
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private profileService: ProfileService,
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
    await this.usersRepository.update(id, user);
    const updatedUser = await this.findUserById(id);
    this.logger.debug('User updated', { updatedUser });
    return updatedUser;
  }

  async delete(id: number) {
    const user = await this.findUserById(id);
    this.logger.debug('User deleted', { user });
    await this.usersRepository.delete({ id: id });
  }

  async getAll(): Promise<User[]> {
    const users = await this.usersRepository.find({
      relations: ['profile', 'friends'],
    });
    users.map((user) => {
      delete user.tfa_enabled;
      delete user.tfa_secret;
    });
    this.logger.debug('Returning users', { users });
    return users;
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne(byId(id));
    this.logger.debug('Returning user', { user });
    return user;
  }

  async tryFindOne(id: number): Promise<UserDto> {
    const user = await this.usersRepository.findOne(byId(id));
    if (!user) throw new NotFoundException(`User ${id} not found`);
    this.logger.debug('Returning user', { user });
    return user;
  }

  async getSingleUser(id: number) {
    const user = await this.usersRepository.findOne(byId(id));
    if (!user) throw new NotFoundException('User not found');
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

  async findUserById(id: number, relations: string[] = []): Promise<UserDto> {
    relations.unshift('profile');
    const find = await this.usersRepository.findOne({
      where: { id },
      relations,
    });
    if (!find) throw new NotFoundException(`User with id=${id} not found`);
    delete find.tfa_enabled;
    delete find.tfa_secret;
    this.logger.debug('Returning user', { find });
    return find;
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
