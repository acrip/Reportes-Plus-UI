import {Component, inject, OnInit} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';
import {UserProfile, UserInfo} from '../../core/models/user-profile.model';
import {NgOptimizedImage} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-profile',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  private authService = inject(OAuthService);
  private router = inject(Router);

  userProfile!: UserProfile;
  isAuthenticated = false;
  isOpen = false;

  ngOnInit(): void {
    this.authService.loadUserProfile()
      .then((obj: object) => {
        this.userProfile = (obj as UserInfo).info
        this.isAuthenticated = true;
      })
      .catch((err => {
        this.isAuthenticated = false;
        console.error("Got error loading user profile:", err)
      }));
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  logOut() {
    this.authService.logOut()
    this.router.navigate(['/login']);
  }
}
