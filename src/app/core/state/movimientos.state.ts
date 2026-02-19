import { computed, inject, Injectable, signal } from '@angular/core';
import { MovimientosService } from '../services/movimientos.service';
import { AuthGoogleService } from '../services/auth-google.service';
import { Movimiento, MovimientosHeaderData, MovimientosParameters, MovimientosResponse } from '../models/movimiento.model';
import { catchError, finalize, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class MovimientosState {
  private readonly movimientosService = inject(MovimientosService);
  private readonly authService = inject(AuthGoogleService);

  // State
  private readonly _response = signal<MovimientosResponse | null>(null);
  private readonly _filters = signal<MovimientosParameters>(this.getDefaultParameters());
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);

  // Selectors
  readonly response = this._response.asReadonly();
  readonly filters = this._filters.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly headerData = computed<MovimientosHeaderData | null>(() => {
    const res = this._response();
    if (!res) return null;
    return {
      nombrePosgrado: res.nombrePosgrado,
      fechaInicio: res.fechaInicio,
      fechaFin: res.fechaFin
    };
  });

  readonly movimientos = computed(() => this._response()?.movimientos || []);
  readonly movimientosIngresos = computed(() => this._response()?.movimientosIngresos || []);
  readonly movimientosEgresos = computed(() => this._response()?.movimientosEgresos || []);
  readonly movimientosDescuentos = computed(() => this._response()?.movimientosDescuentos || []);

  // Computed para obtener movimientos según tipo
  getMovimientosByTipo(tipo: 'todos' | 'ingresos' | 'egresos' | 'descuentos'): Movimiento[] {
    switch (tipo) {
      case 'ingresos':
        return this.movimientosIngresos();
      case 'egresos':
        return this.movimientosEgresos();
      case 'descuentos':
        return this.movimientosDescuentos();
      default:
        return this.movimientos();
    }
  }

  private getDefaultParameters(): MovimientosParameters {
    const now = new Date();
    const userProfile = this.authService.userProfile();

    return {
      secuencia: now.getMonth() + 1,
      vigencia: now.getFullYear().toString(),
      destino: userProfile?.permiso || ''
    };
  }

  loadMovimientos(filters?: Partial<MovimientosParameters>): void {
    if (filters) {
      this._filters.update(current => ({ ...current, ...filters }));
    }

    const { secuencia, vigencia, destino } = this._filters();

    if (!destino) {
      this._error.set('No se ha configurado un destino válido');
      return;
    }

    this._isLoading.set(true);
    this._error.set(null);

    this.movimientosService
      .getMovimientos(secuencia, vigencia, destino)
      .pipe(
        tap(response => this._response.set(response)),
        catchError(error => {
          this._error.set('Error al cargar los movimientos');
          console.error('Error cargando movimientos:', error);
          return of(null);
        }),
        finalize(() => this._isLoading.set(false)),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  exportarExcel(): void {
    const { secuencia, vigencia, destino } = this._filters();

    if (!destino) {
      console.error('No se puede exportar sin un destino válido');
      return;
    }

    this.movimientosService
      .exportarExcel(secuencia, vigencia, destino)
      .pipe(
        tap(blob => {
          const fileName = `movimientos_${vigencia}_${secuencia}.xlsx`;
          import('file-saver').then(({ saveAs }) => saveAs(blob, fileName));
        }),
        catchError(error => {
          console.error('Error exportando Excel:', error);
          return of(null);
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  updateParameters(filters: Partial<MovimientosParameters>): void {
    this.loadMovimientos(filters);
  }
}
