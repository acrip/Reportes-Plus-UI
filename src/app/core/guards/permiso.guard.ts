import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGoogleService } from '../services/auth-google.service';

export const permisoGuard = () => {
  const AuthService = inject(AuthGoogleService);
  const router = inject(Router);

  const profile = AuthService.userProfile();

  if (profile?.permiso) {
    return true;
  }

  router.navigate(['/unauthorized'], {skipLocationChange: true, replaceUrl: true});
  return false;
};
