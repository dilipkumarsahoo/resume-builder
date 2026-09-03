import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CvBuilderService } from '../cv-builder.service';
import { jsPDF } from 'jspdf';

export type CoverLetterTemplate = 'minimal' | 'modern' | 'elegant' | 'creative' | 'executive' | 'tech';

export interface TemplateItem {
  id: CoverLetterTemplate;
  name: string;
  category: 'Simple' | 'Modern' | 'Creative' | 'Elegant' | 'Executive';
  desc: string;
  badge?: string;
}

@Component({
  selector: 'app-cover-letter',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cover-letter.component.html',
  styleUrl: './cover-letter.component.css'
})
export class CoverLetterComponent implements OnInit {
  public cvService = inject(CvBuilderService);
  private router = inject(Router);

  // Form Fields
  fullName = '';
  email = '';
  phone = '';
  location = '';
  
  jobTitle = '';
  companyName = '';
  hiringManager = '';
  jobDescription = '';

  // App State & FlowCV Views
  viewMode: 'select' | 'builder' = 'select'; // FlowCV style: starts on Template Selection!
  selectedCategory: string = 'All Templates';
  selectedTemplate: CoverLetterTemplate = 'modern';
  
  coverLetterText = '';
  isGenerating = false;
  isDownloading = false;
  activeTab: 'details' | 'edit' = 'details';
  copySuccess = false;
  currentDate = '';

  categories = [
    'All Templates',
    'Simple',
    'Modern',
    'Creative',
    'Elegant',
    'Executive'
  ];

  templates: TemplateItem[] = [
    {
      id: 'minimal',
      name: 'Classic Minimal',
      category: 'Simple',
      desc: 'Clean, elegant layout focusing on readability and timeless typography.',
      badge: 'Popular'
    },
    {
      id: 'modern',
      name: 'Creative Edge',
      category: 'Modern',
      desc: 'Sleek header with subtle indigo top accent bar for modern professionals.',
      badge: 'Recommended'
    },
    {
      id: 'elegant',
      name: 'Elegant Serif',
      category: 'Elegant',
      desc: 'Classic editorial aesthetic with centered serif typography and fine dividers.'
    },
    {
      id: 'creative',
      name: 'Modern Startup',
      category: 'Creative',
      desc: 'Dynamic design with vibrant accent line and crisp modern sans-serif structure.',
      badge: 'New'
    },
    {
      id: 'executive',
      name: 'Corporate Executive',
      category: 'Executive',
      desc: 'Authoritative dark banner header designed for senior leaders and managers.'
    },
    {
      id: 'tech',
      name: 'Silicon Valley',
      category: 'Modern',
      desc: 'High-tech emerald accent design ideal for software developers & tech roles.'
    }
  ];

  ngOnInit() {
    this.currentDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    this.loadResumeData();
    this.loadDraft();
  }

  get filteredTemplates(): TemplateItem[] {
    if (this.selectedCategory === 'All Templates') {
      return this.templates;
    }
    return this.templates.filter(t => t.category === this.selectedCategory);
  }

  loadResumeData() {
    const resume = this.cvService.cvData();
    if (resume) {
      this.fullName = resume.fullName || '';
      this.email = resume.email || '';
      this.phone = resume.phone || '';
      this.location = resume.location || '';
    }
  }

  loadDraft() {
    if (typeof window !== 'undefined') {
      const savedText = localStorage.getItem('cover_letter_draft_text');
      const savedMeta = localStorage.getItem('cover_letter_draft_meta');
      if (savedText) {
        this.coverLetterText = savedText;
      }
      if (savedMeta) {
        const meta = JSON.parse(savedMeta);
        this.jobTitle = meta.jobTitle || '';
        this.companyName = meta.companyName || '';
        this.hiringManager = meta.hiringManager || '';
        this.jobDescription = meta.jobDescription || '';
        if (meta.selectedTemplate) {
          this.selectedTemplate = meta.selectedTemplate;
        }
      }
    }
  }

  saveDraft() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cover_letter_draft_text', this.coverLetterText);
      localStorage.setItem('cover_letter_draft_meta', JSON.stringify({
        jobTitle: this.jobTitle,
        companyName: this.companyName,
        hiringManager: this.hiringManager,
        jobDescription: this.jobDescription,
        selectedTemplate: this.selectedTemplate
      }));
    }
  }

  selectTemplateAndStart(templateId: CoverLetterTemplate) {
    this.selectedTemplate = templateId;
    this.saveDraft();
    this.viewMode = 'builder';
  }

  switchToBuilder() {
    this.viewMode = 'builder';
  }

  switchToSelector() {
    this.viewMode = 'select';
  }

  filterCategory(cat: string) {
    this.selectedCategory = cat;
  }

  navigateToResume() {
    this.cvService.openOnboarding();
    this.cvService.onboardingStep.set(4);
    this.cvService.hideOnboardingSteps.set(true);
    this.router.navigate(['/dashboard']);
  }

  navigateToJobTracker() {
    this.router.navigate(['/saved-jobs']);
  }

  async generateCoverLetter() {
    if (!this.jobTitle || !this.companyName) {
      alert('Please fill out the Target Job Title and Company Name fields.');
      return;
    }

    this.isGenerating = true;
    try {
      this.cvService.updateData({
        fullName: this.fullName,
        email: this.email,
        phone: this.phone,
        location: this.location
      });

      const promptNotes = `Hiring Manager: ${this.hiringManager}\n\nJob Description:\n${this.jobDescription}`;
      
      const result = await this.cvService.generateCoverLetter(
        this.jobTitle,
        this.companyName,
        promptNotes
      );

      this.coverLetterText = result;
      this.activeTab = 'edit';
      this.saveDraft();
    } catch (error) {
      console.error('Failed to generate cover letter:', error);
      alert('Error generating cover letter. Please verify your Gemini API key in local settings.');
    } finally {
      this.isGenerating = false;
    }
  }

  copyToClipboard() {
    if (this.coverLetterText) {
      navigator.clipboard.writeText(this.coverLetterText).then(() => {
        this.copySuccess = true;
        setTimeout(() => this.copySuccess = false, 2000);
      });
    }
  }

  close() {
    this.router.navigate(['/dashboard']);
  }

  downloadPDF() {
    this.isDownloading = true;
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxLineWidth = pageWidth - (margin * 2);

      let y = 25;

      // --- HEADER RENDERING BASED ON TEMPLATE ---
      if (this.selectedTemplate === 'modern') {
        doc.setFillColor(99, 102, 241); // indigo-600
        doc.rect(0, 0, pageWidth, 5, 'F');
        
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(17, 24, 39);
        doc.text(this.fullName || 'Your Name', margin, y);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(75, 85, 99);
        y += 7;
        doc.text(`${this.email}  |  ${this.phone}  |  ${this.location}`, margin, y);
        y += 5;
        doc.setDrawColor(229, 231, 235);
        doc.line(margin, y, pageWidth - margin, y);
        y += 12;

      } else if (this.selectedTemplate === 'elegant') {
        doc.setFont('Times', 'italic');
        doc.setFontSize(26);
        doc.setTextColor(17, 24, 39);
        const nameWidth = doc.getTextWidth(this.fullName || 'Your Name');
        doc.text(this.fullName || 'Your Name', (pageWidth - nameWidth) / 2, y);

        doc.setFont('Times', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(75, 85, 99);
        y += 8;
        const contactText = `${this.email}  •  ${this.phone}  •  ${this.location}`;
        const contactWidth = doc.getTextWidth(contactText);
        doc.text(contactText, (pageWidth - contactWidth) / 2, y);
        y += 6;
        doc.setDrawColor(75, 85, 99);
        doc.line(margin, y, pageWidth - margin, y);
        y += 12;

      } else if (this.selectedTemplate === 'creative') {
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(99, 102, 241);
        doc.text(this.fullName || 'Your Name', margin, y);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(75, 85, 99);
        y += 8;
        doc.text(`${this.email}   •   ${this.phone}   •   ${this.location}`, margin, y);
        
        y += 4;
        doc.setDrawColor(99, 102, 241);
        doc.setLineWidth(1);
        doc.line(margin, y, pageWidth - margin, y);
        y += 12;

      } else if (this.selectedTemplate === 'executive') {
        doc.setFillColor(30, 41, 59); // slate-800 banner
        doc.rect(0, 0, pageWidth, 26, 'F');
        
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.text(this.fullName || 'Your Name', margin, 17);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(203, 213, 225);
        y = 36;
        doc.text(`${this.email}   |   ${this.phone}   |   ${this.location}`, margin, y);
        y += 5;
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, y, pageWidth - margin, y);
        y += 12;

      } else if (this.selectedTemplate === 'tech') {
        doc.setFillColor(16, 185, 129); // emerald-500 top bar
        doc.rect(0, 0, pageWidth, 5, 'F');

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(17, 24, 39);
        doc.text(this.fullName || 'Your Name', margin, y);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(16, 185, 129);
        y += 7;
        doc.text(`${this.email}  //  ${this.phone}  //  ${this.location}`, margin, y);
        y += 5;
        doc.setDrawColor(229, 231, 235);
        doc.line(margin, y, pageWidth - margin, y);
        y += 12;

      } else {
        // Minimal layout
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(17, 24, 39);
        doc.text(this.fullName || 'Your Name', margin, y);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(75, 85, 99);
        y += 6;
        doc.text(this.email, margin, y);
        y += 5;
        doc.text(this.phone, margin, y);
        y += 5;
        doc.text(this.location, margin, y);
        y += 12;
      }

      // --- DATE & RECIPIENT ---
      const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      doc.setFont(this.selectedTemplate === 'elegant' ? 'Times' : 'Helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(17, 24, 39);
      doc.text(currentDate, margin, y);
      y += 8;

      if (this.hiringManager || this.companyName) {
        doc.setFont(this.selectedTemplate === 'elegant' ? 'Times' : 'Helvetica', 'bold');
        if (this.hiringManager) {
          doc.text(this.hiringManager, margin, y);
          y += 5;
        }
        if (this.companyName) {
          doc.text(this.companyName, margin, y);
          y += 5;
        }
        y += 5;
      }

      // --- BODY ---
      doc.setFont(this.selectedTemplate === 'elegant' ? 'Times' : 'Helvetica', 'normal');
      doc.setFontSize(10.5);
      const textLines = doc.splitTextToSize(this.coverLetterText || 'Cover Letter body goes here...', maxLineWidth);
      const lineHeight = 6.5;

      for (let i = 0; i < textLines.length; i++) {
        if (y > 275) {
          doc.addPage();
          y = 20;
        }
        doc.text(textLines[i], margin, y);
        y += lineHeight;
      }

      const filename = `${(this.fullName || 'User').replace(/\s+/g, '_')}_Cover_Letter.pdf`;
      doc.save(filename);
    } catch (e) {
      console.error('Error downloading Cover Letter PDF', e);
    } finally {
      this.isDownloading = false;
    }
  }
}

