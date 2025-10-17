import { Component, effect, inject, OnInit } from '@angular/core';
import { AuthGoogleService } from '../../services/auth-google.service';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent {
  private authService = inject(AuthGoogleService);

  // Signals reactivos
  userProfile = this.authService.userProfile;
  isAuthenticated = this.authService.isAuthenticated;
  isLoading = this.authService.isLoading;

  constructor() {
    // Effect se ejecuta cuando los signals cambian
    // effect(() => {
    //   if (this.isAuthenticated() && this.userProfile()) {
    //   }
    // });
  }
}
