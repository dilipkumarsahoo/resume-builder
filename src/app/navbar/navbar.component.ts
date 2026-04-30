import { Component, inject } from '@angular/core';
import { CvBuilderService } from '../cv-builder.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  cvService = inject(CvBuilderService);
}
