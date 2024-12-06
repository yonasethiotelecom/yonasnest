import { SetMetadata } from '@nestjs/common';

export type RequiredAbility = {
  action: 'read' | 'create' | 'update' | 'delete' | 'manage';
  subject: string;
};

export const CHECK_ABILITIES_KEY = 'check_abilities';
export const CheckAbilities = (...abilities: RequiredAbility[]) =>
  SetMetadata(CHECK_ABILITIES_KEY, abilities);