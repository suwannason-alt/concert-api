import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsService } from './concerts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConcertEntity } from '../entities/concert.entity';
import { ConsertUserEntity } from '../entities/user-concert.entity';

describe('ConcertsService', () => {
  let service: ConcertsService;
  let concertRepositoryMock;
  let consertUserRepositoryMock;

  beforeEach(async () => {
    concertRepositoryMock = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      into: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      execute: jest.fn(),
      getMany: jest.fn(),
    };

    consertUserRepositoryMock = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      into: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertsService,
        {
          provide: getRepositoryToken(ConcertEntity),
          useValue: concertRepositoryMock,
        },
        {
          provide: getRepositoryToken(ConsertUserEntity),
          useValue: consertUserRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<ConcertsService>(ConcertsService);
  });

  describe('Create new consert', () => {
    it('should insert a new concert', async () => {
      const dto = { name: 'Concert 1', description: 'Desc', seat: 100 };
      concertRepositoryMock.execute.mockResolvedValue({});

      await expect(service.create(dto)).resolves.toBeUndefined();
      expect(concertRepositoryMock.createQueryBuilder).toHaveBeenCalled();
      expect(concertRepositoryMock.insert).toHaveBeenCalled();
      expect(concertRepositoryMock.values).toHaveBeenCalledWith([dto]);
    });
  });

  describe('Display all concert', () => {
    it('should return an array of concerts', async () => {
      const mockData = [{ id: 1, name: 'Concert 1' }];
      concertRepositoryMock.getMany.mockResolvedValue(mockData);

      const result = await service.get();

      expect(concertRepositoryMock.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });

  describe('Reserve consert', () => {
    it('should insert a reservation for a concert', async () => {
      consertUserRepositoryMock.execute.mockResolvedValue({});

      await expect(service.reserve('some-uuid')).resolves.toBeUndefined();
      expect(consertUserRepositoryMock.createQueryBuilder).toHaveBeenCalled();
      expect(consertUserRepositoryMock.insert).toHaveBeenCalled();
      expect(consertUserRepositoryMock.values).toHaveBeenCalledWith([
        { concert_uuid: 'some-uuid' },
      ]);
    });
  });
});
