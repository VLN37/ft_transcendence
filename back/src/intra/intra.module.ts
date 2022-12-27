import { forwardRef, Module } from '@nestjs/common';
import { IntraServiceMock } from './intra.service.mock';
import { IntraService } from './intra.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
// import { IntraService } from './intra.service';

@Module({
  imports: [JwtModule.register({}), UsersModule],
  providers: [
    {
      provide: IntraService,
      useClass: IntraServiceMock,
    },
  ],
  exports: [IntraService],
})
export class IntraModule {}
