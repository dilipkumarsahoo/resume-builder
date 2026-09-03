import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CvBuilderService, TemplateType } from '../cv-builder.service';
import { CvPreviewComponent } from '../cv-preview/cv-preview.component';

export type CustomizeSection = 
  | 'document'
  | 'templates'
  | 'layout'
  | 'fontSize'
  | 'spacing'
  | 'entries'
  | 'headings'
  | 'font'
  | 'colors'
  | 'header'
  | 'photo'
  | 'links'
  | 'footer';

@Component({
  selector: 'app-cv-customize',
  standalone: true,
  imports: [CommonModule, FormsModule, CvPreviewComponent],
  templateUrl: './cv-customize.component.html',
  styleUrl: './cv-customize.component.css'
})
export class CvCustomizeComponent {
  cvService = inject(CvBuilderService);
  activeSection = signal<CustomizeSection>('document');

  // Nav items matching FlowCV
  navItems: { id: CustomizeSection; label: string }[] = [
    { id: 'document', label: 'Document' },
    { id: 'templates', label: 'Templates' },
    { id: 'layout', label: 'Layout' },
    { id: 'fontSize', label: 'Font Size' },
    { id: 'spacing', label: 'Spacing' },
    { id: 'entries', label: 'Entries' },
    { id: 'headings', label: 'Headings' },
    { id: 'font', label: 'Font' },
    { id: 'colors', label: 'Colors' },
    { id: 'header', label: 'Header' },
    { id: 'photo', label: 'Photo' },
    { id: 'links', label: 'Links' },
    { id: 'footer', label: 'Footer' }
  ];

  // Document options
  languages = [
    'English (UK)',
    'English (US)',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Hindi',
    'Dutch',
    'Polish',
    'Japanese',
    'Chinese'
  ];

  dateFormats = [
    'DD/MM/YYYY',
    'MM/DD/YYYY',
    'YYYY/MM/DD',
    'Month YYYY',
    'MM/YYYY',
    'YYYY'
  ];

  pageFormats: ('A4' | 'US Letter')[] = ['A4', 'US Letter'];

  // Font Size Stepped Controls (matching FlowCV pt scale)
  baseFontSteps = [9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5];
  nameFontSteps = [5, 7, 9, 11, 13, 15, 17, 19];
  headingsFontSteps = [0, 1, 2, 3, 4, 5, 6, 7];
  entryHeaderSteps = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5];

  setBaseFontPt(val: number) {
    this.cvService.updateCustomization({ baseFontPt: val });
  }

  stepBaseFont(delta: number) {
    const current = this.cvService.customization().baseFontPt || 10.5;
    const idx = this.baseFontSteps.indexOf(current);
    if (idx !== -1) {
      const nextIdx = Math.max(0, Math.min(this.baseFontSteps.length - 1, idx + delta));
      this.setBaseFontPt(this.baseFontSteps[nextIdx]);
    } else {
      this.setBaseFontPt(10.5);
    }
  }

  setNameFontPt(val: number) {
    this.cvService.updateCustomization({ nameFontPt: val });
  }

  stepNameFont(delta: number) {
    const current = this.cvService.customization().nameFontPt || 11;
    const idx = this.nameFontSteps.indexOf(current);
    if (idx !== -1) {
      const nextIdx = Math.max(0, Math.min(this.nameFontSteps.length - 1, idx + delta));
      this.setNameFontPt(this.nameFontSteps[nextIdx]);
    } else {
      this.setNameFontPt(11);
    }
  }

  setHeadingsFontPt(val: number) {
    this.cvService.updateCustomization({ headingsFontPt: val });
  }

  stepHeadingsFont(delta: number) {
    const current = this.cvService.customization().headingsFontPt || 3;
    const idx = this.headingsFontSteps.indexOf(current);
    if (idx !== -1) {
      const nextIdx = Math.max(0, Math.min(this.headingsFontSteps.length - 1, idx + delta));
      this.setHeadingsFontPt(this.headingsFontSteps[nextIdx]);
    } else {
      this.setHeadingsFontPt(3);
    }
  }

  setEntryHeaderFontPt(val: number) {
    this.cvService.updateCustomization({ entryHeaderFontPt: val });
  }

  stepEntryHeaderFont(delta: number) {
    const current = this.cvService.customization().entryHeaderFontPt || 0;
    const idx = this.entryHeaderSteps.indexOf(current);
    if (idx !== -1) {
      const nextIdx = Math.max(0, Math.min(this.entryHeaderSteps.length - 1, idx + delta));
      this.setEntryHeaderFontPt(this.entryHeaderSteps[nextIdx]);
    } else {
      this.setEntryHeaderFontPt(0);
    }
  }

  // Font options
  fontFamilies = [
    { name: 'Inter', type: 'Sans-Serif', family: "'Inter', sans-serif" },
    { name: 'Roboto', type: 'Sans-Serif', family: "'Roboto', sans-serif" },
    { name: 'Poppins', type: 'Modern Sans', family: "'Poppins', sans-serif" },
    { name: 'Outfit', type: 'Geometric Sans', family: "'Outfit', sans-serif" },
    { name: 'Plus Jakarta Sans', type: 'Clean Sans', family: "'Plus Jakarta Sans', sans-serif" },
    { name: 'Merriweather', type: 'Classic Serif', family: "'Merriweather', serif" },
    { name: 'Playfair Display', type: 'Editorial Serif', family: "'Playfair Display', serif" },
    { name: 'Space Grotesk', type: 'Tech & Mono', family: "'Space Grotesk', sans-serif" }
  ];

  // Color palette presets
  colorPresets = [
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Indigo', hex: '#6366f1' },
    { name: 'Royal Blue', hex: '#2563eb' },
    { name: 'Teal', hex: '#0d9488' },
    { name: 'Purple', hex: '#8b5cf6' },
    { name: 'Rose', hex: '#f43f5e' },
    { name: 'Slate Dark', hex: '#0f172a' },
    { name: 'Amber', hex: '#d97706' },
    { name: 'Cyan', hex: '#06b6d4' },
    { name: 'Crimson', hex: '#dc2626' }
  ];

  // Templates list for quick switcher
  templatesList: { id: TemplateType; name: string }[] = [
    { id: 'minimal', name: 'Modern Minimal' },
    { id: 'modern', name: 'Creative Edge' },
    { id: 'professional', name: 'Corporate Pro' },
    { id: 'creative', name: 'Design Studio' },
    { id: 'corporate', name: 'Executive Suite' },
    { id: 'tech', name: 'Silicon Valley' },
    { id: 'bold', name: 'Bold Statement' },
    { id: 'elegant', name: 'Elegant Serif' },
    { id: 'executive', name: 'Leadership' },
    { id: 'fresher', name: 'Early Career' },
    { id: 'designer', name: 'Portfolio Plus' },
    { id: 'compact', name: 'Dense Info' },
    { id: 'sidebar-dark', name: 'Midnight Pro' },
    { id: 'banner', name: 'Hero Header' },
    { id: 'timeline', name: 'History View' },
    { id: 'bubble', name: 'Playful UI' },
    { id: 'classic-ats', name: 'ATS Scanner' },
    { id: 'startup', name: 'Fast Track' }
  ];

  scrollToSection(sectionId: CustomizeSection) {
    this.activeSection.set(sectionId);
    const element = document.getElementById('card-' + sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  setLanguage(lang: string) {
    this.cvService.updateCustomization({ language: lang });
  }

  setDateFormat(format: string) {
    this.cvService.updateCustomization({ dateFormat: format });
  }

  setPageFormat(format: 'A4' | 'US Letter') {
    this.cvService.updateCustomization({ pageFormat: format });
  }

  setColumns(cols: 'one' | 'two' | 'mix') {
    this.cvService.updateCustomization({ columns: cols });
  }

  setFontFamily(family: string) {
    this.cvService.updateCustomization({ fontFamily: family });
  }

  setBodyFontSize(size: 'small' | 'medium' | 'large') {
    this.cvService.updateCustomization({ bodyFontSize: size });
  }

  setHeadingSize(size: 'small' | 'medium' | 'large') {
    this.cvService.updateCustomization({ headingSize: size });
  }

  setLineHeight(lh: 'tight' | 'normal' | 'relaxed') {
    this.cvService.updateCustomization({ lineHeight: lh });
  }

  setSectionSpacing(sp: 'compact' | 'normal' | 'spacious') {
    this.cvService.updateCustomization({ sectionSpacing: sp });
  }

  setColor(hex: string) {
    this.cvService.updateCustomization({ primaryColor: hex });
  }

  setHeadingStyle(style: 'simple' | 'underlined' | 'pill' | 'accent-left') {
    this.cvService.updateCustomization({ headingStyle: style });
  }

  setHeadingTransform(tr: 'none' | 'uppercase' | 'capitalize') {
    this.cvService.updateCustomization({ headingTransform: tr });
  }

  setHeaderAlignment(align: 'left' | 'center' | 'banner') {
    this.cvService.updateCustomization({ headerAlignment: align });
  }

  setPhotoShape(shape: 'circle' | 'rounded' | 'square') {
    this.cvService.updateCustomization({ photoShape: shape });
  }

  setPhotoSize(size: 'small' | 'medium' | 'large') {
    this.cvService.updateCustomization({ photoSize: size });
  }

  togglePhoto(show: boolean) {
    this.cvService.updateCustomization({ showPhoto: show });
  }

  toggleIcons(show: boolean) {
    this.cvService.updateCustomization({ showIcons: show });
  }

  toggleUnderlineLinks(underline: boolean) {
    this.cvService.updateCustomization({ underlineLinks: underline });
  }

  togglePageNumbers(show: boolean) {
    this.cvService.updateCustomization({ showPageNumbers: show });
  }

  selectTemplate(templateId: TemplateType) {
    this.cvService.selectedTemplate.set(templateId);
  }

  openTemplatesBrowser() {
    this.cvService.openResumeTemplates();
  }
}
