import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, // Don't need to import ConfigModule in other modules because it's now added in the global scope.
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
