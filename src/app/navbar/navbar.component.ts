import { Component, inject } from '@angular/core';
import { CvBuilderService } from '../cv-builder.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  cvService = inject(CvBuilderService);
  private router = inject(Router);

  openResumeBuilder() {
    this.router.navigate(['/cover-letter']);
  }

  openResumeTemplates() {
    this.cvService.openResumeTemplates();
  }
}

  }

openResumeTemplates() {
  this.cvService.openResumeTemplates();
}
}


