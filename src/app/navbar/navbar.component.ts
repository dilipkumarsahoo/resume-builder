import { Component, inject } from '@angular/core';
import { CvBuilderService } from '../cv-builder.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  cvService = inject(CvBuilderService);
}
