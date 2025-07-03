import { Module } from '@nestjs/common';
import { SportsController } from './controller';
import { SportsService } from './service';

@Module({
  controllers: [SportsController],
  providers: [SportsService],
  exports: [SportsService],
})
export class SportsModule {}