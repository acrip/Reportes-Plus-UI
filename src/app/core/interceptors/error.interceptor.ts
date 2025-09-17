import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, retry } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notifier = inject(NotificationService);

  return next(req).pipe(
    // Reintenta una vez problemas transitorios (time-out, 5xx)
    retry({ count: 1 }),
    catchError((error: HttpErrorResponse) => {
      let message = 'Error inesperado. Intenta de nuevo.';

      if (error.status === 0) {
        message = 'No hay conexión con el servidor (CORS, red o servidor caído).';
      } else if (error.status >= 500) {
        message = 'Error del servidor. Nuestro equipo ya fue notificado.';
      } else if (error.status === 401) {
        message = 'Sesión expirada o no autorizada.';
        // Ejemplo: redirigir al login
        // router.navigate(['/login']);
      } else if (error.status === 403) {
        message = 'No tienes permisos para esta acción.';
      } else if (error.status === 404) {
        message = 'Recurso no encontrado.';
      } else if (error.error && typeof error.error === 'string') {
        message = error.error;
      }

      notifier.error(message);
      // Mantén el error para que los componentes puedan decidir si lo manejan
      return throwError(() => error);
    })
  );
};
