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
  @Input() templateOverride?: TemplateType | string;
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
    if (this.isPreview) {
      return `${this.templateClass()} is-preview`;
    }
    const c = this.cvService.customization();
    return [
      this.templateClass(),
      `font-size-${c.bodyFontSize || 'medium'}`,
      `heading-size-${c.headingSize || 'medium'}`,
      `heading-${c.headingTransform || 'uppercase'}`,
      `heading-style-${c.headingStyle || 'simple'}`,
      `spacing-${c.sectionSpacing || 'normal'}`,
      `columns-${c.columns || 'one'}`,
      `layout-cols-${c.columns || 'one'}`,
      `entry-struct-${c.entryStructure || 'columns'}`,
      `entry-date-${c.entryDateLocationPosition || 'right'}`,
      `entry-subtitle-${c.entrySubtitlePlacement || 'below-title'}`,
      `photo-shape-${c.photoShape || 'circle'}`,
      `page-format-${(c.pageFormat || 'A4').toLowerCase().replace(/\s+/g, '-')}`
    ].join(' ');
  }

  getSectionOrder(sectionId: string): number {
    if (this.isPreview) {
      const defaults = ['summary', 'skills', 'experience', 'education', 'projects', 'languages'];
      const idx = defaults.indexOf(sectionId);
      return idx === -1 ? 99 : idx + 1;
    }
    const order = this.cvService.customization().sectionOrder;
    if (!order || !order.length) {
      const defaults = ['summary', 'skills', 'experience', 'education', 'projects', 'languages'];
      const idx = defaults.indexOf(sectionId);
      return idx === -1 ? 99 : idx + 1;
    }
    const idx = order.indexOf(sectionId);
    return idx === -1 ? 99 : idx + 1;
  }

  hasPageBreakBefore(sectionId: string): boolean {
    if (this.isPreview) return false;
    const order = this.cvService.customization().sectionOrder;
    if (!order) return false;
    const breakIdx = order.indexOf('pageBreak');
    if (breakIdx === -1) return false;
    const nextSectionId = order.slice(breakIdx + 1).find(id => id !== 'pageBreak');
    return nextSectionId === sectionId;
  }

  getNameFontFamily(): string {
    if (this.isPreview) return '';
    const nameFont = this.cvService.customization().nameFontFamily;
    if (!nameFont || nameFont === 'Same as body font') {
      return this.getFontFamily();
    }
    return this.getFontFamilyByName(nameFont);
  }

  getFontFamily(): string {
    if (this.isPreview) return '';
    const font = this.cvService.customization().fontFamily;
    return this.getFontFamilyByName(font);
  }

  getFontFamilyByName(font: string): string {
    switch (font) {
      case 'Alegreya': return "'Alegreya', serif";
      case 'Roboto': return "'Roboto', sans-serif";
      case 'Poppins': return "'Poppins', sans-serif";
      case 'Outfit': return "'Outfit', sans-serif";
      case 'Plus Jakarta Sans': return "'Plus Jakarta Sans', sans-serif";
      case 'Merriweather': return "'Merriweather', serif";
      case 'Playfair Display': return "'Playfair Display', serif";
      case 'Space Grotesk': return "'Space Grotesk', sans-serif";
      case 'Lora': return "'Lora', serif";
      case 'Montserrat': return "'Montserrat', sans-serif";
      case 'Open Sans': return "'Open Sans', sans-serif";
      case 'Lato': return "'Lato', sans-serif";
      case 'EB Garamond': return "'EB Garamond', serif";
      default: return "'Inter', sans-serif";
    }
  }

  getLineHeight(): string {
    if (this.isPreview) return '1.25';
    const lh = this.cvService.customization().lineHeight;
    if (typeof lh === 'number') return `${lh}`;
    if (lh === 'tight') return '1.15';
    if (lh === 'relaxed') return '1.75';
    if (lh === 'normal') return '1.4';
    return lh ? `${lh}` : '1.15';
  }

  hasFooter(): boolean {
    if (this.isPreview) return false;
    const c = this.cvService.customization();
    if (c.footerCustom) {
      return Boolean(c.footerLeft || c.footerCenter || c.footerRight);
    }
    return Boolean(c.footerPageNumbers || c.footerEmail || c.footerName || c.showPageNumbers);
  }

  getFooterLeft(): string {
    const c = this.cvService.customization();
    if (c.footerCustom) {
      return this.formatFooterText(c.footerLeft || '');
    }
    return c.footerName ? (this.displayData.fullName || '') : '';
  }

  getFooterCenter(): string {
    const c = this.cvService.customization();
    if (c.footerCustom) {
      return this.formatFooterText(c.footerCenter || '');
    }
    return c.footerEmail ? (this.displayData.email || '') : '';
  }

  getFooterRight(): string {
    const c = this.cvService.customization();
    if (c.footerCustom) {
      return this.formatFooterText(c.footerRight || '');
    }
    return (c.footerPageNumbers || c.showPageNumbers) ? '1 / 1' : '';
  }

  private formatFooterText(template: string): string {
    if (!template) return '';
    const d = this.displayData;
    return template
      .replace(/\{\{\s*name\s*\}\}/gi, d.fullName || '')
      .replace(/\{\{\s*phone\s*\}\}/gi, d.phone || '')
      .replace(/\{\{\s*email\s*\}\}/gi, d.email || '')
      .replace(/\{\{\s*page\s*\}\}/gi, '1')
      .replace(/\{\{\s*pages\s*\}\}/gi, '1');
  }
}
