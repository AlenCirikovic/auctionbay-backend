import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuctionModule } from './modules/auction/auction.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, // Don't need to import ConfigModule in other modules because it's now added in the global scope.
  }),
    UsersModule,
    DatabaseModule,
    AuthModule,
    AuctionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
