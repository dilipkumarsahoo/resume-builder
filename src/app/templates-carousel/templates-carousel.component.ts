import { Component, inject } from '@angular/core';
import { CvBuilderService } from '../cv-builder.service';

@Component({
  selector: 'app-templates-carousel',
  standalone: true,
  templateUrl: './templates-carousel.component.html',
  styleUrl: './templates-carousel.component.css'
})
export class TemplatesCarouselComponent {
  cvService = inject(CvBuilderService);

  openTemplate(index: number) {
    const templates: ('minimal' | 'modern' | 'professional')[] = ['minimal', 'modern', 'professional'];
    const template = templates[index % 3];
    this.cvService.openModal(template);
  }
}
