import { Profile } from './entities/profile.entity';
import { User } from './entities/user.entity';
import { DataSource } from 'typeorm'
import { Channel } from './entities/channel.entity';
import { BannedUsers } from './entities/channel.banned.entity';
import { ChannelMessages } from './entities/channel_messages.entity';
import { DirectMessages } from './entities/direct_messages.entity';
import { Match } from './entities/match.entity';
import { MemoryMatch } from './match-manager/model/MemoryMatch';


const environment = process.env.ENVIRONMENT;
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
    Match,
  ],
});
