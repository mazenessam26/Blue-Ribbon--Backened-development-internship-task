import { IsUUID, IsEnum } from 'class-validator';
import { SubscriptionType } from '@prisma/client';

export class CreateSubscriptionDto {
  @IsUUID()
  memberId: string;

  @IsUUID()
  sportId: string;

  @IsEnum(SubscriptionType)
  subscriptionType: SubscriptionType;
}