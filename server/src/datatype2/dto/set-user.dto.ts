import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SetUserDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  age: number;
}
