import { Component } from '@angular/core';
import { AuthGoogleService } from '../../services/auth-google.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent {
  constructor(private authGoogleService: AuthGoogleService) { }

  signInWithGoogle() {
    this.authGoogleService.login();
  }
}
