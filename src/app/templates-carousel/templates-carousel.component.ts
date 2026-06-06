import { Component, inject } from '@angular/core';
import { CvBuilderService, TemplateType } from '../cv-builder.service';
import { CvPreviewComponent } from '../cv-preview/cv-preview.component';

@Component({
  selector: 'app-templates-carousel',
  standalone: true,
  templateUrl: './templates-carousel.component.html',
  styleUrl: './templates-carousel.component.css',
  imports: [CvPreviewComponent],
})
export class TemplatesCarouselComponent {
  cvService = inject(CvBuilderService);

  templateNames: TemplateType[] = [
    'minimal', 'modern', 'professional', 'creative', 'corporate', 'tech', 'bold', 'elegant', 'executive', 'fresher', 'designer', 'compact', 'sidebar-dark', 'banner', 'timeline', 'bubble', 'classic-ats', 'startup'
  ];

  templates = [
    { id: 'minimal', name: 'Modern Minimal', category: 'Minimal' },
    { id: 'modern', name: 'Creative Edge', category: 'Creative' },
    { id: 'professional', name: 'Corporate Pro', category: 'Corporate' },
    { id: 'creative', name: 'Design Studio', category: 'Creative' },
    { id: 'corporate', name: 'Executive Suite', category: 'Corporate' },
    { id: 'tech', name: 'Silicon Valley', category: 'Tech' },
    { id: 'bold', name: 'Bold Statement', category: 'Creative' },
    { id: 'elegant', name: 'Elegant Serif', category: 'Minimal' },
    { id: 'executive', name: 'Leadership', category: 'Corporate' },
    { id: 'fresher', name: 'Early Career', category: 'Minimal' },
    { id: 'designer', name: 'Portfolio Plus', category: 'Creative' },
    { id: 'compact', name: 'Dense Info', category: 'Minimal' },
    { id: 'sidebar-dark', name: 'Midnight Pro', category: 'Corporate' },
    { id: 'banner', name: 'Hero Header', category: 'Creative' },
    { id: 'timeline', name: 'History View', category: 'Tech' },
    { id: 'bubble', name: 'Playful UI', category: 'Creative' },
    { id: 'classic-ats', name: 'ATS Scanner', category: 'Corporate' },
    { id: 'startup', name: 'Fast Track', category: 'Tech' }
  ] as const;
}
