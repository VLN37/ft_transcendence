import { Module } from '@nestjs/common';
import { IntraServiceMock } from './intra.service.mock';
import { IntraService } from './intra.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
// import { IntraService } from './intra.service';

const prod = process.env.ENVIRONMENT == 'prod';

@Module({
  imports: [JwtModule.register({}), UsersModule],
  providers: [
    {
      provide: IntraService,
      useClass: prod ? IntraService : IntraServiceMock,
    },
  ],
  exports: [IntraService],
})
export class IntraModule {}
