import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { environment } from '../../../environments/environment';
import { UserProfile } from '../models/user-profile.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGoogleService {
  private readonly _isAuthenticated: WritableSignal<boolean> = signal(false);
  private readonly _userProfile: WritableSignal<UserProfile | null> = signal(null);
  public readonly isAuthenticated: Signal<boolean> = this._isAuthenticated.asReadonly();
  public readonly userProfile: Signal<UserProfile | null> = this._userProfile.asReadonly();

  private readonly isInitializationCompleteSubject = new BehaviorSubject<boolean>(false);
  public readonly isInitializationComplete$: Observable<boolean> = this.isInitializationCompleteSubject.asObservable();

  constructor(private oAuthService: OAuthService) {
    this.initAuthentication();
  }

  public initAuthentication(): void {
    const config: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId: environment.CLIENT_ID,
      redirectUri: window.location.origin + '/home',
      scope: 'openid profile email',
    };

    this.oAuthService.configure(config);
    this.oAuthService.setupAutomaticSilentRefresh();
    this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      this.handleEvents();
      this.updateAuthenticationState();
      this.isInitializationCompleteSubject.next(true)
    });
  }
  private handleEvents(): void {
    this.oAuthService.events.subscribe(event => {
      if (event.type === 'token_received' || event.type === 'session_terminated' || event.type === 'session_changed') {
        this.updateAuthenticationState();
      }
    });
  }

  private updateAuthenticationState(): void {
    const isAuthenticated = this.oAuthService.hasValidAccessToken();
    this._isAuthenticated.set(isAuthenticated);

    if (isAuthenticated) {
      this.loadUserProfile();
    } else {
      this._userProfile.set(null);
    }
  }

  public login(): void {
    this.oAuthService.initLoginFlow();
  }

  public logout(): void {
    this.oAuthService.logOut();
  }

  private loadUserProfile(): void {
    this.oAuthService.loadUserProfile().then(profile => {
      this._userProfile.set(profile as UserProfile);
    }).catch(error => {
      console.error('Error loading user profile', error);
      this._userProfile.set(null);
    });
  }
}
