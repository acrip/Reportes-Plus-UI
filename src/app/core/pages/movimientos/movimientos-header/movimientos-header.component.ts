import { NgForOf, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DestinosService } from '../../../services/destinos.service';
import { Destino } from '../../../models/destino.model';
import { getYears } from '../../../../utils/date.util';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-movimientos-header',
  standalone: true,
  imports: [NgIf, NgForOf, FormsModule],
  templateUrl: './movimientos-header.component.html',
})
export class MovimientosHeaderComponent {

  @Input() data?: { nombrePosgrado: string; fechaInicio: string; fechaFin: string };
  @Input() tipo: 'todos' | 'ingresos' | 'egresos' | 'descuentos' = 'todos';
  @Output() filtrosChange = new EventEmitter<{secuencia: number; vigencia: string; destino: string}>();
  @Output() downloadExcel = new EventEmitter<void>();

  vigencias: number[] = [];
  destinos: Destino[] = [];
  meses= environment.MONTHS;
  destino = '';
  secuencia: number = 1;

  filtroBusqueda: string = '';

  vigencia = new Date().getFullYear().toString();

  constructor(private destinosService: DestinosService) {}

  ngOnInit(): void {
    this.vigencias = getYears()
    console.log('Años disponibles:', this.vigencias);
    this.destinosService.getDestinos().subscribe((res) => { this.destinos = res; });
    console.log('Destinos disponibles:', this.destinos);
    this.secuencia = (new Date().getMonth() + 1);
    console.log('Mes actual (secuencia):', this.secuencia);
  }

  onFiltersChange() {
    this.filtrosChange.emit({ secuencia: this.secuencia, vigencia: this.vigencia, destino: this.destino });
  }

  onDownloadClick() {
    this.downloadExcel.emit();
  }
}
