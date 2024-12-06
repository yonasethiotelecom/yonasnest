import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class AzureAdCustomStrategy {
  private readonly jwksClient;

  constructor() {
    this.jwksClient = jwksRsa({
      jwksUri: `https://login.microsoftonline.com/9915a2c7-1afd-4377-8061-f724d4c64cda/discovery/v2.0/keys`,
      cache: true,
      rateLimit: true,
    });
  }

  async validateToken(token: string): Promise<any> {
    try {
      // Decode the token to get the header
      const decodedToken = jwt.decode(token, { complete: true });
      if (!decodedToken || typeof decodedToken === 'string') {
        throw new Error('Invalid token format');
      }

      const kid = decodedToken.header.kid;

      // Retrieve the signing key
      const key = await this.jwksClient.getSigningKey(kid);
      const publicKey = key.getPublicKey();

      // Verify the token
      const payload: any =  jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
        audience: [
          '24dfb5c5-1fa4-44e4-97c6-daf83e7b3227',
          'api://24dfb5c5-1fa4-44e4-97c6-daf83e7b3227',
        ],
        issuer: [
          `https://sts.windows.net/9915a2c7-1afd-4377-8061-f724d4c64cda/`,
          `https://login.microsoftonline.com/9915a2c7-1afd-4377-8061-f724d4c64cda/v2.0`,
        ],
      });
console.log({
    id: payload.oid,
    name: payload.name,
    username: payload.unique_name,
    roles: payload.roles || [],
    scopes: payload.scp || '',
    tenantId: payload.tid,
    ipAddress: payload.ipaddr || '',
    firstName: payload.given_name,
    lastName: payload.family_name,
  });
      // Return the validated payload as user data
      return {
        id: payload.oid,
        name: payload.name,
        username: payload.unique_name,
        roles: payload.roles || [],
        scopes: payload.scp || '',
        tenantId: payload.tid,
        ipAddress: payload.ipaddr || '',
        firstName: payload.given_name,
        lastName: payload.family_name,
      };

    } catch (error) {
      throw new Error(`Token validation failed: ${error.message}`);
    }
  }
}
