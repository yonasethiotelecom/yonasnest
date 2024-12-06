import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { AzureAdStrategy } from './guards/azure-ad.strategy';
import { ConfigModule } from '@nestjs/config';
import { AzureAdCustomStrategy } from './guards/azure-ad-custom.strategy';
import { AzureAdGuard } from './guards/azure-ad.guard';
import { AbilitiesGuard } from 'src/common/guards/abilities.guard';
import { AuthListener } from './listeners/auth.listener';


@Module({
  imports: [PassportModule.register({ defaultStrategy: 'azure-ad' })],

  controllers: [AuthController],
  providers: [AuthService,AzureAdCustomStrategy, AzureAdGuard,AbilitiesGuard, AuthListener],
  exports: [AzureAdCustomStrategy, AzureAdGuard],
})
export class AuthModule {}
