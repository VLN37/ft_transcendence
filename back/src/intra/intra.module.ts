import { Module } from '@nestjs/common';
import { IntraServiceMock } from './intra.service.mock';
import { IntraService } from './intra.service';
// import { IntraService } from './intra.service';

@Module({
  providers: [
    {
      provide: IntraService,
      useClass: IntraServiceMock,
    },
  ],
  exports: [IntraService],
})
export class IntraModule {}
