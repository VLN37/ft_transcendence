import { BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { ProfileDto } from 'src/users/dto/profile.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import * as fs from 'fs';
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
    if (!image.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      fs.unlink(image.path, (err) => console.log(err));
      throw new BadRequestException('Invalid file type');
    }
    let user: UserDto = await this.usersService.getMe(token);
    if (user.profile.avatar_path)
      fs.unlink(user.profile.avatar_path, err => console.log(err));
    user.profile.avatar_path = image.filename;
    this.logger.debug(user);
    await this.usersService.edit(user.id, user);
    return user;
  }
}
