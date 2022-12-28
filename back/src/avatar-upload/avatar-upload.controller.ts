import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Headers,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarUploadService } from './avatar-upload.service';

@Controller('/avatar')
export class AvatarUploadController {
  constructor(private avatarUploadService: AvatarUploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Headers('Authorization') token: string,
  ) {
    return this.avatarUploadService.saveAvatar(token, file);
  }
}
