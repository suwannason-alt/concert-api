import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DtoCreateConcert {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNumber()
  seat: number;
}
