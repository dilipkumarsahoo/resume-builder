import { Component, inject, ElementRef, ViewChild, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { CvBuilderService, TemplateType } from '../cv-builder.service';
import { AuthService } from '../services/auth.service';
import { CvFormComponent } from '../cv-form/cv-form.component';
import { CvPreviewComponent } from '../cv-preview/cv-preview.component';
import { animate } from 'motion';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-cv-builder-modal',
  standalone: true,
  imports: [CommonModule, CvFormComponent, CvPreviewComponent],
  templateUrl: './cv-builder-modal.component.html',
  styleUrl: './cv-builder-modal.component.css'
})
export class CvBuilderModalComponent {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private authService = inject(AuthService);
  cvService = inject(CvBuilderService);
  template = this.cvService.selectedTemplate;
  isDownloading = false;

  @ViewChild('modalContent') modalContent?: ElementRef;

  setTemplate(t: TemplateType) {
    this.cvService.selectedTemplate.set(t);
  }

  close() {
    this.router.navigate(['/dashboard']);
  }

  async downloadPDF() {
    if (!isPlatformBrowser(this.platformId)) return;

    // Check user login
    if (!this.authService.getToken()) {
      this.router.navigate(['/login']);
      return;
    }

    this.isDownloading = true;
    try {
      const element = document.getElementById('cv-preview-content');
      if (!element) return;

      const imgData = await htmlToImage.toPng(element, {
        quality: 1,
        pixelRatio: 2
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${this.cvService.cvData().fullName.replace(/\s+/g, '_')}_CV.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
    } finally {
      this.isDownloading = false;
    }
  }
}
