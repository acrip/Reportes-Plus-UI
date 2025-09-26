import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc'
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Accesos } from '../../core/models/accesos.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGoogleService {
  private backendEndpoint = 'usuariodestinos/usuario';

  constructor(
    private oauthService: OAuthService,
    private api: ApiService
  ) {
    this.initLogin();
  }

  initLogin() {
    const config: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId: '546111537941-5kbdoaoagsghvm746rf2sj8m8vdn6url.apps.googleusercontent.com',
      redirectUri: window.location.origin,
      scope: 'openid profile email',
    }

    this.oauthService.configure(config);
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.loadDiscoveryDocumentAndTryLogin()
    .then(() => {
      if (this.isLoggedIn()) {
        this.getUsuarioDestinos(); // si ya está logueado, se envía al backend
      }
    });
  }

  login() {
    this.oauthService.initLoginFlow();
  }

  logout() {
    this.oauthService.logOut();
  }

  isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  getIdToken(): string | null {
    return this.oauthService.getIdToken();
  }

  getProfile() {
    return JSON.parse(JSON.stringify(this.oauthService.getIdentityClaims()));
    console.log("Los claims de conexión de Google OAuth: " + JSON.parse(JSON.stringify(this.oauthService.getIdentityClaims())));
  }

  async getUsuarioDestinos(): Promise<Accesos | null> {
    const profile: any = this.getProfile();
    if (!profile || !profile.email) {
      console.warn('No se encontró el perfil o el email');
      return null;
    }

    // Extraer solo el username (antes de @) si el backend espera eso
    const username = profile.email.split('@')[0];

    try {
      const response = await firstValueFrom(
        this.api.get<Accesos>(`${this.backendEndpoint}/${username}`)
      );
      console.log('Respuesta de usuario destinos:', response);
      return response;
    } catch (error) {
      console.error('Error al obtener usuario destinos:', error);
      return null;
    }
  }
}
