import { Component, Input } from '@angular/core';
import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Movimiento } from '../movimiento.model';

@Component({
  selector: 'app-movimientos-table',
  standalone: true,
  imports: [NgFor,NgIf, DatePipe, CurrencyPipe],
  templateUrl: './movimientos-table.component.html',
  styleUrl: './movimientos-table.component.css'
})
export class MovimientosTableComponent {
  @Input() data: Movimiento[] = [];
  selectedMovimiento?: Movimiento;
  modalOpen = false;

  abrirDetalle(movimiento: Movimiento) {
    this.selectedMovimiento = movimiento;
    this.modalOpen = true;
  }

  cerrarModal() {
    this.modalOpen = false;
    this.selectedMovimiento = undefined;
  }
}
