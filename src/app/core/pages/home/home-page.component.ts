import { Component, inject, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent implements OnInit {
  private oAuthService = inject(OAuthService);
  private httpClient = inject(HttpClient);

  ngOnInit(): void {
    console.log('Access token: ' + this.oAuthService.getAccessToken());
    console.log('Identity claims: ', this.oAuthService.getIdentityClaims());
    this.httpClient.get("https://localhost:8080/api/test/protected").subscribe({
      next: (data) => console.log("Protected data: ", data),
      error: (error) => console.error("Error fetching protected data: ", error)
    });
  }
}
