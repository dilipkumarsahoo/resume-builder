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
    fullName: 'Jonathan Stevens',
    jobTitle: 'Senior Full Stack Architect',
    email: 'j.stevens@example.com',
    phone: '+1 (555) 000-1234',
    location: 'San Francisco, CA',
    summary: 'Expert Software Architect with over 10 years of experience in building high-scale distributed systems and beautiful, intuitive user interfaces. Proven track record of leading engineering teams and delivering cutting-edge SaaS solutions using React, Node.js, and cloud technologies.',
    skills: ['React/Angular', 'TypeScript', 'Node.js', 'AWS/GCP', 'PostgreSQL', 'Docker/K8s', 'System Design', 'Agile Leadership'],
    experience: [
      {
        id: '1',
        role: 'Principal Software Engineer',
        company: 'Global Tech Systems',
        startDate: 'Jan 2021',
        endDate: 'Present',
        description: 'Architected and launched a multi-tenant cloud platform serving 1M+ active users. Improved system reliability to 99.99% and reduced infrastructure costs by 30% through containerization.'
      },
      {
        id: '2',
        role: 'Senior Web Developer',
        company: 'Innovate Digital',
        startDate: 'Mar 2017',
        endDate: 'Dec 2020',
        description: 'Led the frontend migration from legacy systems to a modern React architecture. Mentored 12+ junior developers and established company-wide coding standards.'
      }
    ],
    education: [
      { id: '1', degree: 'MSc in Software Engineering', institution: 'Stanford University', year: '2017' },
      { id: '2', degree: 'BSc in Computer Science', institution: 'MIT', year: '2015' }
    ],
    projects: [
      { id: '1', name: 'AI Engine V2', description: 'Real-time natural language processing engine for automated customer support, processing 50k requests per minute.' },
      { id: '2', name: 'Open Source UI Library', description: 'Created a highly accessible component library used by over 500 developers globally.' }
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
}
