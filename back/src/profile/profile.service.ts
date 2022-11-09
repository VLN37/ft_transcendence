import { BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { ProfileDto } from 'src/users/dto/profile.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async create(profile: ProfileDto) {
    if (!profile) return null;
    const newProfile = await this.profileRepository
      .save(profile)
      .catch((err: any) => {
        throw new BadRequestException('Profile: ' + err.driverError.detail);
      });
    this.logger.debug('Profile: created', { newProfile });
    return newProfile;
  }

  async saveAvatar(token: string, image: Express.Multer.File) {
    const user: UserDto = await this.usersService.getMe(token);
    return 'lol';
  }
}
