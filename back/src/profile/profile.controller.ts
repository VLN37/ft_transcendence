import {
  BadRequestException,
  Controller,
  Logger,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';
import * as fs from 'fs';

@Controller('profile')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(private ProfileService: ProfileService) {}

  @Post('/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    this.logger.log('Incoming avatar upload request');
    this.logger.debug(file, 'uploaded avatar');
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      throw new BadRequestException("Invalid file type");
    }
    return this.ProfileService.saveAvatar(file);
  }
}
