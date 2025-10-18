import { NgForOf, NgIf } from '@angular/common';
import { Component, computed, effect, EventEmitter, inject, input, Input, output, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DestinosService } from '../../../services/destinos.service';
import { Destino } from '../../../models/destino.model';
import { getYears } from '../../../../utils/date.util';
import { environment } from '../../../../../environments/environment';
import { AuthGoogleService } from '../../../services/auth-google.service';

@Component({
  selector: 'app-movimientos-header',
  standalone: true,
  imports: [FormsModule],
    // imports: [NgForOf, FormsModule],
  templateUrl: './movimientos-header.component.html',
})
export class MovimientosHeaderComponent {
    private readonly destinosService = inject(DestinosService);
  private readonly authService = inject(AuthGoogleService);

  readonly data = input<{ nombrePosgrado: string; fechaInicio: string; fechaFin: string } | null>();
  readonly tipo = input<'todos' | 'ingresos' | 'egresos' | 'descuentos'>('todos');
  readonly isLoading = input(false);

  readonly filtrosChange = output<{ secuencia: number; vigencia: string; destino: string }>();
  readonly downloadExcel = output<void>();

  readonly vigencias = signal<number[]>([]);
  readonly destinos = signal<Destino[]>([]);
  readonly meses = signal(environment.MONTHS);

  readonly secuencia = signal(new Date().getMonth() + 1);
  readonly vigencia = signal(new Date().getFullYear().toString());
  readonly destino = signal('');
  readonly filtroBusqueda = signal('');

  readonly destinosFiltrados = computed(() => {
    const busqueda = this.filtroBusqueda().toLowerCase();
    if (!busqueda) return this.destinos();

    return this.destinos().filter(d =>
      d.codigo?.toLowerCase().includes(busqueda) ||
      d.estado?.toString().includes(busqueda)
    );
  });

  readonly canExport = computed(() =>
    !this.isLoading() && this.data() !== null
  );

  constructor() {
    // Effect para sincronizar destino con el permiso del usuario
    effect(() => {
      const userProfile = this.authService.userProfile();
      if (userProfile?.permiso && !this.destino()) {
        this.destino.set(userProfile.permiso);
      }
    });
  }

  ngOnInit(): void {
    this.vigencias.set(getYears());

    this.destinosService.getDestinos().subscribe({
      next: (destinos) => {
        this.destinos.set(destinos);

        // Si el usuario tiene permiso y el destino aún no está establecido
        const userProfile = this.authService.userProfile();
        if (userProfile?.permiso && !this.destino()) {
          this.destino.set(userProfile.permiso);
        }
      },
      error: (error) => {
        console.error('Error cargando destinos:', error);
      }
    });
  }

  onSecuenciaChange(value: string): void {
    this.secuencia.set(Number(value));
    this.emitFilters();
  }

  onVigenciaChange(value: string): void {
    this.vigencia.set(value);
    this.emitFilters();
  }

  onDestinoChange(value: string): void {
    this.destino.set(value);
    this.emitFilters();
  }

  onFiltroBusquedaChange(value: string): void {
    this.filtroBusqueda.set(value);
  }

  private emitFilters(): void {
    this.filtrosChange.emit({
      secuencia: this.secuencia(),
      vigencia: this.vigencia(),
      destino: this.destino()
    });
  }

  onDownloadClick(): void {
    if (this.canExport()) {
      this.downloadExcel.emit();
    }
  }













//   @Input() data?: { nombrePosgrado: string; fechaInicio: string; fechaFin: string };
//   @Input() tipo: 'todos' | 'ingresos' | 'egresos' | 'descuentos' = 'todos';
//   @Output() filtrosChange = new EventEmitter<{secuencia: number; vigencia: string; destino: string}>();
//   @Output() downloadExcel = new EventEmitter<void>();

//   vigencias: number[] = [];
//   destinos: Destino[] = [];
//   meses= environment.MONTHS;
//   destino = '';
//   secuencia: number = 1;

//   filtroBusqueda: string = '';

//   vigencia = new Date().getFullYear().toString();

//   constructor(private destinosService: DestinosService) {}

//   ngOnInit(): void {
//     this.vigencias = getYears()
//     console.log('Años disponibles:', this.vigencias);
//     this.destinosService.getDestinos().subscribe((res) => { this.destinos = res; });
//     console.log('Destinos disponibles:', this.destinos);
//     this.secuencia = (new Date().getMonth() + 1);
//     console.log('Mes actual (secuencia):', this.secuencia);
//   }

//   onFiltersChange() {
//     this.filtrosChange.emit({ secuencia: this.secuencia, vigencia: this.vigencia, destino: this.destino });
//   }

//   onDownloadClick() {
//     this.downloadExcel.emit();
//   }
// }
}
