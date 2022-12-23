import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Headers,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {

  constructor(private ProfileService: ProfileService) {}

  @Post('/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Headers('Authorization') token: string,
  ) {
    const response = this.ProfileService.saveAvatar(token, file);
    return response;
  }
}
