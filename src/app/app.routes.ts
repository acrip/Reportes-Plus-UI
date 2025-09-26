import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { MovimientosComponent } from './features/movimientos/movimientos.component';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
    path: '', component: LayoutComponent,
    children: [
      { path: 'movimientos/:tipo', component: MovimientosComponent },
      { path: '', redirectTo: 'movimientos/todos', pathMatch: 'full' },
      // { path: '**', redirectTo: 'movimientos/todos' }
    ]
  }
];
