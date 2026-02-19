import {HttpContextToken, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';
import { environment } from '../../../environments/environment';

export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(OAuthService);
  const isBackendRequest = req.url.includes(environment.API_URL);

  if (req.context.get(SKIP_AUTH)) {
    return next(req);
  }

  let headers = req.headers.set('Accept', 'application/json');

  if (!req.headers.has('Content-Type') && req.method !== 'GET') {
    headers = headers.set('Content-Type', 'application/json');
  }

  if (authService.hasValidAccessToken() && isBackendRequest ) {
    headers = headers.set('Authorization', `Bearer ${authService.getIdToken()}`);
  }

  const authReq = req.clone({ headers });
  return next(authReq);
};
