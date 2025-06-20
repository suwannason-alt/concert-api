import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConcertEntity } from '../entities/concert.entity';
import { Repository } from 'typeorm';
import { DtoCreateConcert } from './dto/create';
import { ConsertUserEntity } from '../entities/user-concert.entity';

@Injectable()
export class ConcertsService {
  constructor(
    @InjectRepository(ConcertEntity)
    private readonly concertRepository: Repository<ConcertEntity>,

    @InjectRepository(ConsertUserEntity)
    private readonly consertUserRepository: Repository<ConsertUserEntity>,
  ) {}

  async create(body: DtoCreateConcert) {
    try {
      await this.concertRepository
        .createQueryBuilder()
        .insert()
        .into(ConcertEntity)
        .values([
          {
            name: body.name,
            description: body.description,
            seat: body.seat,
          },
        ])
        .execute();
    } catch (error) {
      throw new Error(error);
    }
  }

  async get() {
    try {
      const data = await this.concertRepository.createQueryBuilder().getMany();
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async reserve(concert_uuid: string) {
    try {
      await this.consertUserRepository
        .createQueryBuilder()
        .insert()
        .into(ConsertUserEntity)
        .values([
          {
            concert_uuid,
          },
        ])
        .execute();
    } catch (error) {
      throw new Error(error);
    }
  }
}
