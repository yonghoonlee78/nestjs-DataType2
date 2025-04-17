import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SetBalanceDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;
}
