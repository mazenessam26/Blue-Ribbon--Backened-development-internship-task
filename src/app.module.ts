import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
//import { CacheModule } from '@nestjs/cache-manager';
import { PrismaModule } from './prisma/module';
import { SportsModule } from './sports/module';
import { MembersModule } from './members/module';
import { SubscriptionsModule } from './subscriptions/module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // CacheModule.register({
    //   isGlobal: true,
    //   ttl: 300, // 5 minutes cache for sports endpoint
    // }),
    PrismaModule,
    SportsModule,
    MembersModule,
    SubscriptionsModule,
  ],
})
export class AppModule {}
// This module imports the necessary modules for the application, including configuration, caching, and the main feature modules.
