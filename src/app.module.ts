import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AzureAdGuard } from './auth/guards/azure-ad.guard';


@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass:  AzureAdGuard,
  },],
})
export class AppModule {}
