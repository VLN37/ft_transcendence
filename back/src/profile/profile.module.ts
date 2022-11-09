import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { editFileName } from 'src/middlewares/LoggerMiddleware';
import { diskStorage } from 'multer';


@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
    }),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
