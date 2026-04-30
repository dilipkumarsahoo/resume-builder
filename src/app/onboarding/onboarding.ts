import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvBuilderService, TemplateType } from '../cv-builder.service';
import { CvPreviewComponent } from '../cv-preview/cv-preview.component';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, CvPreviewComponent],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.css'
})
export class OnboardingComponent {
  cvService = inject(CvBuilderService);
  isUploading = signal(false);
  selectedTemplateId = signal<TemplateType | null>(null);

  // 18 Professional Templates with Metadata and Fixed Previews
  templates: { id: TemplateType, name: string, category: string, preview: string }[] = [
    { id: 'minimal', name: 'Modern Minimal', category: 'Minimal', preview: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=400' },
    { id: 'modern', name: 'Creative Edge', category: 'Creative', preview: 'https://images.unsplash.com/photo-1626197031507-c17099753214?q=80&w=400' },
    { id: 'professional', name: 'Corporate Pro', category: 'Corporate', preview: 'https://images.unsplash.com/photo-1512485694743-9c9538b4e6e0?q=80&w=400' },
    { id: 'creative', name: 'Design Studio', category: 'Creative', preview: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=400' },
    { id: 'corporate', name: 'Executive Suite', category: 'Corporate', preview: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400' },
    { id: 'tech', name: 'Silicon Valley', category: 'Tech', preview: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400' },
    { id: 'bold', name: 'Bold Statement', category: 'Creative', preview: 'https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=400' },
    { id: 'elegant', name: 'Elegant Serif', category: 'Minimal', preview: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?q=80&w=400' },
    { id: 'executive', name: 'Leadership', category: 'Corporate', preview: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=400' },
    { id: 'fresher', name: 'Early Career', category: 'Minimal', preview: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=400' },
    { id: 'designer', name: 'Portfolio Plus', category: 'Creative', preview: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=400' },
    { id: 'compact', name: 'Dense Info', category: 'Minimal', preview: 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=400' },
    { id: 'sidebar-dark', name: 'Midnight Pro', category: 'Corporate', preview: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=400' },
    { id: 'banner', name: 'Hero Header', category: 'Creative', preview: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400' },
    { id: 'timeline', name: 'History View', category: 'Tech', preview: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=400' },
    { id: 'bubble', name: 'Playful UI', category: 'Creative', preview: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=400' },
    { id: 'classic-ats', name: 'ATS Scanner', category: 'Corporate', preview: 'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?q=80&w=400' },
    { id: 'startup', name: 'Fast Track', category: 'Tech', preview: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=400' }
  ];

  constructor() {
    console.log("Total templates loaded:", this.templates.length);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.isUploading.set(true);
      setTimeout(() => {
        this.isUploading.set(false);
        this.nextStep();
      }, 1500);
    }
  }

  nextStep() {
    const current = this.cvService.onboardingStep();
    if (current < 4) {
      this.cvService.onboardingStep.set(current + 1);
    }
  }

  selectTemplate(id: TemplateType) {
    this.selectedTemplateId.set(id);
  }

  useTemplate(id: TemplateType) {
    this.cvService.selectedTemplate.set(id);
    this.skipToForm();
  }

  skipToForm() {
    this.cvService.closeOnboarding();
    this.cvService.openModal();
  }
}
