import { effect, inject } from '@angular/core';
import { CanMatchFn, GuardResult, Router, UrlTree } from '@angular/router';
import { AuthGoogleService } from '../services/auth-google.service';
import { filter, firstValueFrom, map, take } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

export const authGuard: CanMatchFn = async (): Promise<GuardResult> => {
  const router = inject(Router);
  const authService = inject(AuthGoogleService);

  await firstValueFrom(
    toObservable(authService.isInitialized).pipe(
      filter(isInitialized => isInitialized)
    )
  );

  if (authService.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
