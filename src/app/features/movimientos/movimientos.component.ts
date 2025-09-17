import { Component, OnInit } from '@angular/core';
import { MovimientosHeaderComponent } from './movimientos-header/movimientos-header.component';
import { MovimientosTableComponent } from './movimientos-table/movimientos-table.component';
import { Movimiento, MovimientosResponse } from './movimiento.model';
import { MovimientosService } from './movimientos.service';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [MovimientosHeaderComponent, MovimientosTableComponent],
  template: `
<div class="p-4 space-y-4">
      <app-movimientos-header
        [data]="headerData"
        (filtrosChange)="cargarMovimientos($event.vigencia, $event.secuencia)"
      ></app-movimientos-header>

  <app-movimientos-table [data]="movimientos"></app-movimientos-table>
</div>

  `
})
export class MovimientosComponent implements OnInit {
  headerData?: { nombrePosgrado: string; fechaInicio: string; fechaFin: string };
  movimientos: Movimiento[] = [];

  constructor(private movimientosService: MovimientosService) {}

  ngOnInit(): void {
    // inicial con año actual y mes actual
    const now = new Date();
    const vigencia = now.getFullYear();
    const secuencia = (now.getMonth() + 1).toString().padStart(2, '0');
    this.cargarMovimientos(vigencia, secuencia);
  }

    cargarMovimientos(vigencia: number, secuencia: string): void {
    this.movimientosService.getMovimientos(secuencia, vigencia, 1432007).subscribe((res: MovimientosResponse) => {
      this.headerData = {
        nombrePosgrado: res.nombrePosgrado,
        fechaInicio: res.fechaInicio,
        fechaFin: res.fechaFin,
      };
      this.movimientos = res.movimientos;
    });
  }
}
