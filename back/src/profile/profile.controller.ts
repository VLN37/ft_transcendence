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
import { diskStorage } from 'multer';
import { faker } from '@faker-js/faker';

function editFileName(req, file: Express.Multer.File, callback) {
  //FIXME: error does not reach front end api

  // console.log(file.filename);
  const name = faker.random.alphaNumeric(20);
  const fileExt = file.originalname.split('.').pop();
  const filename = name + '.' + fileExt;
  console.log(filename);
  callback(null, filename);
}

@Controller('profile')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(private ProfileService: ProfileService) {}

  @Post('/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
    }),
  )
  uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
      throw new BadRequestException("Invalid file type");
    this.logger.log('Incoming avatar upload request');
    this.ProfileService.saveAvatar(file);
    return 'ta la';
  }
}
