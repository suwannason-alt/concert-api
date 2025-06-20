import { Module } from '@nestjs/common';
import { ConcertsController } from './concerts.controller';
import { ConcertsService } from './concerts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertEntity } from '../entities/concert.entity';
import { ConsertUserEntity } from '../entities/user-concert.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConcertEntity, ConsertUserEntity])],
  controllers: [ConcertsController],
  providers: [ConcertsService],
})
export class ConcertsModule {}
