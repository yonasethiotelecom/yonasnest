import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AzureAdGuard } from './guards/azure-ad.guard';
import { CheckAbilities } from 'src/common/decorators/abilities.decorator';
import { AbilitiesGuard } from 'src/common/guards/abilities.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')


export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @Public()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
 
  @CheckAbilities({ action: 'manage', subject: 'Article' })  // Ability-based guard
  @UseGuards(AbilitiesGuard)  // Abilities guard (executed after AzureAdGuard)
 
  findAll(@CurrentUser() user:any) {
    return JSON.stringify(user);
    //return this.authService.findAll();
  }
/*   @UseGuards(AuthGuard('azure-ad')) */
  @Get('callback')
  handleCallback(@Req() req: any) {
    const user = req.user;
    return {
      message: 'Authentication successful!',
      user,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
