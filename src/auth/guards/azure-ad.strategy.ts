import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BearerStrategy } from 'passport-azure-ad';

const config = {
  credentials: {
    tenantID: '9915a2c7-1afd-4377-8061-f724d4c64cda',
    clientID: '24dfb5c5-1fa4-44e4-97c6-daf83e7b3227',
    audience: '24dfb5c5-1fa4-44e4-97c6-daf83e7b3227',
  },
  metadata: {
    authority: 'login.microsoftonline.com',
    discovery: '.well-known/openid-configuration',
    version: 'v2.0',
  },
  settings: {
    validateIssuer: true,
    passReqToCallback: false,
    loggingLevel: 'info',
  },
};
const EXPOSED_SCOPES = ['read_data'];

@Injectable()
export class AzureAdStrategy extends PassportStrategy(
  BearerStrategy,
  'azure-ad',
) {
  constructor() {
    super({
      identityMetadata: `https://${config.metadata.authority}/${config.credentials.tenantID}/${config.metadata.version}/${config.metadata.discovery}`,
      issuer: [
        `https://sts.windows.net/${config.credentials.tenantID}/`,
        `https://${config.metadata.authority}/${config.credentials.tenantID}/${config.metadata.version}`,
      ],
      clientID: config.credentials.clientID,
      audience: [
        config.credentials.audience,
        `api://${config.credentials.audience}`,
      ],
      validateIssuer: config.settings.validateIssuer,
      passReqToCallback: config.settings.passReqToCallback,
      loggingLevel: config.settings.loggingLevel,
      scope: EXPOSED_SCOPES,
      loggingNoPII: false,
    });
  }

  async validate(payload: any): Promise<any> {
    if (!payload) {
      throw new Error('Invalid token payload');
    }

    const {
      oid,
      name,
      unique_name,
      roles,
      scp,
      ipaddr,
      tid,
      given_name,
      family_name,
    } = payload;

    return {
      id: oid,
      name,
      username: unique_name,
      roles,
      scopes: scp,
      tenantId: tid,
      ipAddress: ipaddr,
      firstName: given_name,
      lastName: family_name,
    };
  }
}
