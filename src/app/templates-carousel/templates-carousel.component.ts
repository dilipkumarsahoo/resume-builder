import { Component, inject } from '@angular/core';
import { CvBuilderService, TemplateType } from '../cv-builder.service';

@Component({
  selector: 'app-templates-carousel',
  standalone: true,
  templateUrl: './templates-carousel.component.html',
  styleUrl: './templates-carousel.component.css'
})
export class TemplatesCarouselComponent {
  cvService = inject(CvBuilderService);

  templateNames: TemplateType[] = [
    'minimal', 'modern', 'professional', 'creative', 'corporate', 'tech', 'bold', 'elegant', 'executive', 'fresher', 'designer', 'compact', 'sidebar-dark', 'banner', 'timeline', 'bubble', 'classic-ats', 'startup'
  ];
}
