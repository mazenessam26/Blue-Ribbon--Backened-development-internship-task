import { Module } from '@nestjs/common';
import { SubscriptionsController } from './controller';
import { SubscriptionsService } from './service';

@Module({
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
})
export class SubscriptionsModule {}
