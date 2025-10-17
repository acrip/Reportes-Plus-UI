import { DestroyRef, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
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

  public readonly isAuthenticated: Signal<boolean> = this._isAuthenticated.asReadonly();
  public readonly userProfile: Signal<UserProfile | null> = this._userProfile.asReadonly();
  public readonly isLoading: Signal<boolean> = this._isLoading.asReadonly();

  private readonly isInitializationCompleteSubject = new BehaviorSubject<boolean>(false);
  public readonly isInitializationComplete$: Observable<boolean> = this.isInitializationCompleteSubject.asObservable();

  constructor() {
    this.initAuthentication();
  }

  public async initAuthentication(): Promise<void> {
    try {
      this.oAuthService.configure(AUTH_CONFIG);
      this.oAuthService.setupAutomaticSilentRefresh();

      await this.oAuthService.loadDiscoveryDocumentAndTryLogin();

      await this.handleEvents();
      await this.updateAuthenticationState();
      this.isInitializationCompleteSubject.next(true);

    } catch (error) {
      this.isInitializationCompleteSubject.next(true);
    }
  }

  private async handleEvents(): Promise<void> {
    this.oAuthService.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async event => {
        if (['token_received', 'session_terminated', 'session_changed'].includes(event.type)) {
          await this.updateAuthenticationState();
        }
      });
  }

  private async updateAuthenticationState(): Promise<void> {
    const isAuthenticated = this.oAuthService.hasValidAccessToken();
    this._isAuthenticated.set(isAuthenticated);

    if (isAuthenticated) {
      await this.loadCompleteUserProfile();
    } else {
      this._userProfile.set(null);
    }
  }

  private async loadCompleteUserProfile(): Promise<void> {
    this._isLoading.set(true);

    try {
      if (!this.oAuthService.hasValidAccessToken()) {
        await this.oAuthService.refreshToken();
      }
      const baseProfile = await this.oAuthService.loadUserProfile() as UserProfile;

      const permisos = await this.loadUserPermissions();

      const completeProfile: UserProfile = {
        ...baseProfile,
        permiso: permisos.length > 0 ? permisos[0].idDestino : undefined
      };

      this._userProfile.set(completeProfile);
    } catch (error) {
      console.error('Error cargando perfil completo:', error);
      this._userProfile.set(null);
    } finally {
      this._isLoading.set(false);
    }
  }

  private loadUserPermissions(): Promise<PermisoResponse[]> {
    return new Promise((resolve) => {
      this.apiService.get<PermisoResponse[]>('permisos')
        .pipe(
          catchError((error) => {
            return of([]);
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(permisos => resolve(permisos));
    });
  }

  public login(): void {
    this.oAuthService.initLoginFlow();
  }

  public logout(): void {
    this._isLoading.set(true);
    this._userProfile.set(null);
    this._isAuthenticated.set(false);

    this.oAuthService.revokeTokenAndLogout();
    this.oAuthService.logOut();
    this.router.navigate(['/login']);

  }

  public async refreshPermissions(): Promise<void> {
    if (!this._isAuthenticated()) {
      return;
    }

    try {
      const permisos = await this.loadUserPermissions();

      const currentProfile = this._userProfile();

      if (currentProfile) {
        this._userProfile.set({
          ...currentProfile,
          permiso: permisos.length > 0 ? permisos[0].idDestino : undefined
        });
      }
    } catch (error) {
    }
  }
}
