// azure-ad.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { AzureAdCustomStrategy } from './azure-ad-custom.strategy';  // Adjust path as necessary
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

@Injectable()
export class AzureAdGuard implements CanActivate {
  constructor(private readonly strategy: AzureAdCustomStrategy,private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    // Extract the token from the Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      // Use the custom strategy to validate the token and get the user
      const user = await this.strategy.validateToken(token);
      console.log('Authenticated user:', user);

      // Attach the user to the request object for the next guards to use
      request.user = user;
      return true;
    } catch (error) {
      console.log('Error validating token:', error);
      throw new UnauthorizedException(error.message);
    }
  }
}
