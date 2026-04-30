import { Component, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvBuilderService, TemplateType } from '../cv-builder.service';
import { CvFormComponent } from '../cv-form/cv-form.component';
import { CvPreviewComponent } from '../cv-preview/cv-preview.component';
import { animate } from 'motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-cv-builder-modal',
  standalone: true,
  imports: [CommonModule, CvFormComponent, CvPreviewComponent],
  templateUrl: './cv-builder-modal.component.html',
  styleUrl: './cv-builder-modal.component.css'
})
export class CvBuilderModalComponent {
  cvService = inject(CvBuilderService);
  template = this.cvService.selectedTemplate;
  isDownloading = false;

  @ViewChild('modalContent') modalContent?: ElementRef;

  setTemplate(t: TemplateType) {
    this.cvService.selectedTemplate.set(t);
  }

  close() {
    if (this.modalContent) {
      animate(this.modalContent.nativeElement, { opacity: [1, 0], scale: [1, 0.95] }, { duration: 0.2 }).finished.then(() => {
        this.cvService.closeModal();
      });
    } else {
      this.cvService.closeModal();
    }
  }

  async downloadPDF() {
    this.isDownloading = true;
    try {
      const element = document.getElementById('cv-preview-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${this.cvService.cvData().fullName.replace(/\s+/g, '_')}_CV.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
    } finally {
      this.isDownloading = false;
    }
  }
}
