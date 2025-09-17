import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { MovimientosResponse } from './movimiento.model';

@Injectable({ providedIn: 'root' })
export class MovimientosService {
  private api = inject(ApiService);

  getMovimientos(secuencia: string, vigencia: number, destino: number): Observable<MovimientosResponse> {
    return this.api.get<MovimientosResponse>('movimientos', { secuencia, vigencia, destino });
  }
}
