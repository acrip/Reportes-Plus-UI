import { Component, inject, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent implements OnInit {
  private oAuthService = inject(OAuthService);

  ngOnInit(): void {
    console.log('Access token: ' + this.oAuthService.getAccessToken());
    console.log('Identity claims: ', this.oAuthService.getIdentityClaims());
  }
}
