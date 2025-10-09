import {HttpContextToken, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';

// Contexto para saltar el header Authorization en peticiones puntuales
export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(OAuthService);

  // ¿Esta petición debe omitir el auth?
  if (req.context.get(SKIP_AUTH)) {
    return next(req);
  }

  // Asegura headers comunes
  let headers = req.headers.set('Accept', 'application/json');

  // No sobreescribir Content-Type en GET; sí en resto si no está
  if (!req.headers.has('Content-Type') && req.method !== 'GET') {
    headers = headers.set('Content-Type', 'application/json');
  }

  // Agrega Authorization si hay token
  if (authService.hasValidAccessToken()) {
    console.warn("Has valid access token")
    headers = headers.set('Authorization', `Bearer ${authService.getAccessToken()}`);
  }

  const authReq = req.clone({ headers });
  return next(authReq);
};
