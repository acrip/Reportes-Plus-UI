import { Component, computed, inject } from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {Router} from '@angular/router';
import { AuthGoogleService } from '../../core/services/auth-google.service';

@Component({
  selector: 'app-user-profile',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  private authService = inject(AuthGoogleService);
  private router = inject(Router);

  // Usar signals directamente - reactivos y síncronos
  userProfile = this.authService.userProfile;
  isAuthenticated = this.authService.isAuthenticated;
  isLoading = this.authService.isLoading;

  // Signal computado para mostrar información del usuario
  displayName = computed(() => {
    const profile = this.userProfile();
    return profile?.name || 'Usuario';
  });

  isOpen = false;

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  logOut(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
