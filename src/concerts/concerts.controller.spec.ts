/* eslint-disable @typescript-eslint/require-await */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConcertsController } from './concerts.controller';
import { ConcertsService } from './concerts.service';

describe('ConcertsController', () => {
  let app: INestApplication;
  let service: Partial<ConcertsService>;

  beforeAll(async () => {
    service = {
      create: jest.fn().mockImplementation(async () => {}),
      get: jest.fn().mockResolvedValue([{ id: 1, name: 'Concert 1' }]),
      reserve: jest.fn().mockResolvedValue({ success: true }),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ConcertsController],
      providers: [
        {
          provide: ConcertsService,
          useValue: service,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /concert/', () => {
    it('should create a concert successfully', () => {
      return request(app.getHttpServer())
        .post('/concert/')
        .send({ name: 'Test Concert', description: 'desc', seat: 50 })
        .expect(201)
        .expect({ success: true, message: 'Created' });
    });

    it('should handle error in create', () => {
      (service.create as jest.Mock).mockImplementationOnce(async () => {
        throw new Error('Crash');
      });
      return request(app.getHttpServer())
        .post('/concert/')
        .send({ name: 'Test', description: 'desc', seat: 50 })
        .expect(500)
        .then((res) => {
          expect(res.body).toEqual({ success: false });
        });
    });
  });

  describe('GET /concert/', () => {
    it('should return all concerts', () => {
      return request(app.getHttpServer())
        .get('/concert/')
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            success: true,
            message: 'All concert',
            data: [{ id: 1, name: 'Concert 1' }],
          });
        });
    });

    it('should handle error in get', () => {
      (service.get as jest.Mock).mockImplementationOnce(async () => {
        throw new Error('Error fetching concerts');
      });
      return request(app.getHttpServer())
        .get('/concert/')
        .expect(500)
        .then((res) => {
          expect(res.body).toEqual({ success: false });
        });
    });
  });

  describe('GET /concert/reserve/:uuid', () => {
    it('should reserve a concert successfully', () => {
      return request(app.getHttpServer())
        .get('/concert/reserve/some-uuid')
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            success: true,
            message: 'Reserve completed.',
          });
        });
    });

    it('should handle reservation failure', () => {
      (service.reserve as jest.Mock).mockResolvedValue({
        success: false,
        message: 'Already reserved',
      });
      return request(app.getHttpServer())
        .get('/concert/reserve/uuid-fail')
        .expect(400)
        .then((res) => {
          expect(res.body).toEqual({
            success: false,
            message: 'Already reserved',
          });
        });
    });

    it('should handle error during reservation', () => {
      (service.reserve as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Error');
      });
      return request(app.getHttpServer())
        .get('/concert/reserve/error-uuid')
        .expect(500)
        .then((res) => {
          expect(res.body).toEqual({ success: false });
        });
    });

    describe('GET /concert/history', () => {
      it('should get hostory completed', async () => {
        service.history = jest.fn().mockReturnValue({
          full_name: 'a',
          create_at: new Date(),
          concert_name: 'concert_name',
          action: 'Reserve',
        });
        return request(app.getHttpServer())
          .get(`/concert/history`)
          .expect(200)
          .then((res) => {
            expect(res.body.success).toEqual(true);
            expect(service.history).toHaveBeenCalledTimes(1);
          });
      });

      it('should error onternal server', async () => {
        service.history = jest.fn().mockImplementation(() => {
          throw new Error('Test case error');
        });
        return request(app.getHttpServer())
          .get(`/concert/history`)
          .expect(500)
          .then((res) => {
            expect(res.body.success).toEqual(false);
            expect(service.history).toHaveBeenCalledTimes(1);
          });
      });
    });
  });

  describe('GET /concert/cancel/:uuid', () => {
    it('should cancel a concert successfully', () => {
      service.cancel = jest.fn().mockReturnThis();
      return request(app.getHttpServer())
        .get('/concert/cancel/some-uuid')
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            success: true,
            message: 'Cancel completed.',
          });
        });
    });

    it('should handle cancelation failure', () => {
      (service.cancel as jest.Mock).mockResolvedValue({
        success: false,
        message: 'Already canceled',
      });
      return request(app.getHttpServer())
        .get('/concert/cancel/uuid-fail')
        .expect(400)
        .then((res) => {
          expect(res.body).toEqual({
            success: false,
            message: 'Already canceled',
          });
        });
    });

    it('should handle error during cancelation', () => {
      (service.cancel as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Error');
      });
      return request(app.getHttpServer())
        .get('/concert/cancel/error-uuid')
        .expect(500)
        .then((res) => {
          expect(res.body).toEqual({ success: false });
        });
    });

    describe('GET /concert/history', () => {
      it('should get hostory completed', async () => {
        service.history = jest.fn().mockReturnValue({
          full_name: 'a',
          create_at: new Date(),
          concert_name: 'concert_name',
          action: 'Reserve',
        });
        return request(app.getHttpServer())
          .get(`/concert/history`)
          .expect(200)
          .then((res) => {
            expect(res.body.success).toEqual(true);
            expect(service.history).toHaveBeenCalledTimes(1);
          });
      });

      it('should error onternal server', async () => {
        service.history = jest.fn().mockImplementation(() => {
          throw new Error('Test case error');
        });
        return request(app.getHttpServer())
          .get(`/concert/history`)
          .expect(500)
          .then((res) => {
            expect(res.body.success).toEqual(false);
            expect(service.history).toHaveBeenCalledTimes(1);
          });
      });
    });
  });

  describe('DELETE /concert/:uuid', () => {
    it('should delete success', () => {
      service.deleteConcert = jest.fn().mockReturnThis();
      return request(app.getHttpServer())
        .delete(`/concert/same-uuid`)
        .expect(200)
        .then((res) => {
          expect(res.body.success).toEqual(true);
        });
    });

    it('should throw error', () => {
      service.deleteConcert = jest.fn().mockImplementation(() => {
        throw new Error('Test case error');
      });
      return request(app.getHttpServer())
        .delete(`/concert/same-uuid`)
        .expect(500)
        .then((res) => {
          expect(res.body.success).toEqual(false);
        });
    });
  });
});
