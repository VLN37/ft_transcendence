import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AvatarUploadService } from './avatar-upload.service';
import { AvatarUploadController } from './avatar-upload.controller';
import { JwtService } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from 'src/middlewares/EditFileName';

@Module({
  imports: [
    UsersModule,
    MulterModule.register({
      limits: {
        fileSize: 1024 * 1024 * 2,
        fieldSize: 1024 * 1024 * 2,
      },
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
    }),
  ],
  controllers: [AvatarUploadController],
  providers: [AvatarUploadService, JwtService],
  exports: [AvatarUploadService],
})
export class AvatarUploadModule {}
