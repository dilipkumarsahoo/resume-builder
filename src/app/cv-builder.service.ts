import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GoogleGenAI } from '@google/genai';

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
}

export interface CVData {
  fullName: string;
  jobTitle: string;
  summary: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
}

export type TemplateType = 'minimal' | 'modern' | 'professional' | 'creative' | 'corporate' | 'tech' | 'bold' | 'elegant' | 'executive' | 'fresher' | 'designer' | 'compact' | 'sidebar-dark' | 'banner' | 'timeline' | 'bubble' | 'classic-ats' | 'startup';

export interface CustomizationSettings {
  language: string;
  dateFormat: string;
  pageFormat: 'A4' | 'US Letter';
  columns: 'one' | 'two' | 'mix';
  fontFamily: string;
  nameFontFamily?: string;
  bodyFontSize: 'small' | 'medium' | 'large';
  headingSize: 'small' | 'medium' | 'large';
  baseFontPt: number;
  nameFontPt: number;
  headingsFontPt: number;
  entryHeaderFontPt: number;
  lineHeight: number | string;
  spaceBetweenElements: number;
  sideMarginMm: number;
  topBottomMarginMm: number;
  sectionSpacing?: 'compact' | 'normal' | 'spacious';
  primaryColor: string;
  headingStyle: 'simple' | 'underlined' | 'pill' | 'accent-left';
  headingTransform: 'none' | 'uppercase' | 'capitalize';
  headerAlignment: 'left' | 'center' | 'banner';
  showPhoto: boolean;
  photoShape: 'circle' | 'rounded' | 'square';
  photoSize: 'small' | 'medium' | 'large';
  showIcons: boolean;
  underlineLinks: boolean;
  showPageNumbers: boolean;
  footerPageNumbers?: boolean;
  footerEmail?: boolean;
  footerName?: boolean;
  footerCustom?: boolean;
  footerLeft?: string;
  footerCenter?: string;
  footerRight?: string;
  entryStructure?: 'full' | 'columns';
  entryDateLocationPosition?: 'right' | 'left' | 'split';
  entrySubtitlePlacement?: 'same-line' | 'below-title';
  sectionOrder?: string[];
  footerText: string;
}

@Injectable({ providedIn: 'root' })
export class CvBuilderService {
  private router = inject(Router);
  private http = inject(HttpClient);
  isOnboardingOpen = signal(false);
  onboardingStep = signal(1);
  hideOnboardingSteps = signal(false);
  selectedTemplate = signal<TemplateType>('modern');
  isImprovingSummary = signal(false);
  isParsing = signal(false);
  parseError = signal<string | null>(null);

  defaultCustomization: CustomizationSettings = {
    language: 'English (UK)',
    dateFormat: 'DD/MM/YYYY',
    pageFormat: 'A4',
    columns: 'one',
    fontFamily: 'Alegreya',
    nameFontFamily: 'Same as body font',
    bodyFontSize: 'medium',
    headingSize: 'medium',
    baseFontPt: 10.5,
    nameFontPt: 11,
    headingsFontPt: 3,
    entryHeaderFontPt: 0,
    lineHeight: 1.15,
    spaceBetweenElements: 12,
    sideMarginMm: 22,
    topBottomMarginMm: 12,
    sectionSpacing: 'normal',
    entryStructure: 'columns',
    entryDateLocationPosition: 'right',
    entrySubtitlePlacement: 'below-title',
    sectionOrder: ['summary', 'skills', 'experience', 'education', 'projects'],
    primaryColor: '#10b981',
    headingStyle: 'simple',
    headingTransform: 'uppercase',
    headerAlignment: 'left',
    showPhoto: true,
    photoShape: 'circle',
    photoSize: 'medium',
    showIcons: true,
    underlineLinks: false,
    showPageNumbers: false,
    footerPageNumbers: false,
    footerEmail: false,
    footerName: false,
    footerCustom: false,
    footerLeft: '',
    footerCenter: '',
    footerRight: '',
    footerText: ''
  };

  customization = signal<CustomizationSettings>(this.defaultCustomization);
  private history: CustomizationSettings[] = [];
  private historyIndex = -1;

  defaultData: CVData = {
    fullName: 'Alex Johnson',
    jobTitle: 'Senior Frontend Developer',
    summary: 'Passionate and detail-oriented frontend developer with 5+ years of experience building responsive, accessible, and performant web applications. Expert in Angular, React, and modern CSS frameworks.',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    skills: ['JavaScript', 'TypeScript', 'Angular', 'React', 'Tailwind CSS', 'HTML/CSS', 'Git'],
    experience: [
      {
        id: '1',
        company: 'Tech Innovators Inc.',
        role: 'Senior Frontend Developer',
        startDate: 'Jan 2021',
        endDate: 'Present',
        description: 'Lead the frontend development team in building a scalable SaaS platform. Improved performance by 40% and implemented a comprehensive design system.'
      },
      {
        id: '2',
        company: 'Web Solutions LLC',
        role: 'Frontend Developer',
        startDate: 'Mar 2018',
        endDate: 'Dec 2020',
        description: 'Developed and maintained multiple client websites using React and Redux. Collaborated closely with designers to ensure pixel-perfect implementations.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'University of California, Berkeley',
        degree: 'B.S. Computer Science',
        year: '2014 - 2018'
      }
    ],
    projects: [
      {
        id: '1',
        name: 'E-commerce Dashboard',
        description: 'A comprehensive dashboard for e-commerce sellers to track sales, inventory, and customer analytics.'
      }
    ]
  };

  cvData = signal<CVData>(this.defaultData);
  private ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  constructor() {
    this.loadFromLocalStorage();
    this.loadCustomizationFromStorage();
  }

  updateCustomization(patch: Partial<CustomizationSettings>, recordHistory: boolean = true) {
    if (recordHistory) {
      if (this.historyIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.historyIndex + 1);
      }
      this.history.push({ ...this.customization() });
      if (this.history.length > 30) this.history.shift();
      this.historyIndex = this.history.length - 1;
    }
    this.customization.update(current => {
      const updated = { ...current, ...patch };
      this.saveCustomizationToStorage(updated);
      return updated;
    });
  }

  canUndo(): boolean {
    return this.historyIndex >= 0;
  }

  canRedo(): boolean {
    return this.historyIndex < this.history.length - 1;
  }

  undo() {
    if (!this.canUndo()) return;
    const previous = this.history[this.historyIndex];
    this.historyIndex--;
    this.customization.set(previous);
    this.saveCustomizationToStorage(previous);
  }

  redo() {
    if (!this.canRedo()) return;
    this.historyIndex++;
    const next = this.history[this.historyIndex];
    this.customization.set(next);
    this.saveCustomizationToStorage(next);
  }

  resetCustomization() {
    this.updateCustomization(this.defaultCustomization);
  }

  private saveCustomizationToStorage(data: CustomizationSettings) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('cv_builder_customization', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save customization to local storage', e);
    }
  }

  private loadCustomizationFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('cv_builder_customization');
      if (saved) {
        this.customization.set({ ...this.defaultCustomization, ...JSON.parse(saved) });
      }
    } catch (e) {
      console.error('Failed to load customization from local storage', e);
    }
  }

  openModal(template?: TemplateType) {
    if (template) {
      this.selectedTemplate.set(template);
    }
    this.router.navigate(['/cv-builder']);
  }

  openOnboarding() {
    this.isOnboardingOpen.set(true);
    this.onboardingStep.set(1);
    this.hideOnboardingSteps.set(false);
    document.body.style.overflow = 'hidden';
  }

  openResumeTemplates() {
    this.isOnboardingOpen.set(true);
    this.onboardingStep.set(4);
    this.hideOnboardingSteps.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeOnboarding() {
    this.isOnboardingOpen.set(false);
    this.hideOnboardingSteps.set(false);
    document.body.style.overflow = 'auto';
  }

  closeModal() {
    this.router.navigate(['/cover-letter'], { queryParams: { tab: 'resume' } });
  }

  updateData(newData: Partial<CVData>) {
    this.cvData.update(current => {
      const updated = { ...current, ...newData };
      this.saveToLocalStorage(updated);
      return updated;
    });
  }

  async improveSummary() {
    const currentSummary = this.cvData().summary;
    const jobTitle = this.cvData().jobTitle;
    if (!currentSummary || currentSummary.trim().length < 10) return;

    this.isImprovingSummary.set(true);
    try {
      const prompt = `You are an expert resume writer. Improve the following professional summary for a ${jobTitle || 'professional'}. Make it impactful, concise, and ATS-friendly. Return ONLY the improved summary text, no quotes or extra formatting.\n\nOriginal: ${currentSummary}`;
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      if (response.text) {
        this.updateData({ summary: response.text.trim() });
      }
    } catch (error) {
      console.error('Failed to improve summary:', error);
    } finally {
      this.isImprovingSummary.set(false);
    }
  }

  async generateCoverLetter(jobPosition: string, companyName: string, additionalNotes?: string): Promise<string> {
    const data = this.cvData();
    const candidateName = data.fullName || 'Candidate';
    const email = data.email || '';
    const phone = data.phone || '';
    const location = data.location || '';
    const skillsList = data.skills ? data.skills.join(', ') : '';
    
    let experienceText = '';
    if (data.experience && data.experience.length > 0) {
      experienceText = data.experience.map(exp => 
        `- Role: ${exp.role} at ${exp.company} (${exp.startDate} - ${exp.endDate}): ${exp.description}`
      ).join('\n');
    }

    let educationText = '';
    if (data.education && data.education.length > 0) {
      educationText = data.education.map(edu => 
        `- Degree: ${edu.degree} from ${edu.institution} (${edu.year})`
      ).join('\n');
    }

    let projectsText = '';
    if (data.projects && data.projects.length > 0) {
      projectsText = data.projects.map(proj => 
        `- Project: ${proj.name}: ${proj.description}`
      ).join('\n');
    }

    const prompt = `You are an expert career coach, recruiter, and professional resume writer.
Generate a personalized, professional cover letter based on the candidate's resume information and the target job.

Requirements:
- Write a compelling, human-sounding cover letter.
- Length: 300–450 words.
- Keep a professional yet conversational tone.
- Do NOT sound AI-generated.
- Avoid clichés like "I am writing to express my interest..."
- Start with an engaging opening.
- Explain why the candidate is a strong fit.
- Highlight the most relevant experience and measurable achievements from their resume.
- Mention skills that match the job.
- End with a confident, polite closing and call to action.
- Use standard business letter formatting.
- Never invent experience, certifications, companies, or achievements.
- If some information is missing, gracefully omit it instead of making assumptions.
- Optimize naturally for ATS without keyword stuffing.
- Return ONLY the finished cover letter text (do not include markdown block markers like \`\`\` or extra conversational text).

Inputs:
Candidate Information:
Name: ${candidateName}
Email: ${email}
Phone: ${phone}
Location: ${location}
Skills: ${skillsList}
Experience:
${experienceText}
Education:
${educationText}
Projects:
${projectsText}

Job Position: ${jobPosition}
Company Name: ${companyName}
${additionalNotes ? `Additional Notes/Job Description: ${additionalNotes}` : ''}

Output:
Return only the finished cover letter.`;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      return response.text ? response.text.trim() : '';
    } catch (error) {
      console.error('Failed to generate cover letter:', error);
      throw error;
    }
  }


  uploadAndParseResume(file: File, onSuccess?: () => void) {
    this.isParsing.set(true);
    this.parseError.set(null);
    
    const formData = new FormData();
    formData.append('resume', file);
    
    this.http.post<any>('http://localhost:3000/api/parser/upload', formData).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.updateData(res.data);
          if (onSuccess) {
            onSuccess();
          }
        }
        this.isParsing.set(false);
      },
      error: (err) => {
        console.error('Failed to parse resume:', err);
        this.parseError.set(err?.error?.message || 'Failed to parse resume. Please try again.');
        this.isParsing.set(false);
      }
    });
  }

  private saveToLocalStorage(data: CVData) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('cv_builder_data', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }
  }

  private loadFromLocalStorage() {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('cv_builder_data');
      if (saved) {
        this.cvData.set(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load from local storage', e);
    }
  }
}
