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

  // Verifica la autenticación una vez que el servicio está inicializado
  if (authService.isAuthenticated()) {
    console.log('Guard: User is authenticated. Access granted.');
    return true;
  }

  console.warn('Guard: User is NOT authenticated. Redirecting to /login.');
  return router.createUrlTree(['/login']);
};
