import { Component } from '@angular/core';
import { AuthGoogleService } from '../auth-google.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private authGoogleService: AuthGoogleService) { }

  login() {
    this.authGoogleService.login();
  }

  // async saveUser() {
  //   if (this.authGoogleService.isLoggedIn()) {
  //     const resp = await this.authGoogleService.getUsuarioDestinos();
  //     console.log('Respuesta backend:', resp);
  //   }
  // }

}
