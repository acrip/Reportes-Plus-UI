import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { MovimientosComponent } from './features/movimientos/movimientos.component';

export const routes: Routes = [
    {
    path: '', component: LayoutComponent,
    children: [
      { path: 'movimientos', component: MovimientosComponent },
      { path: '', redirectTo: 'movimientos', pathMatch: 'full' }
    ]
  }
];
