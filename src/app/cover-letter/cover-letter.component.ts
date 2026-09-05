import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CvBuilderService, TemplateType } from '../cv-builder.service';
import { CvPreviewComponent } from '../cv-preview/cv-preview.component';
import { jsPDF } from 'jspdf';

export type CoverLetterTemplate = 'minimal' | 'modern' | 'elegant' | 'creative' | 'executive' | 'tech';

export interface TemplateItem {
  id: CoverLetterTemplate;
  name: string;
  category: 'Simple' | 'Modern' | 'Creative' | 'Elegant' | 'Executive';
  desc: string;
  badge?: string;
}

export interface ResumeTemplateItem {
  id: TemplateType;
  name: string;
  category: string;
  badge?: string;
}

@Component({
  selector: 'app-cover-letter',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CvPreviewComponent],
  templateUrl: './cover-letter.component.html',
  styleUrl: './cover-letter.component.css'
})
export class CoverLetterComponent implements OnInit {
  public cvService = inject(CvBuilderService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Active Section in Career Suite
  activeTabSection: 'resume' | 'cover-letter' | 'jobs' = 'cover-letter';

  // Form Fields
  fullName = '';
  email = '';
  phone = '';
  location = '';
  
  jobTitle = '';
  companyName = '';
  hiringManager = '';
  jobDescription = '';

  // Resume Templates State
  selectedResumeCategory = 'All Templates';
  selectedResumeTemplate: TemplateType = 'modern';
  resumeCategories = [
    'All Templates',
    'Minimal',
    'Creative',
    'Corporate',
    'Tech'
  ];

  resumeTemplates: ResumeTemplateItem[] = [
    { id: 'minimal', name: 'Modern Minimal', category: 'Minimal', badge: 'Popular' },
    { id: 'modern', name: 'Creative Edge', category: 'Creative', badge: 'Recommended' },
    { id: 'professional', name: 'Corporate Pro', category: 'Corporate', badge: 'ATS Ready' },
    { id: 'creative', name: 'Design Studio', category: 'Creative', badge: 'New' },
    { id: 'corporate', name: 'Executive Suite', category: 'Corporate' },
    { id: 'tech', name: 'Silicon Valley', category: 'Tech', badge: 'Popular' },
    { id: 'bold', name: 'Bold Statement', category: 'Creative' },
    { id: 'elegant', name: 'Elegant Serif', category: 'Minimal' },
    { id: 'executive', name: 'Leadership', category: 'Corporate' },
    { id: 'fresher', name: 'Early Career', category: 'Minimal' },
    { id: 'designer', name: 'Portfolio Plus', category: 'Creative' },
    { id: 'compact', name: 'Dense Info', category: 'Minimal' },
    { id: 'sidebar-dark', name: 'Midnight Pro', category: 'Corporate', badge: 'Dark Mode' },
    { id: 'banner', name: 'Hero Header', category: 'Creative' },
    { id: 'timeline', name: 'History View', category: 'Tech' },
    { id: 'bubble', name: 'Playful UI', category: 'Creative' },
    { id: 'classic-ats', name: 'ATS Scanner', category: 'Corporate', badge: 'ATS 100%' },
    { id: 'startup', name: 'Fast Track', category: 'Tech' }
  ];

  // Job Tracker State
  jobs: any[] = [];
  showAddJobModal = false;
  newJobPosition = '';
  newJobCompany = '';
  newJobType = 'Full-time';
  newJobStatus = 'Bookmarked';
  jobSearchQuery = '';
  selectedJobStatusFilter = 'All Statuses';

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

    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'resume') {
        this.activeTabSection = 'resume';
      } else if (params['tab'] === 'cover-letter') {
        this.activeTabSection = 'cover-letter';
      } else if (params['tab'] === 'jobs' || params['tab'] === 'job-tracker') {
        this.activeTabSection = 'jobs';
      }
    });

    this.loadResumeData();
    this.loadDraft();
    this.loadJobs();
  }

  loadJobs() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('saved_jobs');
      if (saved) {
        this.jobs = JSON.parse(saved);
      } else {
        this.jobs = [
          {
            position: 'Software Engineer',
            company: 'Google',
            status: 'Bookmarked',
            dateSaved: 'May 13, 2026',
            dateApplied: null,
            type: 'Full-time',
            resume: null,
            coverLetter: null,
            notes: ''
          }
        ];
        this.saveJobs();
      }
    }
  }

  saveJobs() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('saved_jobs', JSON.stringify(this.jobs));
    }
  }

  get bookmarkedCount(): number {
    return this.jobs.filter(j => j.status === 'Bookmarked').length;
  }

  get appliedCount(): number {
    return this.jobs.filter(j => j.status === 'Applied').length;
  }

  get interviewingOrOfferCount(): number {
    return this.jobs.filter(j => j.status === 'Interviewing' || j.status === 'Offer').length;
  }

  get filteredJobs(): any[] {
    return this.jobs.filter(job => {
      const matchesSearch = !this.jobSearchQuery.trim() || 
        job.position.toLowerCase().includes(this.jobSearchQuery.toLowerCase()) || 
        job.company.toLowerCase().includes(this.jobSearchQuery.toLowerCase());
      const matchesStatus = this.selectedJobStatusFilter === 'All Statuses' || job.status === this.selectedJobStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  openAddJobModal() {
    this.newJobPosition = '';
    this.newJobCompany = '';
    this.newJobType = 'Full-time';
    this.newJobStatus = 'Bookmarked';
    this.showAddJobModal = true;
  }

  closeAddJobModal() {
    this.showAddJobModal = false;
  }

  addJob() {
    if (!this.newJobPosition.trim() || !this.newJobCompany.trim()) return;
    const newJob = {
      position: this.newJobPosition.trim(),
      company: this.newJobCompany.trim(),
      status: this.newJobStatus,
      dateSaved: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      dateApplied: this.newJobStatus === 'Applied' ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null,
      type: this.newJobType,
      resume: null,
      coverLetter: null,
      notes: ''
    };
    this.jobs.push(newJob);
    this.saveJobs();
    this.showAddJobModal = false;
  }

  deleteJob(index: number) {
    if (confirm('Are you sure you want to delete this job application?')) {
      this.jobs.splice(index, 1);
      this.saveJobs();
    }
  }

  updateJobStatus(job: any, newStatus: string) {
    job.status = newStatus;
    if (newStatus === 'Applied' && !job.dateApplied) {
      job.dateApplied = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    this.saveJobs();
  }

  get filteredResumeTemplates(): ResumeTemplateItem[] {
    if (this.selectedResumeCategory === 'All Templates') {
      return this.resumeTemplates;
    }
    return this.resumeTemplates.filter(t => t.category === this.selectedResumeCategory);
  }

  filterResumeCategory(cat: string) {
    this.selectedResumeCategory = cat;
  }

  switchToResumeSection() {
    this.activeTabSection = 'resume';
    this.router.navigate([], { relativeTo: this.route, queryParams: { tab: 'resume' }, queryParamsHandling: 'merge' });
  }

  switchToCoverLetterSection() {
    this.activeTabSection = 'cover-letter';
    this.viewMode = 'select';
    this.router.navigate([], { relativeTo: this.route, queryParams: { tab: 'cover-letter' }, queryParamsHandling: 'merge' });
  }

  switchToJobTrackerSection() {
    this.activeTabSection = 'jobs';
    this.router.navigate([], { relativeTo: this.route, queryParams: { tab: 'jobs' }, queryParamsHandling: 'merge' });
  }

  selectResumeTemplateAndStart(templateId: TemplateType) {
    this.selectedResumeTemplate = templateId;
    this.cvService.openModal(templateId);
  }

  startBlankResume() {
    this.cvService.openModal('modern');
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
    this.switchToResumeSection();
  }

  navigateToJobTracker() {
    this.switchToJobTrackerSection();
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
    this.router.navigate(['/']);
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

