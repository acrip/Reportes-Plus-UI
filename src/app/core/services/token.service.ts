import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  // Ajusta esta parte según cómo guardes el token (OAuth, Keycloak, etc.)
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  clear() {
    localStorage.removeItem('auth_token');
  }
}
