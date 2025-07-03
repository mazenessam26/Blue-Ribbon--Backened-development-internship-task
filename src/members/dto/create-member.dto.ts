import { IsString, IsEnum, IsDateString, IsOptional, IsUUID } from 'class-validator';
import { Gender } from '@prisma/client';

export class CreateMemberDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsDateString()
  birthdate: string;

  @IsOptional()
  @IsUUID()
  familyHeadId?: string;
}