import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ForbiddenError, PureAbility } from '@casl/ability';
import { CHECK_ABILITIES_KEY, RequiredAbility } from '../decorators/abilities.decorator';


@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest();
    const { user } = request; // Access user from the request object

    if (!user) {
      throw new Error('User not found on the request');
    }

    const requiredAbilities =
      this.reflector.get<RequiredAbility[]>(
        CHECK_ABILITIES_KEY,
        ctx.getHandler(),
      ) || [];

    const userAbilities = this.createUserAbilities(user.roles); // Create abilities from user roles
    const ability = new PureAbility(userAbilities);

    return requiredAbilities.every((requiredAbility) => {
      const { action, subject } = requiredAbility;
      ForbiddenError.from(ability)
        .setMessage(`Not authorized to ${action} ${subject}`)
        .throwUnlessCan(action, subject);
      return true;
    });
  }

  private createUserAbilities(roles: string[]) {
    // Map roles to abilities, e.g., Admin => 'manage', User => 'read'
    if (roles.includes('Admin')) {
      return [{ action: 'manage', subject: 'Article' }];
    }
    if (roles.includes('User')) {
      return [{ action: 'read', subject: 'all' }];
    }
    return [];
  }
}
