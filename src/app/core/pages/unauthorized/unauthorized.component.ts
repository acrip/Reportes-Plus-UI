import { Component, inject } from '@angular/core';
import { AuthGoogleService } from '../../services/auth-google.service';

@Component({
  selector: 'app-unauthorized',
  imports: [],
  templateUrl: './unauthorized.component.html'
})
export class UnauthorizedPageComponent {
  protected authService = inject(AuthGoogleService);
}
