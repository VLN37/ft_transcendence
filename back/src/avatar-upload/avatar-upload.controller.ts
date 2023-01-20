import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { AvatarUploadService } from './avatar-upload.service';

@UseGuards(JwtAuthGuard)
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
