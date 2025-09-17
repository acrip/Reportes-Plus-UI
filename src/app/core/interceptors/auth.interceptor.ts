import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

// Contexto para saltar el header Authorization en peticiones puntuales
export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // ¿Esta petición debe omitir el auth?
  if (req.context.get(SKIP_AUTH)) {
    return next(req);
  }

  const tokenService = inject(TokenService);
  const token = tokenService.getToken();

  // Asegura headers comunes
  let headers = req.headers.set('Accept', 'application/json');

  // No sobreescribir Content-Type en GET; sí en resto si no está
  if (!req.headers.has('Content-Type') && req.method !== 'GET') {
    headers = headers.set('Content-Type', 'application/json');
  }

  // Agrega Authorization si hay token
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  const authReq = req.clone({ headers });
  return next(authReq);
};
