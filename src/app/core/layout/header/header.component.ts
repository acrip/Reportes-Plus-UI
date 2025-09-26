import { Component } from '@angular/core';
import { UserProfileComponent } from "../../../shared/user-profile/user-profile.component";
import { AuthGoogleService } from '../../../features/auth/auth-google.service';
import { NgIf } from "@angular/common";
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [UserProfileComponent, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  userPanelOpen = false;

  constructor( private authGoogleService: AuthGoogleService, private router: Router ){}

  toggleDropdown() {
    this.userPanelOpen = !this.userPanelOpen;
  }

  ngOnInit(): void {
    const profile = this.authGoogleService.getProfile();
    //this.name = profile.name;
    //this.picture = this.sanitizer.bypassSecurityTrustUrl(profile.picture);
  }
    logOut() {
    this.authGoogleService.logout();
    this.router.navigate(['login']);
  }
}
