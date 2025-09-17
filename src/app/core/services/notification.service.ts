import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  // Por ahora usa consola; luego puedes reemplazar por Angular Material snackbar o toastr.
  info(msg: string) { console.info(msg); }
  success(msg: string) { console.log(msg); }
  warn(msg: string) { console.warn(msg); }
  error(msg: string) { console.error(msg); }
}
