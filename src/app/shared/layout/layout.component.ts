import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, FooterComponent],
  template: `
    <div class="flex h-screen">
      <app-sidebar class="w-1/7 bg-uniblue-950 text-white"></app-sidebar>
      <div class="flex flex-col flex-1">
        <app-header class="h-[70px] bg-white text-blue-900 shadow-md/15 shadow-uniblue-900 z-1"></app-header>
        <main class="flex-1 overflow-y-auto px-16 py-10 bg-white">
          <router-outlet></router-outlet>
        </main>
        <app-footer class="h-12 bg-white text-gray-500"></app-footer>
      </div>
    </div>
  `
})
export class LayoutComponent {}

