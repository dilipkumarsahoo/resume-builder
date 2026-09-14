import { Component, inject, ElementRef, ViewChild, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { CvBuilderService, TemplateType } from '../cv-builder.service';
import { AuthService } from '../services/auth.service';
import { CvFormComponent } from '../cv-form/cv-form.component';
import { CvPreviewComponent } from '../cv-preview/cv-preview.component';
import { CvCustomizeComponent } from '../cv-customize/cv-customize.component';
import { animate } from 'motion';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-cv-builder-modal',
  standalone: true,
  imports: [CommonModule, CvFormComponent, CvPreviewComponent, CvCustomizeComponent],
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
  activeTab = signal<'overview' | 'content' | 'customize' | 'ai-tools'>('content');
  showOptionsMenu = signal(false);

  @ViewChild('modalContent') modalContent?: ElementRef;

  setActiveTab(tab: 'overview' | 'content' | 'customize' | 'ai-tools') {
    if (tab === 'overview') {
      this.router.navigate(['/cover-letter'], { queryParams: { tab: 'resume' } });
      return;
    }
    this.activeTab.set(tab);
  }

  setTemplate(t: TemplateType) {
    this.cvService.selectedTemplate.set(t);
  }

  close() {
    this.router.navigate(['/cover-letter'], { queryParams: { tab: 'resume' } });
  }

  logout() {
    this.showOptionsMenu.set(false);
    this.authService.logout();
    this.router.navigate(['/login']);
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
      // Find the active main resume preview canvas
      const element = document.getElementById('cv-preview-content') || document.querySelector('.cv-preview-content:not(.is-preview)') as HTMLElement;
      if (!element) {
        console.error('Resume preview canvas element not found');
        return;
      }

      // Small delay to ensure all dynamic fonts/CSS variables are rendered
      await new Promise(r => setTimeout(r, 100));

      const imgData = await htmlToImage.toPng(element as HTMLElement, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });

      const isLetter = this.cvService.customization().pageFormat === 'US Letter';
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: isLetter ? 'letter' : 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();

      // Determine the actual content bottom to avoid generating blank pages for trailing container whitespace
      const elementRect = element.getBoundingClientRect();
      let maxContentBottom = 0;
      const contentNodes = element.querySelectorAll('div[data-section], h1, h2, h3, p, ul, span, .space-y-4, .space-y-6');
      contentNodes.forEach(node => {
        const rect = node.getBoundingClientRect();
        if (rect.bottom > maxContentBottom && (rect.width > 0 || rect.height > 0)) {
          maxContentBottom = rect.bottom;
        }
      });

      // Calculate the real content height in mm
      const actualContentPx = maxContentBottom > elementRect.top
        ? (maxContentBottom - elementRect.top)
        : element.offsetHeight;
      const contentPdfHeight = (actualContentPx * pdfWidth) / element.offsetWidth;
      const totalPdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;

      // If the actual content comfortably fits on 1 page (within page height + small 10mm margin), strictly output 1 page
      if (contentPdfHeight <= pdfPageHeight + 10) {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, Math.min(totalPdfHeight, pdfPageHeight), undefined, 'FAST');
      } else {
        // Multi-page content
        let heightLeft = contentPdfHeight;
        let position = 0;

        // Add Page 1
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalPdfHeight, undefined, 'FAST');
        heightLeft -= pdfPageHeight;

        // Add subsequent pages only if substantial real content overflows (> 20mm)
        while (heightLeft > 20) {
          position -= pdfPageHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalPdfHeight, undefined, 'FAST');
          heightLeft -= pdfPageHeight;
        }
      }

      const fileName = (this.cvService.cvData().fullName || 'My_Resume').trim().replace(/\s+/g, '_');
      pdf.save(`${fileName}_CV.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
    } finally {
      this.isDownloading = false;
    }
  }

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
