import { NgForOf, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movimientos-header',
  imports: [NgIf, NgForOf, FormsModule],
  templateUrl: './movimientos-header.component.html',
  styleUrl: './movimientos-header.component.css'
})
export class MovimientosHeaderComponent {
  @Input() data?: { nombrePosgrado: string; fechaInicio: string; fechaFin: string };
  @Output() filtrosChange = new EventEmitter<{ vigencia: number; secuencia: string }>();
  @Output() downloadExcel = new EventEmitter<void>();

  vigencias: number[] = [2023, 2024, 2025]; // podrías cargarlos dinámicamente
  meses = [
    { value: '01', label: 'Enero' },
    { value: '02', label: 'Febrero' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Mayo' },
    { value: '06', label: 'Junio' },
    { value: '07', label: 'Julio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' }
  ];

  vigencia = new Date().getFullYear();
  secuencia = (new Date().getMonth() + 1).toString().padStart(2, '0');

  onFiltersChange() {
    this.filtrosChange.emit({ vigencia: this.vigencia, secuencia: this.secuencia });
  }

  onDownloadClick() {
    this.downloadExcel.emit();
  }
}
