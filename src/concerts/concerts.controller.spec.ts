import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsController } from './concerts.controller';
import { ConcertsService } from './concerts.service';
import { Response } from 'express';

describe('ConcertsController', () => {
  let controller: ConcertsController;
  let serviceMock;

  beforeEach(async () => {
    serviceMock = {
      create: jest.fn(),
      get: jest.fn(),
      reserve: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcertsController],
      providers: [{ provide: ConcertsService, useValue: serviceMock }],
    }).compile();

    controller = module.get<ConcertsController>(ConcertsController);
    controller = module.get<ConcertsController>(ConcertsController);
  });

  describe('Create new record', () => {
    it('should respond with success message on successful creation', async () => {
      const mockRes: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const dto = { name: 'Test', description: 'Desc', seat: 50 };

      await controller.create(dto, mockRes as Response);

      expect(serviceMock.create).toHaveBeenCalledWith(dto);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Created',
      });
    });

    it('should respond with error when body validation fails', async () => {
      const mockRes: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const invalidBody = { name: '', seat: -1 };
      try {
        await controller.create(invalidBody as any, mockRes as Response);
      } catch (error) {
        expect(error.response.status).toHaveBeenCalledWith(400);
      }
    });

    it('should respond with error message if service throws', async () => {
      const mockRes: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      serviceMock.create = jest.fn().mockImplementation(() => {
        throw new Error('mocking throw error');
      });

      await controller.create(
        { name: 'test', description: 'test', seat: 100 } as any,
        mockRes as Response,
      );

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ success: false });
    });
  });

  describe('Retrive data', () => {
    it('should respond with data when successful', async () => {
      const mockData = [{ id: 1, name: 'Test Concert' }];
      const mockRes: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      serviceMock.get.mockResolvedValue(mockData);

      await controller.get(mockRes as Response);

      expect(serviceMock.get).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'All concert',
        data: mockData,
      });
    });

    it('should respond with success false if error occurs', async () => {
      const mockRes: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      serviceMock.get.mockRejectedValue(new Error('mocking throw error'));

      await controller.get(mockRes as Response);

      expect(serviceMock.get).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({ success: false });
    });
  });

  describe('Reserve consert', () => {
    it('should respond with success message on reservation', async () => {
      const mockRes: Partial<Response> = {
        json: jest.fn(),
      };

      await controller.reserve('some-uuid', mockRes as Response);

      expect(serviceMock.reserve).toHaveBeenCalledWith('some-uuid');
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Reserve completed.',
      });
    });

    it('should respond with success false if error occurs', async () => {
      const mockRes: Partial<Response> = {
        json: jest.fn(),
      };

      serviceMock.reserve.mockRejectedValue(new Error('mocking throw error'));

      await controller.reserve('some-uuid', mockRes as Response);

      expect(serviceMock.reserve).toHaveBeenCalledWith('some-uuid');
      expect(mockRes.json).toHaveBeenCalledWith({ success: false });
    });
  });
});
