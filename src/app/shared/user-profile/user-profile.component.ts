import { Component, computed, effect, inject, OnInit } from '@angular/core';
import {NgOptimizedImage, JsonPipe } from '@angular/common';
import {Router} from '@angular/router';
import { AuthGoogleService } from '../../core/services/auth-google.service';

@Component({
  selector: 'app-user-profile',
  imports: [
    NgOptimizedImage,
    JsonPipe
  ],
  templateUrl: './user-profile.component.html'
})
export class UserProfileComponent implements OnInit {
  authService = inject(AuthGoogleService);
  private router = inject(Router);

  userProfile = this.authService.userProfile;
  isAuthenticated = this.authService.isAuthenticated;

  // 👇 Computed signals para acceso más limpio
  displayName = computed(() => {
    const profile = this.userProfile();
    return (profile?.given_name + ' ' + profile?.family_name) || 'Caremonda';
  });

  displayRole = computed(() => {
    const profile = this.userProfile();
    return profile?.role || profile?.permiso || 'Sin rol asignado';
  });

  displayPicture = computed(() => {
    const profile = this.userProfile();
    return profile?.picture || 'avatar.png';
  });

  ngOnInit(): void {
    console.log('🔁 User profile ngOnInit:', this.userProfile());
  }

  effectUserProfile = effect(() => {
    console.log('🔁 User profile cambió:', this.userProfile());
  });

  isLoading = computed(() =>
    this.authService.isLoading() || !this.authService.isInitialized()
  );

  isOpen = false;

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  logOut(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
