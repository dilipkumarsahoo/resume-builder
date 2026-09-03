import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CvBuilderService } from '../cv-builder.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  cvService = inject(CvBuilderService);
  private router = inject(Router);

  startBuilding() {
    this.router.navigate(['/cover-letter'], { queryParams: { tab: 'resume' } });
  }
}
