import { Profile } from './src/entities/profile.entity';
import { User } from './src/entities/user.entity';
import { DataSource } from 'typeorm';
import { Channel } from './src/entities/channel.entity';
import { BannedUsers } from './src/entities/channel.banned.entity';
import { ChannelMessages } from './src/entities/channel_messages.entity';
import { DirectMessages } from './src/entities/direct_messages.entity';
import { MatchEntity } from './src/entities/match.entity';

const dbHost = process.env.DB_HOST;
const user = process.env.POSTGRES_USER;
const pass = process.env.POSTGRES_PASSWORD;
const db = process.env.POSTGRES_DB;

export default new DataSource({
  type: 'postgres',
  host: dbHost ?? 'localhost',
  port: 5432,
  username: user,
  password: pass,
  database: db,
  migrations: ['./src/migrations/*.ts'],
  entities: [
    User,
    Profile,
    Channel,
    BannedUsers,
    ChannelMessages,
    DirectMessages,
    MatchEntity,
  ],
});
