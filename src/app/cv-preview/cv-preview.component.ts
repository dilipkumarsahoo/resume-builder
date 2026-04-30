import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvBuilderService } from '../cv-builder.service';

@Component({
  selector: 'app-cv-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cv-preview.component.html',
  styleUrl: './cv-preview.component.css'
})
export class CvPreviewComponent {
  cvService = inject(CvBuilderService);
  data = this.cvService.cvData;
  template = this.cvService.selectedTemplate;

  templateClass() {
    return `${this.template()}-template`;
  }
}
