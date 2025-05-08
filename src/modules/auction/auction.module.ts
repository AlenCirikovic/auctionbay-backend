import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionController } from './auction.controller';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AuctionService,AuthModule,JwtModule],
  controllers: [AuctionController]
})
export class AuctionModule {}
