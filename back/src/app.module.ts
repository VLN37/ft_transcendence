import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

const environment = process.env.ENVIRONMENT;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database',
      port: 5432,
      username: 'user',
      password: 'pass',
      database: 'transcendence',
      entities: [User],
      synchronize: environment != 'prod',
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
