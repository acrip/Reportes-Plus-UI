import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthGoogleService } from '../core/services/auth-google.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Reportes-Plus-UI';
  // TODO: OPTIMIZAR
  constructor(private authGoogleService: AuthGoogleService){
  }

  ngOnInit(): void {
  }
}
