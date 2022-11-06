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
})

@Controller('profile')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(private ProfileService: ProfileService) {}

  @Post('/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(
    @Req() req: any,
    @Body() body: any,
    @Body('avatar') content: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // console.log('req', req);
    console.log('body ->', body);
    console.log('avatar ->', content);
    console.log(file);
    this.logger.log('Incoming avatar upload request');
    this.ProfileService.saveAvatar(content);
    return 'ta la';
  }
}
