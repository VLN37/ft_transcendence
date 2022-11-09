import {
  BadRequestException,
  Controller,
  Logger,
  Post,
  UploadedFile,
  UseInterceptors,
  Headers,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';
import * as fs from 'fs';
import { UsersService } from 'src/users/users.service';

@Controller('profile')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(private ProfileService: ProfileService) {}

  @Post('/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Headers('Authorization') token: string,
  ) {
    this.logger.log('Incoming avatar upload request');
    this.logger.debug(file);
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      throw new BadRequestException('Invalid file type');
    }
    console.log('token', token);
    fs.unlink(file.path, (err) => console.log(err));
    return this.ProfileService.saveAvatar(token, file);
  }
}