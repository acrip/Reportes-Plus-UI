import { Component, OnInit } from '@angular/core';
import { MovimientosHeaderComponent } from './movimientos-header/movimientos-header.component';
import { MovimientosTableComponent } from './movimientos-table/movimientos-table.component';
import { Movimiento, MovimientosResponse } from './movimiento.model';
import { MovimientosService } from './movimientos.service';
import { saveAs } from 'file-saver';
import { Destino } from '../destinos/destino.model';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [MovimientosHeaderComponent, MovimientosTableComponent],
  template: `
  <div class=" space-y-4">
    <app-movimientos-header
      [data]="headerData"
      [tipo]="tipo"
      (filtrosChange)="cargarMovimientos($event.secuencia, $event.vigencia, $event.destino)"
      (downloadExcel)="exportarExcel()">
    </app-movimientos-header>
    <div class="border m-5 border-gray-200"></div>
    <app-movimientos-table [data]="movimientos"></app-movimientos-table>
</div>
  `
})
export class MovimientosComponent implements OnInit {
  headerData?: { nombrePosgrado: string; fechaInicio: string; fechaFin: string };
  tipo: 'todos' | 'ingresos' | 'egresos' | 'descuentos' = 'todos';
  movimientos: Movimiento[] = [];
  destinos: Destino[] = [];

  constructor(private movimientosService: MovimientosService, private route: ActivatedRoute) { }

//, private destinosService: DestinosService provisional removed

  ngOnInit(): void {
    const now = new Date();
    const secuencia = now.getMonth() + 1;
    const vigencia = now.getFullYear().toString();
    const destinoId = '1432007'; // ID del destino fijo provisional

    this.route.paramMap.subscribe(params => {
      const tipoParam = params.get('tipo') as 'todos' | 'ingresos' | 'egresos' | 'descuentos';
      this.tipo = tipoParam || 'todos';
      this.cargarMovimientos(secuencia, vigencia, destinoId);
    });
    //this.cargarDestinos();
  }

  cargarMovimientos(secuencia: number, vigencia: string, destinoId: string): void {
    this.movimientosService.getMovimientos(secuencia, vigencia, destinoId).subscribe((res: MovimientosResponse) => {
      this.headerData = {
        nombrePosgrado: res.nombrePosgrado,
        fechaInicio: res.fechaInicio,
        fechaFin: res.fechaFin,
      };

      switch (this.tipo) {
        case 'ingresos':
          this.movimientos = res.movimientosIngresos;
          break;
        case 'egresos':
          this.movimientos = res.movimientosEgresos;
          break;
        case 'descuentos':
          this.movimientos = res.movimientosDescuentos;
          break;
        default:
          this.movimientos = res.movimientos;
      }
    });
  }

  // cargarDestinos(): void {
  //   this.destinosService.getDestinos().subscribe((res: Destino[]) => {
  //     this.destinos = res;
  //   });
  // }










































  // Exportar a Excel usando ExcelJS y file-saver


  async exportarExcel(): Promise<void> {
    if (!this.movimientos || this.movimientos.length === 0) {
      console.warn('No hay registros para exportar');
      return;
    }

    // import dinámico para evitar problemas de bundling
    const ExcelJS = (await import('exceljs')).default ?? (await import('exceljs'));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Movimientos');

    // columnas según tu modelo exacto
    worksheet.columns = [
      { header: 'Tipo Documento', key: 'tipoDocumento', width: 16 },
      { header: 'ID Movimiento', key: 'idMovimiento', width: 16 },
      { header: 'Fecha Movimiento', key: 'fechaMovimiento', width: 14 },
      { header: 'Cuenta Movimiento', key: 'cuentaMovimiento', width: 40 },
      { header: 'Observación', key: 'observacion', width: 60 },
      { header: 'ID Tercero', key: 'idTercero', width: 14 },
      { header: 'Tercero', key: 'tercero', width: 30 },
      { header: 'Valor Movimiento', key: 'valorMovimiento', width: 18 }
    ];

    // Agregar filas (manteniendo el orden de columns)
    this.movimientos.forEach((m: Movimiento) => {
      worksheet.addRow({
        tipoDocumento: m.tipoDocumento,
        idMovimiento: m.idMovimiento,
        fechaMovimiento: m.fechaMovimiento,
        cuentaMovimiento: m.cuentaMovimiento,
        observacion: m.observacion,
        idTercero: m.idTercero,
        tercero: m.tercero,
        valorMovimiento: m.valorMovimiento
      });
    });

    // Formato numérico para la columna de valor
    try {
      const colValor = worksheet.getColumn('valorMovimiento');
      colValor.numFmt = '#,##0';
    } catch (e) {
      // si algo falla aquí, no bloqueamos la descarga
      console.warn('No se pudo aplicar formato numérico:', e);
    }

    // Estilo header
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.eachCell((cell: any) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFEFEFEF' }
      };
    });

    // Generar buffer y disparar descarga
    const buffer: ArrayBuffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    saveAs(blob, `movimientos_${ts}.xlsx`);
  }




}
