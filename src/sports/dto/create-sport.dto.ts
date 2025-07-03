import { IsString, IsDecimal, IsEnum, IsNotEmpty, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { AllowedGender } from '@prisma/client';

export class CreateSportDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => parseFloat(value))
  @IsDecimal({ decimal_digits: '2' })
  @Min(0)
  subscriptionPrice: number;

  @IsEnum(AllowedGender)
  allowedGender: AllowedGender;
}