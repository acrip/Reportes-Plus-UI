import { DestroyRef, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { LoginOptions, OAuthService } from 'angular-oauth2-oidc';
import { UserProfile } from '../models/user-profile.model';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
import { AUTH_CONFIG } from '../auth/auth-config';
import { ApiService } from './api.service';
import { PermisoResponse } from '../models/permiso.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGoogleService {
  private readonly router = inject(Router);
  private readonly apiService = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly oAuthService = inject(OAuthService);

  private readonly _isAuthenticated: WritableSignal<boolean> = signal(false);
  private readonly _userProfile: WritableSignal<UserProfile | null> = signal(null);
  private readonly _isLoading: WritableSignal<boolean> = signal(false);
  private readonly _isInitialized: WritableSignal<boolean> = signal(false);

  public readonly isAuthenticated: Signal<boolean> = this._isAuthenticated.asReadonly();
  public readonly userProfile: Signal<UserProfile | null> = this._userProfile.asReadonly();
  public readonly isLoading: Signal<boolean> = this._isLoading.asReadonly();
  public readonly isInitialized: Signal<boolean> = this._isInitialized.asReadonly();

  constructor() {
    console.log('🏗️ AuthGoogleService constructor iniciado');
    this.initAuthentication();
  }

  public async initAuthentication(): Promise<void> {
    console.log('🚀 Iniciando autenticación...');
    this._isLoading.set(true);
    try {
      this.oAuthService.configure(AUTH_CONFIG);
      this.oAuthService.setupAutomaticSilentRefresh();

      console.log('📡 Cargando discovery document...');
      await this.oAuthService.loadDiscoveryDocumentAndTryLogin();

      console.log('👂 Configurando event listeners...');
      await this.handleEvents();

      console.log('🔄 Actualizando estado de autenticación...');
      await this.updateAuthenticationState();

      console.log('✅ Autenticación inicializada correctamente');

    } catch (error) {
      console.error('❌ Error en inicialización:', error);
      this._userProfile.set(null);
      this._isAuthenticated.set(false);
    } finally {
      this._isLoading.set(false);
      this._isInitialized.set(true);

      console.log('📊 Estado final:');
      console.log('  - isAuthenticated:', this.isAuthenticated());
      console.log('  - isLoading:', this.isLoading());
      console.log('  - isInitialized:', this.isInitialized());
      console.log('  - userProfile:', this.userProfile());
    }
  }

  private async handleEvents(): Promise<void> {
    this.oAuthService.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async event => {
        console.log('📢 OAuth Event:', event.type);
        if (['token_received', 'session_terminated', 'session_changed'].includes(event.type)) {
          await this.updateAuthenticationState();
        }
      });
  }

  private async updateAuthenticationState(): Promise<void> {
    const isAuthenticated = this.oAuthService.hasValidAccessToken();
    console.log('🔐 Token válido:', isAuthenticated);

    this._isAuthenticated.set(isAuthenticated);

    if (isAuthenticated) {
      await this.loadCompleteUserProfile();
    } else {
      this._userProfile.set(null);
      console.log('⚠️ No hay token válido, perfil limpiado');
    }
  }

  private async loadCompleteUserProfile(): Promise<void> {
    try {
      console.log('👤 Cargando perfil de usuario...');

      if (!this.oAuthService.hasValidAccessToken()) {
        console.log('🔄 Refrescando token...');
        await this.oAuthService.refreshToken();
      }
      const baseProfile = await this.oAuthService.loadUserProfile() as any;
      console.log('📋 Perfil base obtenido:', baseProfile);

      const permisos = await this.loadUserPermissions();
      console.log('🔑 Permisos obtenidos:', permisos);

      const completeProfile: UserProfile = {
        ...baseProfile,
        given_name: baseProfile.info?.given_name,
        family_name: baseProfile.info?.family_name,
        picture: baseProfile.info?.picture,
        permiso: permisos.length > 0 ? permisos[0].idDestino : undefined
      };

      console.log('✨ Perfil completo construido:', completeProfile);
      this._userProfile.set(completeProfile);

    } catch (error) {
      console.error('❌ Error cargando perfil completo:', error);
      this._userProfile.set(null);
    }
  }

  private loadUserPermissions(): Promise<PermisoResponse[]> {
    return new Promise((resolve) => {
      this.apiService.get<PermisoResponse[]>('permisos')
        .pipe(
          catchError((error) => {
            console.warn('⚠️ Error cargando permisos, usando array vacío:', error);
            return of([]);
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(permisos => {
          console.log('📬 Permisos recibidos:', permisos);
          resolve(permisos);
        });
    });
  }

  public login(): void {
    console.log('🔑 Iniciando login flow...');
    this.oAuthService.initLoginFlow();
  }

  public logout(): void {
    console.log('👋 Cerrando sesión...');
    this._isLoading.set(true);
    this._userProfile.set(null);
    this._isAuthenticated.set(false);

    this.oAuthService.revokeTokenAndLogout();
    this.oAuthService.logOut();
    this.router.navigate(['/login']);

  }

  public async refreshPermissions(): Promise<void> {
    if (!this._isAuthenticated()) {
      console.log('⚠️ No autenticado, no se pueden refrescar permisos');
      return;
    }

    try {
      console.log('🔄 Refrescando permisos...');
      const permisos = await this.loadUserPermissions();

      const currentProfile = this._userProfile();

      if (currentProfile) {
        this._userProfile.set({
          ...currentProfile,
          permiso: permisos.length > 0 ? permisos[0].idDestino : undefined
        });
        console.log('✅ Permisos actualizados');
      }
    } catch (error) {
      console.error('❌ Error refrescando permisos:', error);
    }
  }
}
