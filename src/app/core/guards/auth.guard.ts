import { inject } from '@angular/core';
import { CanMatchFn, GuardResult, Router, UrlTree } from '@angular/router';
import { AuthGoogleService } from '../services/auth-google.service';
import { filter, firstValueFrom, map, take } from 'rxjs';

export const authGuard: CanMatchFn = async (): Promise<GuardResult> => {
  const router = inject(Router);
  const authService = inject(AuthGoogleService);

  // Espera a que la inicialización se complete
  await firstValueFrom(
    authService.isInitializationComplete$.pipe(
      filter(isComplete => isComplete),
      take(1)
    )
  );

  if (authService.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
