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
import { ChannelsSocketGateway } from './channels-socket.gateway';

const environment = process.env.ENVIRONMENT;
const dbHost = process.env.DB_HOST;

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
      username: 'user',
      password: 'pass',
      database: 'transcendence',
      entities: [User, Profile, Channel],
      synchronize: environment != 'prod',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    ProfileModule,
    ChannelsModule,
  ],
  controllers: [],
  providers: [ChannelsSocketGateway],
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
      );
  }
}
