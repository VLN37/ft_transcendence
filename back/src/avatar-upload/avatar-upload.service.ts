import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from '../users/users.service';
import * as fs from 'fs';

@Injectable()
export class AvatarUploadService {
  private readonly logger = new Logger(AvatarUploadService.name);

  constructor(private usersService: UsersService) {}

  setNotify(callback: (receiver: number, user: UserDto) => void) {
    this.usersService.setNotify(callback);
  }

  async saveAvatar(token: string, image: Express.Multer.File) {
    if (!image.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      fs.unlink(image.path, (err) => this.logger.warn(err));
      throw new BadRequestException('Invalid file type');
    }
    let user: UserDto = await this.usersService.getMe(token);
    // TODO (VLN37) : fix malfunctioning unlink
    // if (user.profile.avatar_path) {
    //   fs.unlink(user.profile.avatar_path, (err) => console.log(err));
    // }
    user.profile.avatar_path = '/avatars/' + image.filename;
    this.logger.debug({ user });
    await this.usersService.edit(user.id, user);
    return user;
  }
}
