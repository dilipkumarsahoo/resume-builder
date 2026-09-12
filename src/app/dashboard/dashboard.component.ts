import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
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

export interface DashboardDocument {
  id: string;
  title: string;
  type: 'resume' | 'cover-letter' | 'resign-letter';
  template: TemplateType | string;
  lastUpdated: string;
  bgColor: string;
  accentColor: string;
  authorName: string;
  role: string;
  avatarUrl?: string;
  previewType: 'monica' | 'markus' | 'john' | 'minimal' | 'executive';
}

export interface TrendingJob {
  id: string;
  company: string;
  logo: string;
  logoBg: string;
  role: string;
  location: string;
  type: string;
  applied: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CvPreviewComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  public cvService = inject(CvBuilderService);
  public authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  // Active navigation tab on the unified sidebar
  activeNav = signal<'dashboard' | 'resume' | 'cover-letter' | 'jobs'>('dashboard');

  // Document filter tabs inside Dashboard view
  docTab = signal<'resume' | 'cover-letter'>('resume');

  // Search query
  searchQuery = signal<string>('');
  showSearchInput = signal<boolean>(false);

  // Notifications Popover
  showNotifications = signal<boolean>(false);
  unreadCount = signal<number>(2);

  // Create New Dropdown
  showCreateDropdown = signal<boolean>(false);

  // Resignation Letter Modal
  showResignModal = signal<boolean>(false);
  resignRole = 'Senior Software Engineer';
  resignCompany = 'Acme Corporation';
  resignManager = 'Sarah Connor';
  resignLastDate = 'September 30, 2026';
  resignReason = 'Career Growth & New Opportunities';
  resignLetterGenerated = '';

  // Settings Modal
  showSettingsModal = signal<boolean>(false);

  // Mobile Sidebar Toggle
  mobileSidebarOpen = signal<boolean>(false);

  // Active Three-Dots Dropdown Document ID
  activeMenuDocId = signal<string | null>(null);

  // User Profile
  isProUser = false;
  userName = '';
  userEmail = '';
  userAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80';

  // --- RESUME TEMPLATES GALLERY STATE ---
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

  // --- COVER LETTER STATE ---
  coverLetterViewMode: 'select' | 'builder' = 'select';
  selectedCoverCategory = 'All Templates';
  selectedCoverTemplate: CoverLetterTemplate = 'modern';
  fullName = '';
  email = '';
  phone = '';
  location = '';
  jobTitle = '';
  companyName = '';
  hiringManager = '';
  jobDescription = '';
  coverLetterText = '';
  isGenerating = false;
  isDownloading = false;
  coverActiveTab: 'details' | 'edit' = 'details';
  copySuccess = false;
  currentDate = '';

  coverCategories = [
    'All Templates',
    'Simple',
    'Modern',
    'Creative',
    'Elegant',
    'Executive'
  ];

  coverTemplates: TemplateItem[] = [
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

  // --- JOB TRACKER STATE ---
  jobs: any[] = [];
  showAddJobModal = false;
  newJobPosition = '';
  newJobCompany = '';
  newJobType = 'Full-time';
  newJobStatus = 'Bookmarked';
  jobSearchQuery = '';
  selectedJobStatusFilter = 'All Statuses';

  // --- DASHBOARD DOCUMENTS ---
  resumes: DashboardDocument[] = [
    {
      id: 'doc-1',
      title: "Monica's Resume",
      type: 'resume',
      template: 'creative',
      lastUpdated: 'Last Updated 2 days ago',
      bgColor: 'bg-[#f3f1fd]',
      accentColor: '#1b4df0',
      authorName: 'Jessica Marie',
      role: 'Web Designer',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      previewType: 'monica'
    },
    {
      id: 'doc-2',
      title: 'Markus',
      type: 'resume',
      template: 'modern',
      lastUpdated: 'Last Updated 2 days ago',
      bgColor: 'bg-[#eef8f2]',
      accentColor: '#10b981',
      authorName: 'Sherry Betti',
      role: 'Frontend Architect',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
      previewType: 'markus'
    },
    {
      id: 'doc-3',
      title: 'Untitled',
      type: 'resume',
      template: 'tech',
      lastUpdated: 'Last Updated 2 days ago',
      bgColor: 'bg-[#fffbeb]',
      accentColor: '#f59e0b',
      authorName: 'JOHN SURNAME',
      role: 'Senior UI/UX Designer',
      previewType: 'john'
    },
    {
      id: 'doc-4',
      title: 'Untitled',
      type: 'resume',
      template: 'minimal',
      lastUpdated: 'Last Updated 2 days ago',
      bgColor: 'bg-[#f8fafc]',
      accentColor: '#475569',
      authorName: 'Markus Johnson',
      role: 'Full Stack Engineer',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      previewType: 'minimal'
    }
  ];

  coverLetters: DashboardDocument[] = [
    {
      id: 'cl-1',
      title: 'Google Cover Letter',
      type: 'cover-letter',
      template: 'modern',
      lastUpdated: 'Last Updated 1 day ago',
      bgColor: 'bg-[#f0fdf4]',
      accentColor: '#16a34a',
      authorName: 'DILIP SAHOO',
      role: 'Staff Product Designer',
      previewType: 'executive'
    },
    {
      id: 'cl-2',
      title: 'Stripe Application',
      type: 'cover-letter',
      template: 'tech',
      lastUpdated: 'Last Updated 3 days ago',
      bgColor: 'bg-[#eff6ff]',
      accentColor: '#2563eb',
      authorName: 'DILIP SAHOO',
      role: 'Lead Frontend Engineer',
      previewType: 'minimal'
    }
  ];

  // Trending Jobs (Paginated)
  jobPageIndex = signal<number>(0);
  allTrendingJobs: TrendingJob[][] = [
    [
      {
        id: 'job-1',
        company: 'Adobe Technologies',
        logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/adobe.svg',
        logoBg: 'bg-red-50 text-red-600',
        role: 'Sales Engineer',
        location: 'Bangalore / Remote',
        type: 'Full-time',
        applied: false
      },
      {
        id: 'job-2',
        company: 'Dropbox Inc.',
        logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/dropbox.svg',
        logoBg: 'bg-blue-50 text-blue-600',
        role: 'SEO Executive',
        location: 'San Francisco, CA',
        type: 'Full-time',
        applied: false
      },
      {
        id: 'job-3',
        company: 'Amazon Web Services',
        logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/amazon.svg',
        logoBg: 'bg-amber-50 text-amber-600',
        role: 'Sales Engineer',
        location: 'Hyderabad / Hybrid',
        type: 'Full-time',
        applied: false
      },
      {
        id: 'job-4',
        company: 'Airbnb',
        logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/airbnb.svg',
        logoBg: 'bg-rose-50 text-rose-600',
        role: 'SEO Executive',
        location: 'Remote',
        type: 'Contract',
        applied: false
      },
      {
        id: 'job-5',
        company: 'Blinkist',
        logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/buffer.svg',
        logoBg: 'bg-emerald-50 text-emerald-600',
        role: 'Senior UX/UI Designer',
        location: 'Berlin / Remote',
        type: 'Full-time',
        applied: false
      },
      {
        id: 'job-6',
        company: 'Maza Pvt Ltd.',
        logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/meta.svg',
        logoBg: 'bg-indigo-50 text-indigo-600',
        role: 'SEO Executive',
        location: 'Mumbai, India',
        type: 'Full-time',
        applied: false
      }
    ],
    [
      {
        id: 'job-7',
        company: 'Figma',
        logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/figma.svg',
        logoBg: 'bg-purple-50 text-purple-600',
        role: 'Product Designer',
        location: 'San Francisco, CA',
        type: 'Full-time',
        applied: false
      },
      {
        id: 'job-8',
        company: 'Spotify',
        logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/spotify.svg',
        logoBg: 'bg-green-50 text-green-600',
        role: 'Senior React Developer',
        location: 'Stockholm / Remote',
        type: 'Full-time',
        applied: false
      },
      {
        id: 'job-9',
        company: 'Netflix',
        logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/netflix.svg',
        logoBg: 'bg-red-50 text-red-600',
        role: 'UI Systems Engineer',
        location: 'Los Gatos, CA',
        type: 'Full-time',
        applied: false
      },
      {
        id: 'job-10',
        company: 'GitHub',
        logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg',
        logoBg: 'bg-slate-100 text-slate-800',
        role: 'Developer Advocate',
        location: 'Remote',
        type: 'Full-time',
        applied: false
      },
      {
        id: 'job-11',
        company: 'Notion',
        logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/notion.svg',
        logoBg: 'bg-slate-100 text-slate-900',
        role: 'Brand Designer',
        location: 'New York, NY',
        type: 'Full-time',
        applied: false
      },
      {
        id: 'job-12',
        company: 'Linear',
        logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linear.svg',
        logoBg: 'bg-indigo-50 text-indigo-600',
        role: 'Frontend Engineer',
        location: 'Remote',
        type: 'Full-time',
        applied: false
      }
    ]
  ];

  toastMessage = signal<string | null>(null);

  ngOnInit() {
    this.currentDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    if (typeof window !== 'undefined') {
      this.isProUser = localStorage.getItem('glowcv_is_pro') === 'true';
      
      const loggedUser = this.authService.getUser();
      const savedName = localStorage.getItem('glowcv_user_name');
      const savedEmail = localStorage.getItem('glowcv_user_email');

      if (this.authService.isLoggedIn() && loggedUser) {
        this.userEmail = savedEmail || loggedUser.email || '';
        this.userName = savedName || loggedUser.fullName || loggedUser.name || (loggedUser.email ? loggedUser.email.split('@')[0].toUpperCase() : 'User');
      } else {
        this.userName = '';
        this.userEmail = '';
      }

      this.loadJobs();
      this.loadResumeData();
      this.loadDraft();

      // Read query params if any
      this.route.queryParams.subscribe(params => {
        const tab = params['tab'];
        if (tab === 'resume') {
          this.activeNav.set('resume');
        } else if (tab === 'cover-letter') {
          this.activeNav.set('cover-letter');
        } else if (tab === 'jobs' || tab === 'job-tracker') {
          if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/login'], { queryParams: { returnUrl: '/dashboard?tab=jobs' } });
            return;
          }
          this.activeNav.set('jobs');
        } else {
          // Default tab is 'dashboard'
          if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/login'], { queryParams: { returnUrl: '/dashboard' } });
            return;
          }
          this.activeNav.set('dashboard');
        }
      });
    }
  }

  saveAccountSettings() {
    if (typeof window !== 'undefined') {
      const user = this.authService.getUser() || { id: 1, email: this.userEmail, role: 'USER' as const };
      const updatedUser = {
        ...user,
        fullName: this.userName,
        name: this.userName,
        email: this.userEmail
      };
      this.authService.saveUser(updatedUser);
      localStorage.setItem('glowcv_user_name', this.userName);
      localStorage.setItem('glowcv_user_email', this.userEmail);

      this.cvService.cvData.update(current => ({
        ...current,
        fullName: this.userName,
        email: this.userEmail
      }));
    }
    this.showSettingsModal.set(false);
    this.showToast('Settings saved successfully!');
    this.cdr.markForCheck();
  }

  logout() {
    this.authService.logout();
    this.userName = '';
    this.userEmail = '';
    this.showToast('Logged out successfully');
    this.cdr.markForCheck();
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 150);
  }

  get userFirstName(): string {
    return this.userName.split(' ')[0] || 'User';
  }

  setNav(tab: 'dashboard' | 'resume' | 'cover-letter' | 'jobs', event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if ((tab === 'dashboard' || tab === 'jobs') && !this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/dashboard?tab=${tab}` } });
      return;
    }
    this.activeNav.set(tab);
    this.mobileSidebarOpen.set(false);
    this.cdr.markForCheck();
    this.cdr.detectChanges();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab }
    });
  }

  // --- RESUME TEMPLATES METHODS ---
  get filteredResumeTemplates(): ResumeTemplateItem[] {
    if (this.selectedResumeCategory === 'All Templates') {
      return this.resumeTemplates;
    }
    return this.resumeTemplates.filter(t => t.category === this.selectedResumeCategory);
  }

  filterResumeCategory(cat: string) {
    this.selectedResumeCategory = cat;
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

  // --- COVER LETTER METHODS ---
  get filteredCoverTemplates(): TemplateItem[] {
    if (this.selectedCoverCategory === 'All Templates') {
      return this.coverTemplates;
    }
    return this.coverTemplates.filter(t => t.category === this.selectedCoverCategory);
  }

  filterCoverCategory(cat: string) {
    this.selectedCoverCategory = cat;
  }

  selectCoverTemplateAndStart(templateId: CoverLetterTemplate) {
    this.selectedCoverTemplate = templateId;
    this.saveDraft();
    this.coverLetterViewMode = 'builder';
  }

  switchCoverToBuilder() {
    this.coverLetterViewMode = 'builder';
  }

  switchCoverToSelector() {
    this.coverLetterViewMode = 'select';
  }

  loadResumeData() {
    const resume = this.cvService.cvData();
    if (resume) {
      this.fullName = resume.fullName || this.userName;
      this.email = resume.email || this.userEmail;
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
        try {
          const meta = JSON.parse(savedMeta);
          this.jobTitle = meta.jobTitle || '';
          this.companyName = meta.companyName || '';
          this.hiringManager = meta.hiringManager || '';
          this.jobDescription = meta.jobDescription || '';
          if (meta.selectedTemplate) {
            this.selectedCoverTemplate = meta.selectedTemplate;
          }
        } catch (e) {
          console.error(e);
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
        selectedTemplate: this.selectedCoverTemplate
      }));
    }
  }

  generateCoverLetter() {
    this.isGenerating = true;
    this.saveDraft();

    setTimeout(() => {
      this.coverLetterText = `Dear ${this.hiringManager || 'Hiring Team'},

I am writing to express my strong enthusiasm for the ${this.jobTitle || 'Role'} position at ${this.companyName || 'your esteemed organization'}. With a proven background in delivering scalable solutions, driving team efficiency, and solving complex technical challenges, I am excited about the opportunity to contribute to your ongoing success.

Throughout my career, I have dedicated myself to mastering modern architectures, improving development speed, and creating intuitive user experiences. At my previous roles, I successfully spearheaded projects that boosted system performance, streamlined workflows, and directly elevated client satisfaction.

${this.jobDescription ? `Having reviewed your requirements regarding "${this.jobDescription.slice(0, 90)}...", I am confident that my hands-on experience directly matches your team's objectives.` : `Your team's mission and commitment to innovation strongly align with my personal approach to problem-solving and collaboration.`}

I look forward to discussing how my skills and background can add immediate value to ${this.companyName || 'your team'}. Thank you for your time and consideration.

Sincerely,

${this.fullName || this.userName}
${this.email || this.userEmail} | ${this.phone || '+1 (555) 019-2834'}`;
      this.isGenerating = false;
      this.coverActiveTab = 'edit';
      this.saveDraft();
      this.showToast('Cover letter generated with AI!');
    }, 1200);
  }

  copyCoverLetter() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.coverLetterText);
      this.copySuccess = true;
      setTimeout(() => (this.copySuccess = false), 2000);
      this.showToast('Cover letter copied to clipboard!');
    }
  }

  coverEditorTab: 'preview' | 'text' = 'preview';

  setCoverTemplate(templateId: CoverLetterTemplate) {
    this.selectedCoverTemplate = templateId;
    this.saveDraft();
  }

  downloadCoverPDF() {
    if (!this.coverLetterText) return;
    this.isDownloading = true;

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const template = this.selectedCoverTemplate || 'modern';
      const name = this.fullName || this.userName || 'Dilip Sahoo';
      const userEmail = this.email || this.userEmail || 'mailme.dilipsahu4@gmail.com';
      const userPhone = this.phone || '+91 98765 43210';
      const userLoc = this.location || 'Bangalore, India';
      const role = this.jobTitle || 'Software Engineer';
      const company = this.companyName || 'Technology Innovations';

      if (template === 'executive') {
        // ==========================================
        // 1. EXECUTIVE TEMPLATE PDF
        // ==========================================
        // Dark Navy Header Banner
        doc.setFillColor(15, 23, 42); // #0f172a
        doc.rect(0, 0, pageWidth, 35, 'F');

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(255, 255, 255);
        doc.text(name.toUpperCase(), 20, 18);

        doc.setFontSize(8.5);
        doc.setTextColor(245, 158, 11); // #f59e0b (Gold)
        doc.text('SENIOR EXECUTIVE LEADER', 20, 26);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(203, 213, 225); // #cbd5e1
        doc.text(`${userEmail}   |   ${userPhone}   |   ${userLoc}`, pageWidth - 20, 22, { align: 'right' });

        // Header Divider
        doc.setFillColor(245, 158, 11);
        doc.rect(0, 35, pageWidth, 1.5, 'F');

        // Date & Confidential Pill
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
        // ==========================================
        // 2. TECH / DEVELOPER TEMPLATE PDF
        // ==========================================
        // Top Emerald Accent Bar
        doc.setFillColor(16, 185, 129); // #10b981
        doc.rect(0, 0, pageWidth, 3, 'F');

        // Dark Terminal Header
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 3, pageWidth, 28, 'F');

        doc.setFont('Courier', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(255, 255, 255);
        doc.text(`<${name.replace(/\s+/g, '_')}/>`, 20, 17);

        doc.setFontSize(9);
        doc.setTextColor(52, 211, 153); // #34d399
        doc.text(`// ${role}`, 20, 24);

        doc.setFont('Courier', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(`${userEmail}   |   github.com/profile`, pageWidth - 20, 20, { align: 'right' });

        let y = 42;
        // Metadata chip
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
        // ==========================================
        // 3. CREATIVE SIDEBAR TEMPLATE PDF
        // ==========================================
        const sidebarWidth = 48;
        // Left Purple Sidebar
        doc.setFillColor(109, 40, 217); // #6d28d9
        doc.rect(0, 0, sidebarWidth, pageHeight, 'F');

        // Monogram Box
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(12, 16, 24, 24, 4, 4, 'F');
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(109, 40, 217);
        const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
        doc.text(initials, 24, 32, { align: 'center' });

        // Sidebar Contact
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

        // Sidebar Skills
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(233, 213, 255);
        doc.text('SKILLS', 8, 90);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(255, 255, 255);
        doc.text('• Full Stack\n• Architecture\n• UI/UX Design\n• Performance', 8, 96);

        // Right Main Content
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
            // Sidebar on new page
            doc.setFillColor(109, 40, 217);
            doc.rect(0, 0, sidebarWidth, pageHeight, 'F');
            y = 25;
          }
          doc.text(textLines[i], contentX, y);
          y += 5.8;
        }

      } else if (template === 'elegant') {
        // ==========================================
        // 4. ELEGANT SERIF TEMPLATE PDF
        // ==========================================
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
        // ==========================================
        // 5. CLASSIC MINIMAL TEMPLATE PDF
        // ==========================================
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
        // ==========================================
        // 6. MODERN TEMPLATE (DEFAULT)
        // ==========================================
        // Top Indigo Accent Line
        doc.setFillColor(37, 99, 235); // #2563eb
        doc.rect(0, 0, pageWidth, 4.5, 'F');

        // Monogram Box
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
        // Subject highlight box
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
      this.showToast(`Cover letter exported with ${template.toUpperCase()} template!`);
    } catch (e) {
      console.error(e);
      this.showToast('Error exporting PDF');
    } finally {
      this.isDownloading = false;
    }
  }

  // --- JOB TRACKER METHODS ---
  loadJobs() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('saved_jobs');
      if (saved) {
        try {
          this.jobs = JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      } else {
        this.jobs = [
          {
            position: 'Senior Software Engineer',
            company: 'Google',
            status: 'Bookmarked',
            dateSaved: 'May 13, 2026',
            dateApplied: null,
            type: 'Full-time',
            resume: 'Monica\'s Resume',
            notes: 'High priority application'
          },
          {
            position: 'Frontend Architect',
            company: 'Adobe Technologies',
            status: 'Applied',
            dateSaved: 'May 10, 2026',
            dateApplied: 'May 12, 2026',
            type: 'Full-time',
            resume: 'Markus',
            notes: 'Referred by senior team lead'
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
      resume: 'Monica\'s Resume',
      notes: ''
    };
    this.jobs.unshift(newJob);
    this.saveJobs();
    this.showAddJobModal = false;
    this.showToast(`Added "${newJob.position}" at ${newJob.company} to tracker!`);
  }

  deleteJob(index: number) {
    if (confirm('Are you sure you want to delete this job application?')) {
      const deleted = this.jobs.splice(index, 1);
      this.saveJobs();
      this.showToast(`Removed application for ${deleted[0]?.company || 'job'}.`);
    }
  }

  updateJobStatus(job: any, newStatus: string) {
    job.status = newStatus;
    if (newStatus === 'Applied' && !job.dateApplied) {
      job.dateApplied = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    this.saveJobs();
    this.showToast(`Updated status to "${newStatus}"`);
  }

  // --- DASHBOARD OVERVIEW METHODS ---
  get currentTrendingJobs(): TrendingJob[] {
    return this.allTrendingJobs[this.jobPageIndex()] || this.allTrendingJobs[0];
  }

  get filteredResumes(): DashboardDocument[] {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.resumes;
    return this.resumes.filter(d => d.title.toLowerCase().includes(q) || d.authorName.toLowerCase().includes(q));
  }

  get filteredCoverLetters(): DashboardDocument[] {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.coverLetters;
    return this.coverLetters.filter(d => d.title.toLowerCase().includes(q) || d.authorName.toLowerCase().includes(q));
  }

  prevJobPage() {
    if (this.jobPageIndex() > 0) {
      this.jobPageIndex.update(i => i - 1);
    } else {
      this.jobPageIndex.set(this.allTrendingJobs.length - 1);
    }
  }

  nextJobPage() {
    if (this.jobPageIndex() < this.allTrendingJobs.length - 1) {
      this.jobPageIndex.update(i => i + 1);
    } else {
      this.jobPageIndex.set(0);
    }
  }

  toggleDocMenu(docId: string, event: Event) {
    event.stopPropagation();
    if (this.activeMenuDocId() === docId) {
      this.activeMenuDocId.set(null);
    } else {
      this.activeMenuDocId.set(docId);
    }
  }

  closeDocMenu() {
    this.activeMenuDocId.set(null);
  }

  openResumeEditor(doc?: DashboardDocument) {
    if (doc && doc.template) {
      this.cvService.selectedTemplate.set(doc.template as TemplateType);
    }
    this.router.navigate(['/cv-builder']);
  }

  openCoverEditor(doc?: DashboardDocument) {
    if (doc && doc.template) {
      this.selectedCoverTemplate = doc.template as CoverLetterTemplate;
    }
    this.coverLetterViewMode = 'builder';
    this.setNav('cover-letter');
  }

  applyToJob(job: TrendingJob, event: Event) {
    event.stopPropagation();
    job.applied = true;
    
    const exists = this.jobs.some((j: any) => j.company === job.company && j.position === job.role);
    if (!exists) {
      this.jobs.unshift({
        position: job.role,
        company: job.company,
        status: 'Applied',
        dateSaved: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        dateApplied: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type: job.type,
        resume: 'Monica\'s Resume',
        notes: `Applied via Dashboard on ${new Date().toLocaleDateString()}`
      });
      this.saveJobs();
    }

    this.showToast(`Applied to ${job.company}! Added to Job Tracker.`);
  }

  duplicateDoc(doc: DashboardDocument, event: Event) {
    event.stopPropagation();
    this.closeDocMenu();
    const newDoc: DashboardDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      title: `${doc.title} (Copy)`,
      lastUpdated: 'Just now'
    };
    if (doc.type === 'resume') {
      this.resumes.unshift(newDoc);
    } else {
      this.coverLetters.unshift(newDoc);
    }
    this.showToast(`Duplicated "${doc.title}".`);
  }

  deleteDoc(doc: DashboardDocument, event: Event) {
    event.stopPropagation();
    this.closeDocMenu();
    if (confirm(`Are you sure you want to delete "${doc.title}"?`)) {
      if (doc.type === 'resume') {
        this.resumes = this.resumes.filter(d => d.id !== doc.id);
      } else {
        this.coverLetters = this.coverLetters.filter(d => d.id !== doc.id);
      }
      this.showToast(`Deleted "${doc.title}".`);
    }
  }

  downloadDocPdf(doc: DashboardDocument, event: Event) {
    event.stopPropagation();
    this.closeDocMenu();
    this.showToast(`Downloading PDF for "${doc.title}"...`);
    const docPdf = new jsPDF();
    docPdf.setFontSize(20);
    docPdf.text(doc.title, 20, 30);
    docPdf.setFontSize(12);
    docPdf.text(`Author: ${doc.authorName}`, 20, 45);
    docPdf.text(`Role: ${doc.role}`, 20, 55);
    docPdf.text(`Generated by GlowCV on ${new Date().toLocaleDateString()}`, 20, 70);
    docPdf.save(`${doc.title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
  }

  openResignModal() {
    this.generateResignLetter();
    this.showResignModal.set(true);
    this.showCreateDropdown.set(false);
  }

  generateResignLetter() {
    this.resignLetterGenerated = `Date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

To: ${this.resignManager || 'Hiring Manager'}
${this.resignCompany || 'Company Name'}

Dear ${this.resignManager || 'Manager'},

Please accept this letter as formal notification that I am resigning from my position as ${this.resignRole || 'Software Engineer'} at ${this.resignCompany || 'Company'}. My last day with the organization will be ${this.resignLastDate || 'two weeks from today'}.

I would like to express my sincere appreciation for the opportunities I have had during my time with the team. I have enjoyed working with everyone and value the experience and professional growth I have gained.

${this.resignReason ? `Reason for departure: ${this.resignReason}.\n\n` : ''}During my remaining time, I am committed to ensuring a smooth and seamless transition of my responsibilities, including training team members and documenting active projects.

I wish ${this.resignCompany || 'the company'} continued success in the future.

Sincerely,

${this.userName}
${this.userEmail}`;
  }

  copyResignLetter() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.resignLetterGenerated);
      this.showToast('Resignation letter copied to clipboard!');
    }
  }

  downloadResignPdf() {
    const doc = new jsPDF();
    doc.setFontSize(11);
    const splitText = doc.splitTextToSize(this.resignLetterGenerated, 170);
    doc.text(splitText, 20, 30);
    doc.save(`Resignation_Letter_${this.userFirstName}.pdf`);
    this.showToast('Resignation Letter downloaded as PDF!');
  }

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3500);
  }
}
