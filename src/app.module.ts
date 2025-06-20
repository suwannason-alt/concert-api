import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConcertsModule } from './concerts/concerts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertEntity } from './entities/concert.entity';
import { ConsertUserEntity } from './entities/user-concert.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [ConcertEntity, ConsertUserEntity],
      synchronize: true,
    }),
    ConcertsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
