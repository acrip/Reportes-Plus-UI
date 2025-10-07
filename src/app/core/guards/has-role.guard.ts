import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthGoogleService } from '../services/auth-google.service';

// export const hasRoleGuard: CanActivateFn = (route) => {
//   const router = inject(Router);
//   const roles = route.data['roles'] as string[];
//   return inject(AuthGoogleService).currentUser$.pipe(
//     map(user => {
//       if(!user) return false;
//       return user.rol ? roles.includes(user.rol) : router.createUrlTree(['not-found']);
//     })
//   );
// };

export const hasRoleGuard: CanActivateFn = (route) => { return true; };
