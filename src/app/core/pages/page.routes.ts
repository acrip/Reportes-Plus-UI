import { Routes } from "@angular/router";
import { hasRoleGuard } from "../guards/has-role.guard";

export default [
    {
    path: 'home',
    canActivate: [hasRoleGuard],
    data: { roles: ['administrador', 'usuario'] },
    loadComponent: () => import('./home/home-page.component').then(p => p.HomePageComponent)
  },
  {
    path: 'posgrado',
    canActivate: [hasRoleGuard],
    data: { roles: ['administrador', 'usuario'] },
    loadComponent: () => import('./movimientos/movimientos.component').then(p => p.MovimientosComponent)
  },
  {
    path: 'admin',
    canActivate: [hasRoleGuard],
    data: { roles: ['administrador'] },
    loadComponent: () => import('./access-control/access-control.component').then(p => p.AccessControlPageComponent)
  },
    {
    path: 'dashboard',
    canActivate: [hasRoleGuard],
    data: { roles: ['administrador', 'usuario'] },
    loadComponent: () => import('./dashboard/dashboard.component').then(p => p.DashboardPageComponent)
  }
]
