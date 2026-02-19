import { Component, input, Input, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Movimiento } from '../../../models/movimiento.model';

@Component({
  selector: 'app-movimientos-table',
  standalone: true,
  imports: [ NgIf],
    // imports: [NgFor,NgIf, DatePipe, CurrencyPipe],
  templateUrl: './movimientos-table.component.html'
})
export class MovimientosTableComponent {

  readonly data = input<Movimiento[]>([]);
  readonly isLoading = input(false);

  // Local state
  readonly selectedMovimiento = signal<Movimiento | undefined>(undefined);
  readonly modalOpen = signal(false);

  abrirDetalle(movimiento: Movimiento): void {
    this.selectedMovimiento.set(movimiento);
    this.modalOpen.set(true);
  }

  cerrarModal(): void {
    this.modalOpen.set(false);
    this.selectedMovimiento.set(undefined);
  }


  // @Input() data: Movimiento[] = [];
  // selectedMovimiento?: Movimiento;
  // modalOpen = false;

  // abrirDetalle(movimiento: Movimiento) {
  //   this.selectedMovimiento = movimiento;
  //   this.modalOpen = true;
  // }

  // cerrarModal() {
  //   this.modalOpen = false;
  //   this.selectedMovimiento = undefined;
  // }
}
