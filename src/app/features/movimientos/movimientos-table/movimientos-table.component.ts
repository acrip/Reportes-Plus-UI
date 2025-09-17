import { Component, Input } from '@angular/core';
import { CurrencyPipe, DatePipe, NgFor } from '@angular/common';
import { Movimiento } from '../movimiento.model';

@Component({
  selector: 'app-movimientos-table',
  standalone: true,
  imports: [NgFor, DatePipe, CurrencyPipe],
  templateUrl: './movimientos-table.component.html',
  styleUrl: './movimientos-table.component.css'
})
export class MovimientosTableComponent {
  @Input() data: Movimiento[] = [];

}
