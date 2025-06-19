import { Module } from '@nestjs/common';
import { ConcertsController } from './concerts.controller';
import { ConcertsService } from './concerts.service';

@Module({
  controllers: [ConcertsController],
  providers: [ConcertsService]
})
export class ConcertsModule {}
