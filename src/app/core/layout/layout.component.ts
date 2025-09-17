import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, FooterComponent],
  template: `
    <div class="flex h-screen">
      <!-- Sidebar -->
      <app-sidebar class="w-1/6 bg-blue-600 text-white"></app-sidebar>

      <!-- Main content -->
      <div class="flex flex-col flex-1">
        <app-header class="h-16 bg-purple-600 text-white"></app-header>

        <main class="flex-1 overflow-y-auto p-4 bg-gray-100">
          <router-outlet></router-outlet>
        </main>

        <app-footer class="h-12 bg-orange-600 text-white"></app-footer>
      </div>
    </div>
  `
})
export class LayoutComponent {}
