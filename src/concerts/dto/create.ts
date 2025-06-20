import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class DtoCreateConcert {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsPositive()
  @IsNumber()
  seat: number;
}
