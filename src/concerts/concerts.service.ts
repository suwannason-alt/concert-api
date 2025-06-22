import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConcertEntity } from '../entities/concert.entity';
import { Repository } from 'typeorm';
import { DtoCreateConcert } from './dto/create';
import { ConsertUserEntity } from '../entities/user-concert.entity';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class ConcertsService {
  constructor(
    @InjectRepository(ConcertEntity)
    private readonly concertRepository: Repository<ConcertEntity>,

    @InjectRepository(ConsertUserEntity)
    private readonly consertUserRepository: Repository<ConsertUserEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepositoty: Repository<UserEntity>,
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
      return { success: true };
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
      const user = await this.userRepositoty.findOne({
        where: {},
      });
      if (!user) {
        return { success: false, message: `Not found user.` };
      }
      const alreadyReserve = await this.consertUserRepository
        .createQueryBuilder(`cu`)
        .where(`cu.user_uuid = :uuid`, { uuid: user.uuid })
        .andWhere(`cu.concert_uuid = :uuid`, { uuid: concert_uuid })
        .andWhere(`cu.action = :status`, { status: 'Reserve' })
        .orderBy(`cu.create_at`, 'DESC')
        .getOne();
      if (alreadyReserve) {
        return { success: false, message: `This consert already reserved.` };
      }
      await this.consertUserRepository
        .createQueryBuilder()
        .insert()
        .into(ConsertUserEntity)
        .values([
          {
            concert_uuid,
            user_uuid: user.uuid,
            action: 'Reserve',
            create_at: new Date(),
          },
        ])
        .execute();
      return { success: true };
    } catch (error) {
      throw new Error(error);
    }
  }

  async cancel(concert_uuid: string) {
    try {
      const user = await this.userRepositoty.findOne({});
      if (!user) {
        return { success: false, message: `Not found user.` };
      }
      const alreadyReserve = await this.consertUserRepository
        .createQueryBuilder(`cu`)
        .where(`cu.user_uuid = :uuid`, { uuid: user.uuid })
        .andWhere(`cu.consert_uuid = :uuid`, { uuid: concert_uuid })
        .andWhere(`cu.action = :status`, { status: 'Cancel' })
        .orderBy(`cu.create_at`, 'DESC')
        .getOne();
      if (alreadyReserve) {
        return { success: false, message: `This consert already Cancel.` };
      }
      await this.consertUserRepository
        .createQueryBuilder()
        .insert()
        .into(ConsertUserEntity)
        .values([
          {
            concert_uuid,
            user_uuid: user.uuid,
            action: 'Cancel',
            create_at: new Date(),
          },
        ])
        .execute();
      return { success: true };
    } catch (error) {
      throw new Error(error);
    }
  }

  async history() {
    try {
      const data = await this.consertUserRepository
        .createQueryBuilder(`cu`)
        .innerJoin(ConcertEntity, `c`, `c.uuid = cu.concert_uuid`)
        .innerJoin(UserEntity, `u`, `u.uuid = cu.user_uuid`)
        .orderBy(`cu.create_at`, 'DESC')
        .select([
          `cu.create_at as create_at`,
          `u.name AS full_name`,
          `c.name AS concert_name`,
          `cu."action" AS action`,
        ])
        .getRawMany();
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
}
