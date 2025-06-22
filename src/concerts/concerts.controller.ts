import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { DtoCreateConcert } from './dto/create';
import { ConcertsService } from './concerts.service';

@Controller('/concert')
export class ConcertsController {
  private logger = new Logger(ConcertsController.name);
  constructor(private readonly concertService: ConcertsService) {}

  @Post('/')
  async create(@Body() body: DtoCreateConcert, @Res() res: Response) {
    try {
      await this.concertService.create(body);
      res.status(201);
      res.json({ success: true, message: `Created` });
    } catch (error) {
      this.logger.error(error.message, error.stack);
      res.status(500);
      res.json({ success: false });
    }
  }

  @Get('/')
  async get(@Res() res: Response) {
    try {
      const data = await this.concertService.get();
      res.status(200);
      res.json({ success: true, message: `All concert`, data });
    } catch (error) {
      this.logger.error(error.message, error.stack);
      res.json({ success: false });
    }
  }

  @Get('/reserve/:uuid')
  async reserve(@Param('uuid') uuid: string, @Res() res: Response) {
    try {
      const result = await this.concertService.reserve(uuid);
      if (result.success === false) {
        res.status(400);
        res.json({ success: false, message: result.message });
        return;
      }
      res.json({ success: true, message: `Reserve completed.` });
    } catch (error) {
      this.logger.error(error.message, error.stack);
      res.json({ success: false });
    }
  }

  @Get('/cancel/:uuid')
  async cancel(@Param('uuid') uuid: string, @Res() res: Response) {
    try {
      const result = await this.concertService.cancel(uuid);
      if (result.success === false) {
        res.status(400);
        res.json({ success: false, message: result.message });
        return;
      }
      res.json({ success: true, message: `Cancel completed.` });
    } catch (error) {
      this.logger.error(error.message, error.stack);
      res.json({ success: false });
    }
  }

  @Get('/history')
  async history(@Res() res: Response) {
    try {
      const data = await this.concertService.history();
      res.json({ success: true, data });
    } catch (error) {
      this.logger.error(error.message, error.stack);
      res.status(500);
      res.json({ success: false });
    }
  }

  @Delete('/:uuid')
  async deleteConcert(@Param('uuid') uuid: string, @Res() res: Response) {
    try {
      await this.concertService.deleteConcert(uuid);
      res.json({ success: true, message: `Delete completed` });
    } catch (error) {
      this.logger.error(error.message, error.stack);
      res.status(500);
      res.json({ success: false });
    }
  }
}
