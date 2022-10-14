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

function byId(id: number) {
  return {
    where: { id },
    relations: {
      profile: true,
      friends: true,
      blocked: true,
      friends_request: true,
    },
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

  async create(dto: UserDto): Promise<UserDto> {
    if (await this.usersRepository.findOneBy({ id: dto.id }))
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

  async edit(id: number, user: User) {
    if (user.hasOwnProperty('id'))
      throw new ForbiddenException('you cannot change your intra ID');
    await this.usersRepository.update(id, user);
    // const updatedUser = await this.usersRepository.save(user);
    const updatedUser = await this.usersRepository.findOne(byId(id));
    this.logger.debug('User updated', { updatedUser });
    return updatedUser;
  }

  async update(user: User) {
    return await this.usersRepository.save(user);
  }

  async delete(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('this user does not exist');
    console.log('DELETE USER', user);
    const deletedUser = this.usersRepository.delete({ id: id });
    this.logger.debug('User deleted', { deletedUser });
    return deletedUser;
  }

  async get(): Promise<User[]> {
    const users = await this.usersRepository.find({
      relations: {
        profile: true,
        friends: true,
        blocked: true,
        friends_request: true,
      },
    });
    this.logger.debug('Returning users', { users });
    return users;
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne(byId(id));
    this.logger.debug('Returning user', { user });
    return user;
  }

  async getSingleUser(id: number) {
    const user = await this.usersRepository.findOne(byId(id));
    if (!user) throw new NotFoundException('User not found');
    this.logger.debug('Returning user', { user });
    return user;
  }

  async blockUser(id: number, userId: number) {
    const user = await this.usersRepository.findOne(byId(id));
    if (!user) throw new NotFoundException('User not found');

    if (id == userId) throw new BadRequestException("You can't block yourself");

    if (user.blocked.find((userToBlock) => userToBlock.id == userId))
      throw new BadRequestException('User has already been blocked');

    const userToBlock = await this.usersRepository.findOne(byId(userId));
    if (!userToBlock) throw new NotFoundException('User to block not found');

    user.blocked.push(userToBlock);

    this.logger.log(
      `User ${user.login_intra} blocked user ${userToBlock.login_intra}`,
    );

    return await this.usersRepository.save(user);
  }

  async unblockUser(id: number, userId: number) {
    const user = await this.usersRepository.findOne(byId(id));
    if (!user) throw new NotFoundException('User not found');

    if (id == userId)
      throw new BadRequestException("You can't unblock yourself");

    if (!user.blocked.find((userToBlock) => userToBlock.id == userId))
      throw new BadRequestException('User was not blocked');

    const userToUnblock = await this.usersRepository.findOne(byId(userId));
    if (!userToUnblock) throw new NotFoundException('User to block not found');

    user.blocked = user.blocked.filter(
      (userToUnblock) => userToUnblock.id != userId,
    );

    this.logger.log(
      `User ${user.login_intra} unblocked user ${userToUnblock.login_intra}`,
    );
    return await this.usersRepository.save(user);
  }
}
