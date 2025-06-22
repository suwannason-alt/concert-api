/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsService } from './concerts.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConcertEntity } from '../entities/concert.entity';
import { ConsertUserEntity } from '../entities/user-concert.entity';
import { UserEntity } from '../entities/user.entity';

describe('ConcertsService', () => {
  let service: ConcertsService;
  let concertRepository: Repository<ConcertEntity>;
  let consertUserRepository: Repository<ConsertUserEntity>;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertsService,
        {
          provide: getRepositoryToken(ConcertEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ConsertUserEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ConcertsService>(ConcertsService);
    concertRepository = module.get(getRepositoryToken(ConcertEntity));
    consertUserRepository = module.get(getRepositoryToken(ConsertUserEntity));
    userRepository = module.get(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should insert a concert', async () => {
      concertRepository.createQueryBuilder = jest.fn().mockReturnValue({
        insert: jest.fn().mockReturnValue({
          into: jest.fn().mockReturnValue({
            values: jest.fn().mockReturnValue({
              execute: jest.fn().mockReturnThis(),
            }),
          }),
        }),
      });

      const dto = {
        name: 'Concert Name',
        description: 'Description',
        seat: 100,
      };
      const result = await service.create(dto);
      expect(result).toEqual({ success: true });
    });
  });

  describe('get', () => {
    it('should return an array of concerts', async () => {
      const concertArray = [{ id: 1, name: 'Concert 1' }];
      jest.spyOn(concertRepository, 'createQueryBuilder').mockImplementation(
        () =>
          ({
            getMany: jest.fn().mockResolvedValue(concertArray),
          }) as any,
      );

      const result = await service.get();
      expect(result).toEqual(concertArray);
    });
  });

  describe('reserve', () => {
    it('should reserve a concert for the user', async () => {
      const mockUser = {
        uuid: 'user-uuid',
        name: 'Test User',
        consertUser: [],
      } as UserEntity;
      userRepository.findOne = jest.fn().mockReturnValue(mockUser);
      consertUserRepository.createQueryBuilder = jest.fn().mockReturnValue({
        insert: jest.fn().mockReturnValue({
          into: jest.fn().mockReturnValue({
            values: jest.fn().mockReturnValue({
              execute: jest.fn().mockReturnThis(),
            }),
          }),
        }),
        where: jest.fn().mockReturnValue({
          andWhere: jest.fn().mockReturnValue({
            andWhere: jest.fn().mockReturnValue({
              orderBy: jest.fn().mockReturnValue({
                getOne: jest.fn().mockReturnValue(null),
              }),
            }),
          }),
        }),
      });
      // service.reserve = jest.fn().mockReturnThis();

      const result = await service.reserve('concert-uuid');
      // console.log({ result });
      expect(result).toEqual({ success: true });
    });
  });

  describe('cancel', () => {
    it('should cancel a reserved concert for the user', async () => {
      const mockUser = {
        uuid: 'user-uuid',
        name: 'Test User',
        consertUser: [],
      } as UserEntity;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest
        .spyOn(consertUserRepository, 'createQueryBuilder')
        .mockImplementation(
          () =>
            ({
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(undefined),
              insert: jest.fn().mockReturnThis(),
              into: jest.fn().mockReturnThis(),
              values: jest.fn().mockReturnThis(),
              execute: jest.fn().mockResolvedValue({}),
            }) as any,
        );

      const result = await service.cancel('concert-uuid');
      expect(result).toEqual({ success: true });
    });
  });
  it('should throw error in create when repository fails', async () => {
    jest.spyOn(concertRepository, 'createQueryBuilder').mockImplementation(
      () =>
        ({
          insert: jest.fn().mockReturnThis(),
          into: jest.fn().mockReturnThis(),
          values: jest.fn().mockReturnThis(),
          execute: jest.fn().mockRejectedValue(new Error('fail')),
        }) as any,
    );

    const dto = { name: 'Concert', description: 'desc', seat: 50 };
    await expect(service.create(dto)).rejects.toThrow('fail');
  });

  it('should handle error in get', async () => {
    jest.spyOn(concertRepository, 'createQueryBuilder').mockImplementation(
      () =>
        ({
          getMany: jest.fn().mockRejectedValue(new Error('error')),
        }) as any,
    );

    await expect(service.get()).rejects.toThrow('error');
  });

  describe('history', () => {
    it('should return result', async () => {
      const mockData = [
        {
          create_at: new Date(),
          full_name: 'full_name',
          concert_name: 'concert_name',
          action: 'Reserve',
        },
      ];
      consertUserRepository.createQueryBuilder = jest.fn().mockReturnValue({
        innerJoin: jest.fn().mockReturnValue({
          innerJoin: jest.fn().mockReturnValue({
            orderBy: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                getRawMany: jest.fn().mockReturnValue(mockData),
              }),
            }),
          }),
        }),
      });
      const result = await service.history();
      expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it('should throw error', async () => {
      consertUserRepository.createQueryBuilder = jest.fn().mockReturnValue({
        innerJoin: jest.fn().mockReturnValue({
          innerJoin: jest.fn().mockImplementation(() => {
            throw new Error('Test error');
          }),
        }),
      });
      try {
        await service.history();
      } catch (error) {
        expect(error.message).toContain('Test error');
      }
    });
  });

  describe('delete', () => {
    it('Should delete complete', async () => {
      concertRepository.delete = jest.fn().mockReturnThis();

      await service.deleteConcert('same-uuid');
      expect(concertRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('Should throw error', async () => {
      concertRepository.delete = jest.fn().mockImplementation(() => {
        throw new Error('Test case error');
      });

      try {
        await service.deleteConcert('same-uuid');
      } catch (error) {
        expect(error.message).toContain('Test case error');
      }
    });
  });
});
