import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuctionModule } from './modules/auction/auction.module';
import { BidController } from './modules/bid/bid.controller';
import { BidService } from './modules/bid/bid.service';
import { BidModule } from './modules/bid/bid.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, // Don't need to import ConfigModule in other modules because it's now added in the global scope.
  }),
    UsersModule,
    DatabaseModule,
    AuthModule,
    AuctionModule,
    BidModule,
  ],
  controllers: [AppController, BidController],
  providers: [AppService, BidService],
})
export class AppModule { }
