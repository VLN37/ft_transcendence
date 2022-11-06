import {
  Body,
  Controller,
  Logger,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, MulterModule } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';

MulterModule.register({
  dest: './',
});

@Controller('profile')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(private ProfileService: ProfileService) {}

  @Post('/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    this.logger.log('Incoming avatar upload request');
    this.ProfileService.saveAvatar(file);
    return 'ta la';
  }
}
