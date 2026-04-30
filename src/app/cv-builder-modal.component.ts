import { Component, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvBuilderService } from './cv-builder.service';
import { CvFormComponent } from './cv-form.component';
import { CvPreviewComponent } from './cv-preview.component';
import { animate } from 'motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-cv-builder-modal',
  standalone: true,
  imports: [CommonModule, CvFormComponent, CvPreviewComponent],
  template: `
    @if (cvService.isModalOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 md:p-6 lg:p-8">
        <div #modalContent class="w-full h-full max-w-[1400px] bg-bg-light rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-modal-enter">
          
          <!-- Header -->
          <div class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold">CV</div>
              <span class="font-semibold text-text-main">Builder</span>
            </div>
            
            <div class="flex items-center gap-4">
              <div class="flex bg-gray-100 p-1 rounded-lg">
                <button (click)="setTemplate('minimal')" [ngClass]="{'bg-white shadow-sm text-text-main': template() === 'minimal', 'text-gray-500 hover:text-gray-700': template() !== 'minimal'}" class="px-3 py-1.5 text-sm font-medium rounded-md transition-all">Minimal</button>
                <button (click)="setTemplate('modern')" [ngClass]="{'bg-white shadow-sm text-text-main': template() === 'modern', 'text-gray-500 hover:text-gray-700': template() !== 'modern'}" class="px-3 py-1.5 text-sm font-medium rounded-md transition-all">Modern</button>
                <button (click)="setTemplate('professional')" [ngClass]="{'bg-white shadow-sm text-text-main': template() === 'professional', 'text-gray-500 hover:text-gray-700': template() !== 'professional'}" class="px-3 py-1.5 text-sm font-medium rounded-md transition-all">Professional</button>
              </div>
              
              <button (click)="downloadPDF()" [disabled]="isDownloading" class="bg-text-main text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-70">
                @if (isDownloading) {
                  <span class="material-icons text-sm animate-spin">refresh</span> Exporting...
                } @else {
                  <span class="material-icons text-sm">download</span> Download PDF
                }
              </button>
              
              <button (click)="close()" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors ml-2">
                <span class="material-icons text-sm">close</span>
              </button>
            </div>
          </div>

          <!-- Body Split Screen -->
          <div class="flex-1 flex overflow-hidden">
            <!-- Left: Form -->
            <div class="w-full md:w-[45%] lg:w-[40%] border-r border-gray-200 bg-white z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
              <app-cv-form></app-cv-form>
            </div>
            
            <!-- Right: Preview -->
            <div class="hidden md:flex flex-1 bg-gray-100/50 p-8 overflow-y-auto items-start justify-center no-scrollbar">
              <!-- A4 Aspect Ratio Container -->
              <div class="w-full max-w-[800px] aspect-[1/1.414] shadow-xl rounded-sm overflow-hidden transition-all duration-300 hover:shadow-2xl">
                <app-cv-preview></app-cv-preview>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    }
  `
})
export class CvBuilderModalComponent {
  cvService = inject(CvBuilderService);
  template = this.cvService.selectedTemplate;
  isDownloading = false;

  @ViewChild('modalContent') modalContent?: ElementRef;

  setTemplate(t: 'minimal' | 'modern' | 'professional') {
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
