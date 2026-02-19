import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { MovimientosResponse } from '../models/movimiento.model';

@Injectable({ providedIn: 'root' })
export class MovimientosService {
  private readonly apiService = inject(ApiService);

  getMovimientos(secuencia: number, vigencia: string, destino: string): Observable<MovimientosResponse> {
    return this.apiService.get<MovimientosResponse>(
      `movimientos?secuencia=${secuencia}&vigencia=${vigencia}&destino=${destino}`
    );
  }

  exportarExcel(secuencia: number, vigencia: string, destino: string): Observable<Blob> {
    return this.apiService.get<Blob>(
      `movimientos/excel?secuencia=${secuencia}&vigencia=${vigencia}&destino=${destino}`,
      { responseType: 'blob' as 'json' }
    );
  }
}
