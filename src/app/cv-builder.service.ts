import { Injectable, signal } from '@angular/core';
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

@Injectable({ providedIn: 'root' })
export class CvBuilderService {
  isModalOpen = signal(false);
  isOnboardingOpen = signal(false);
  onboardingStep = signal(1);
  selectedTemplate = signal<TemplateType>('modern');
  isImprovingSummary = signal(false);
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
  }

  openModal(template?: TemplateType) {
    if (template) {
      this.selectedTemplate.set(template);
    }
    this.isModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  openOnboarding() {
    this.isOnboardingOpen.set(true);
    this.onboardingStep.set(1);
    document.body.style.overflow = 'hidden';
  }

  closeOnboarding() {
    this.isOnboardingOpen.set(false);
    document.body.style.overflow = 'auto';
  }

  closeModal() {
    this.isModalOpen.set(false);
    document.body.style.overflow = '';
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
