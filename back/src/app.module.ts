import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './middlewares/LoggerMiddleware';
import { UsersController } from './users/users.controller';
import { Profile } from './entities/profile.entity';
import { ProfileModule } from './profile/profile.module';
import { AuthController } from './auth/auth.controller';
import { DashboardController } from './dashboard/dashboard.controller';
import { BlockedController } from './users/blocked/blocked.controller';
import { FriendsController } from './users/friends/friends.controller';
import { FriendRequestsController } from './users/friend_requests/friend_requests.controller';
import { Channel } from './entities/channel.entity';
import { ChannelsModule } from './channels/channels.module';
import { MatchMakingModule } from './match-making/match-making.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MatchEntity } from './entities/match.entity';
import { ChannelMessages } from './entities/channel_messages.entity';
import { DirectMessagesController } from './direct-message/direct-messages.controller';
import { DirectMessagesModule } from './direct-message/direct-messages.module';
import { DirectMessages } from './entities/direct_messages.entity';
import { BannedUsers } from './entities/channel.banned.entity';
import { ChannelsController } from './channels/channels.controller';
import { AvatarUploadModule } from './avatar-upload/avatar-upload.module';
import { AvatarUploadController } from './avatar-upload/avatar-upload.controller';

const environment = process.env.ENVIRONMENT;
const dbHost = process.env.DB_HOST;
const user = process.env.POSTGRES_USER;
const pass = process.env.POSTGRES_PASSWORD;
const db = process.env.POSTGRES_DB;

declare global {
  namespace Express {
    interface User {
      id: number;
      login_intra: string;
      tfa_enabled: boolean;
      tfa_secret?: string;
    }
  }
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: dbHost ?? 'localhost',
      port: 5432,
      username: user,
      password: pass,
      database: db,
      entities: [
        User,
        Profile,
        Channel,
        ChannelMessages,
        MatchEntity,
        DirectMessages,
        BannedUsers,
      ],
      synchronize: environment != 'prod',
      migrationsRun: true,
      logging: true,
      logger: 'file',
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: './uploads',
      serveRoot: '/avatars',
    }),
    UsersModule,
    AuthModule,
    ProfileModule,
    ChannelsModule,
    MatchMakingModule,
    DirectMessagesModule,
    AvatarUploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(
        UsersController,
        AuthController,
        DashboardController,
        BlockedController,
        FriendsController,
        FriendRequestsController,
        DirectMessagesController,
        ChannelsController,
        AuthController,
        AvatarUploadController,
      );
  }
}
