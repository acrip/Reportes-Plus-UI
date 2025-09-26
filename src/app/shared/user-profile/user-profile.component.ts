import { Component, ElementRef, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  @Input() nombre!: string;
  @Input() rol!: string;
  @Input() avatarUrl!: string;

  isOpen = false;
}
