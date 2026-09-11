import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CvBuilderService, TemplateType } from '../cv-builder.service';
import { AuthService } from '../services/auth.service';
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
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Active Section in Career Suite
  activeTabSection: 'resume' | 'cover-letter' | 'jobs' = 'cover-letter';

  // Form Fields
  fullName = '';
  userName = 'Dilip Sahoo';
  email = '';
  userEmail = 'mailme.dilipsahu4@gmail.com';
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

  importExistingResume() {
    if (!this.authService.getToken()) {
      this.router.navigate(['/login']);
      return;
    }
    this.cvService.openImportResume();
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
      this.fullName = resume.fullName || this.userName;
      this.userName = resume.fullName || this.userName;
      this.email = resume.email || this.userEmail;
      this.userEmail = resume.email || this.userEmail;
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

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const template = this.selectedTemplate || 'modern';
      const name = this.fullName || 'Dilip Sahoo';
      const userEmail = this.email || 'mailme.dilipsahu4@gmail.com';
      const userPhone = this.phone || '+91 98765 43210';
      const userLoc = this.location || 'Bangalore, India';
      const role = this.jobTitle || 'Software Engineer';
      const company = this.companyName || 'Technology Innovations';

      if (template === 'executive') {
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, pageWidth, 35, 'F');

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(255, 255, 255);
        doc.text(name.toUpperCase(), 20, 18);

        doc.setFontSize(8.5);
        doc.setTextColor(245, 158, 11);
        doc.text('SENIOR EXECUTIVE LEADER', 20, 26);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(203, 213, 225);
        doc.text(`${userEmail}   |   ${userPhone}   |   ${userLoc}`, pageWidth - 20, 22, { align: 'right' });

        doc.setFillColor(245, 158, 11);
        doc.rect(0, 35, pageWidth, 1.5, 'F');

        let y = 48;
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        doc.text(this.currentDate, 20, y);

        doc.setFillColor(241, 245, 249);
        doc.roundedRect(pageWidth - 52, y - 5, 32, 7, 2, 2, 'F');
        doc.setFontSize(7);
        doc.setTextColor(15, 23, 42);
        doc.text('CONFIDENTIAL', pageWidth - 36, y - 0.5, { align: 'center' });

        y += 12;
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);

        const textLines = doc.splitTextToSize(this.coverLetterText, pageWidth - 40);
        for (let i = 0; i < textLines.length; i++) {
          if (y > pageHeight - 25) {
            doc.addPage();
            y = 25;
          }
          doc.text(textLines[i], 20, y);
          y += 6;
        }

      } else if (template === 'tech') {
        doc.setFillColor(16, 185, 129);
        doc.rect(0, 0, pageWidth, 3, 'F');

        doc.setFillColor(15, 23, 42);
        doc.rect(0, 3, pageWidth, 28, 'F');

        doc.setFont('Courier', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(255, 255, 255);
        doc.text(`<${name.replace(/\s+/g, '_')}/>`, 20, 17);

        doc.setFontSize(9);
        doc.setTextColor(52, 211, 153);
        doc.text(`// ${role}`, 20, 24);

        doc.setFont('Courier', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(`${userEmail}   |   github.com/profile`, pageWidth - 20, 20, { align: 'right' });

        let y = 42;
        doc.setFillColor(241, 245, 249);
        doc.rect(20, y - 4, pageWidth - 40, 8, 'F');
        doc.setFont('Courier', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(`DATE: ${this.currentDate}`, 24, y + 1.5);
        doc.setTextColor(5, 150, 105);
        doc.setFont('Courier', 'bold');
        doc.text('[COVER_LETTER.MD]', pageWidth - 24, y + 1.5, { align: 'right' });

        y += 14;
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);

        const textLines = doc.splitTextToSize(this.coverLetterText, pageWidth - 40);
        for (let i = 0; i < textLines.length; i++) {
          if (y > pageHeight - 25) {
            doc.addPage();
            y = 25;
          }
          doc.text(textLines[i], 20, y);
          y += 6;
        }

      } else if (template === 'creative') {
        const sidebarWidth = 48;
        doc.setFillColor(109, 40, 217);
        doc.rect(0, 0, sidebarWidth, pageHeight, 'F');

        doc.setFillColor(255, 255, 255);
        doc.roundedRect(12, 16, 24, 24, 4, 4, 'F');
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(109, 40, 217);
        const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
        doc.text(initials, 24, 32, { align: 'center' });

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(233, 213, 255);
        doc.text('CONTACT', 8, 52);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(255, 255, 255);
        const emailLines = doc.splitTextToSize(userEmail, sidebarWidth - 16);
        doc.text(emailLines, 8, 58);
        doc.text(userPhone, 8, 68);
        doc.text(userLoc, 8, 74);

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(233, 213, 255);
        doc.text('SKILLS', 8, 90);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(255, 255, 255);
        doc.text('• Full Stack\n• Architecture\n• UI/UX Design\n• Performance', 8, 96);

        const contentX = sidebarWidth + 14;
        const contentWidth = pageWidth - contentX - 16;
        let y = 24;

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(109, 40, 217);
        doc.text(name, contentX, y);

        y += 6;
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(role, contentX, y);

        y += 4;
        doc.setDrawColor(243, 232, 255);
        doc.line(contentX, y, contentX + contentWidth, y);

        y += 10;
        doc.setFontSize(8.5);
        doc.setTextColor(148, 163, 184);
        doc.text(this.currentDate, contentX, y);

        y += 8;
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(30, 41, 59);

        const textLines = doc.splitTextToSize(this.coverLetterText, contentWidth);
        for (let i = 0; i < textLines.length; i++) {
          if (y > pageHeight - 20) {
            doc.addPage();
            doc.setFillColor(109, 40, 217);
            doc.rect(0, 0, sidebarWidth, pageHeight, 'F');
            y = 25;
          }
          doc.text(textLines[i], contentX, y);
          y += 5.8;
        }

      } else if (template === 'elegant') {
        let y = 25;
        doc.setFont('Times', 'italic');
        doc.setFontSize(22);
        doc.setTextColor(15, 23, 42);
        doc.text(name, pageWidth / 2, y, { align: 'center' });

        y += 7;
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(`•  ${role.toUpperCase()}  •`, pageWidth / 2, y, { align: 'center' });

        y += 4.5;
        doc.setFontSize(7.5);
        doc.text(`${userEmail}   •   ${userPhone}   •   ${userLoc}`, pageWidth / 2, y, { align: 'center' });

        y += 4;
        doc.setDrawColor(203, 213, 225);
        doc.line(30, y, pageWidth - 30, y);
        doc.line(30, y + 1, pageWidth - 30, y + 1);

        y += 12;
        doc.setFont('Times', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(this.currentDate, 25, y);

        y += 8;
        doc.setFont('Times', 'normal');
        doc.setFontSize(10.5);
        doc.setTextColor(30, 41, 59);

        const textLines = doc.splitTextToSize(this.coverLetterText, pageWidth - 50);
        for (let i = 0; i < textLines.length; i++) {
          if (y > pageHeight - 25) {
            doc.addPage();
            y = 25;
          }
          doc.text(textLines[i], 25, y);
          y += 6.2;
        }

      } else if (template === 'minimal') {
        let y = 25;
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(15, 23, 42);
        doc.text(name, 20, y);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text(role, 20, y + 6);

        doc.setFontSize(7.5);
        doc.text(`${userEmail}\n${userPhone}\n${userLoc}`, pageWidth - 20, y - 1, { align: 'right' });

        y += 14;
        doc.setDrawColor(226, 232, 240);
        doc.line(20, y, pageWidth - 20, y);

        y += 10;
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text(this.currentDate, 20, y);

        y += 8;
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);

        const textLines = doc.splitTextToSize(this.coverLetterText, pageWidth - 40);
        for (let i = 0; i < textLines.length; i++) {
          if (y > pageHeight - 25) {
            doc.addPage();
            y = 25;
          }
          doc.text(textLines[i], 20, y);
          y += 6;
        }

      } else {
        doc.setFillColor(37, 99, 235);
        doc.rect(0, 0, pageWidth, 4.5, 'F');

        doc.setFillColor(37, 99, 235);
        doc.roundedRect(20, 14, 16, 16, 3, 3, 'F');
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
        doc.text(initials, 28, 24.5, { align: 'center' });

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(15, 23, 42);
        doc.text(name, 42, 21);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(37, 99, 235);
        doc.text(role, 42, 27);

        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(`${userEmail}   |   ${userPhone}   |   ${userLoc}`, pageWidth - 20, 24, { align: 'right' });

        let y = 36;
        doc.setDrawColor(241, 245, 249);
        doc.line(20, y, pageWidth - 20, y);

        y += 6;
        doc.setFillColor(239, 246, 255);
        doc.roundedRect(20, y, pageWidth - 40, 8, 2, 2, 'F');
        doc.setFillColor(37, 99, 235);
        doc.rect(20, y, 2.5, 8, 'F');

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(30, 41, 59);
        doc.text(`RE: ${role} Position at ${company}`, 26, y + 5.5);
        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(37, 99, 235);
        doc.text(this.currentDate, pageWidth - 26, y + 5.5, { align: 'right' });

        y += 16;
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);

        const textLines = doc.splitTextToSize(this.coverLetterText, pageWidth - 40);
        for (let i = 0; i < textLines.length; i++) {
          if (y > pageHeight - 25) {
            doc.addPage();
            y = 25;
          }
          doc.text(textLines[i], 20, y);
          y += 6;
        }
      }

      const filename = `${name.replace(/\s+/g, '_')}_${template.toUpperCase()}_Cover_Letter.pdf`;
      doc.save(filename);
    } catch (e) {
      console.error('Error downloading Cover Letter PDF', e);
    } finally {
      this.isDownloading = false;
    }
  }
}

