import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { MovimientosResponse } from '../../models/movimiento.model';

@Injectable({ providedIn: 'root' })
export class MovimientosService {
  private api = inject(ApiService);

  getMovimientos(secuencia: number, vigencia: string, destino: string): Observable<MovimientosResponse> {
    return this.api.get<MovimientosResponse>('movimientos', { secuencia, vigencia, destino });
    //return this.api.get<MovimientosResponse>('movimientos');
  }
}
