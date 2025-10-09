import {AuthConfig, OAuthStorage} from "angular-oauth2-oidc";
import {environment} from '../../../environments/environment';

export function provideOAuthStorage() {
  return {provide: OAuthStorage, useFactory: oAuthStorageFactory};
}

export function oAuthStorageFactory(): OAuthStorage {
  return localStorage;
}

export const AUTH_CONFIG: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  clientId: environment.CLIENT_ID,
  redirectUri: `${environment.APP_BASE_URL}/home`,
  scope: 'openid profile email',
  showDebugInformation: false,
};
