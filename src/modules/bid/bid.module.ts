import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { BidController } from './bid.controller';

@Module({
  providers: [BidService,AuthModule,JwtModule],
  controllers: [BidController]
})
export class BidModule {}
