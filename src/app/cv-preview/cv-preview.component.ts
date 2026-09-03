import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvBuilderService, TemplateType } from '../cv-builder.service';

@Component({
  selector: 'app-cv-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cv-preview.component.html',
  styleUrl: './cv-preview.component.css'
})
export class CvPreviewComponent {
  cvService = inject(CvBuilderService);
  @Input() templateOverride?: TemplateType;
  @Input() isPreview: boolean = false;

  // Professional Dummy Data for Previews
  dummyData = {
    fullName: 'Camila Rivera',
    jobTitle: 'Sales Manager',
    email: 'camila.rivera@email.com',
    phone: '+1 305 555 0184',
    location: 'Miami, United States',

    summary: `Results-driven sales professional with 6+ years of experience in account growth, client relationship management, and pipeline development across B2B environments. Strong track record of improving conversion rates, supporting revenue targets, and building trust with diverse customer groups in English- and Spanish-speaking markets. Brings a practical, people-focused approach to sales planning, team coordination, and long-term customer retention.`,

    skills: [
      'Account Management',
      'CRM Management',
      'Sales Forecasting',
      'Negotiation',
      'Client Retention',
      'Pipeline Development'
    ],

    experience: [
      {
        id: '1',
        role: 'Sales Manager',
        company: 'BrightPath Business Solutions',
        startDate: '01/2023',
        endDate: 'Present',
        description: `Manage a portfolio of mid-market clients across retail and service sectors. Lead quarterly sales planning and improved team conversion rates by 14%. Build strong client relationships that increased renewals and upsell opportunities.`
      },
      {
        id: '2',
        role: 'Account Manager',
        company: 'Horizon Office Supply',
        startDate: '03/2020',
        endDate: '12/2022',
        description: `Owned inbound and outbound sales activity for regional business accounts. Delivered tailored product proposals and consistently exceeded revenue goals. Coordinated with operations teams to improve customer satisfaction.`
      },
      {
        id: '3',
        role: 'Sales Coordinator',
        company: 'SunPeak Telecom',
        startDate: '06/2018',
        endDate: '02/2020',
        description: `Supported account executives with lead tracking, reporting, and proposal preparation. Contributed to pipeline organization and improved follow-up consistency.`
      }
    ],

    education: [
      {
        id: '1',
        degree: 'Bachelor of Business Administration',
        institution: 'Florida International University',
        year: '2018'
      },
      {
        id: '2',
        degree: 'Associate Degree in Marketing',
        institution: 'Miami Dade College',
        year: '2014'
      }
    ],

    projects: [
      {
        id: '1',
        name: 'Regional Growth Initiative',
        description: 'Developed account expansion strategies that increased customer retention and annual recurring revenue.'
      },
      {
        id: '2',
        name: 'CRM Optimization Program',
        description: 'Improved sales tracking workflows and reporting accuracy through CRM process enhancements.'
      }
    ],

    languages: [
      {
        name: 'English',
        level: 5
      },
      {
        name: 'Spanish',
        level: 4
      }
    ]
  };

  get displayData() {
    return this.isPreview ? this.dummyData : this.cvService.cvData();
  }

  currentTemplate() {
    const t = this.templateOverride || this.cvService.selectedTemplate();
    return t;
  }

  templateClass() {
    return `${this.currentTemplate()}-template`;
  }

  customizationClasses() {
    const c = this.cvService.customization();
    return [
      this.templateClass(),
      `font-size-${c.bodyFontSize || 'medium'}`,
      `heading-size-${c.headingSize || 'medium'}`,
      `heading-${c.headingTransform || 'uppercase'}`,
      `heading-style-${c.headingStyle || 'simple'}`,
      `spacing-${c.sectionSpacing || 'normal'}`,
      `photo-shape-${c.photoShape || 'circle'}`,
      `page-format-${(c.pageFormat || 'A4').toLowerCase().replace(/\s+/g, '-')}`
    ].join(' ');
  }

  getFontFamily(): string {
    const font = this.cvService.customization().fontFamily;
    switch (font) {
      case 'Roboto': return "'Roboto', sans-serif";
      case 'Poppins': return "'Poppins', sans-serif";
      case 'Outfit': return "'Outfit', sans-serif";
      case 'Plus Jakarta Sans': return "'Plus Jakarta Sans', sans-serif";
      case 'Merriweather': return "'Merriweather', serif";
      case 'Playfair Display': return "'Playfair Display', serif";
      case 'Space Grotesk': return "'Space Grotesk', sans-serif";
      default: return "'Inter', sans-serif";
    }
  }

  getLineHeight(): string {
    const lh = this.cvService.customization().lineHeight;
    if (lh === 'tight') return '1.25';
    if (lh === 'relaxed') return '1.75';
    return '1.5';
  }
}
