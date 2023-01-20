import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { ProfileDto } from 'src/users/dto/profile.dto';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async create(profile: ProfileDto) {
    if (!profile) return null;
    if (!profile.avatar_path) profile.avatar_path = '/avatars/gatinho.jpeg';
    profile.mmr = 1000;
    const newProfile = await this.profileRepository
      .save(profile)
      .catch((err: any) => {
        throw new BadRequestException('Profile: ' + err.driverError.detail);
      });
    this.logger.debug('Profile: created', { newProfile });
    return newProfile;
  }
}
