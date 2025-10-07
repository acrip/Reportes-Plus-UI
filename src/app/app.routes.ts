import { Routes } from '@angular/router';
import { LoginPageComponent } from './core/pages/login/login-page.component';
import { authGuard } from './core/guards/auth.guard';
import { NotFoundPageComponent } from './core/pages/not-found/not-found.component';
import { hasRoleGuard } from './core/guards/has-role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'not-found', component: NotFoundPageComponent},
  {
    canMatch: [authGuard],
    path: '',
    loadComponent: () => import('./shared/layout/layout.component').then(p => p.LayoutComponent),
    loadChildren: () => import('./core/pages/page.routes')
  }
];
