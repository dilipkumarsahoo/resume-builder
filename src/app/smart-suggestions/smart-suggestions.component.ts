import { Component, ElementRef, AfterViewInit, ViewChild, inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { animate, inView, stagger } from 'motion';
import { CvBuilderService } from '../cv-builder.service';

export interface AiComparisonItem {
  role: string;
  category: string;
  before: {
    text: string;
    score: number;
    issues: string[];
  };
  after: {
    text: string;
    score: number;
    improvements: string[];
  };
}

@Component({
  selector: 'app-smart-suggestions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './smart-suggestions.component.html',
  styleUrl: './smart-suggestions.component.css'
})
export class SmartSuggestionsComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  cvService = inject(CvBuilderService);

  @ViewChild('section') section!: ElementRef;
  @ViewChild('demoCard') demoCard!: ElementRef;

  selectedRoleIndex = signal<number>(0);
  isRewriting = signal<boolean>(false);

  comparisons: AiComparisonItem[] = [
    {
      role: 'Software Engineer',
      category: 'Engineering',
      before: {
        text: 'Responsible for writing code for website features and fixing bugs reported by QA.',
        score: 42,
        issues: ['Passive language', 'No quantifiable metrics', 'Lacks action verbs']
      },
      after: {
        text: 'Architected and shipped 14+ high-throughput microservices in TypeScript, reducing API latency by 43% and supporting 250k+ daily active users.',
        score: 98,
        improvements: ['High-impact action verbs', '+43% quantified latency win', 'ATS Keywords: Microservices, TypeScript']
      }
    },
    {
      role: 'Product Manager',
      category: 'Product',
      before: {
        text: 'Helped team launch new features and attended weekly sprint meetings with designers.',
        score: 48,
        issues: ['Vague responsibilities', 'No business outcomes', 'Weak leadership verbs']
      },
      after: {
        text: 'Spearheaded end-to-end launch of AI-powered search tool across 12 countries, boosting user activation by 34% and ARR by $1.8M in FY24.',
        score: 99,
        improvements: ['Direct ownership phrasing', '$1.8M ARR financial impact', 'Cross-functional leadership']
      }
    },
    {
      role: 'Marketing Lead',
      category: 'Growth',
      before: {
        text: 'Managed social media accounts and created digital advertising campaigns on Google.',
        score: 45,
        issues: ['Basic job description', 'No ROI or conversion data', 'Missing channel breadth']
      },
      after: {
        text: 'Scaled multi-channel performance marketing budget of $450K, driving a 165% YoY increase in qualified pipeline while lowering CAC by 28%.',
        score: 97,
        improvements: ['165% pipeline growth metric', '-28% CAC efficiency', 'Budget ownership ($450K)']
      }
    },
    {
      role: 'UX Designer',
      category: 'Design',
      before: {
        text: 'Created wireframes and user flows in Figma based on feedback from the client.',
        score: 50,
        issues: ['Task-oriented vs outcome-driven', 'No user research scale', 'Missing testing data']
      },
      after: {
        text: 'Redesigned core onboarding flow via 40+ usability interviews, increasing Day-7 retention from 18% to 41% and earning a 94 CSAT score.',
        score: 99,
        improvements: ['Quantified retention leap (18% → 41%)', 'Rigorous user research', '94 CSAT benchmark']
      }
    }
  ];

  selectRole(index: number) {
    if (this.selectedRoleIndex() === index) return;
    this.isRewriting.set(true);
    this.selectedRoleIndex.set(index);
    setTimeout(() => {
      this.isRewriting.set(false);
    }, 400);
  }

  triggerRewrite() {
    this.isRewriting.set(true);
    setTimeout(() => {
      this.isRewriting.set(false);
    }, 450);
  }

  startCreating() {
    this.cvService.openOnboarding();
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      inView(this.section.nativeElement, () => {
        const cards = this.section.nativeElement.querySelectorAll('.feature-card');
        animate(cards, { opacity: [0, 1], y: [30, 0] }, { delay: stagger(0.12), duration: 0.7, ease: [0.22, 1, 0.36, 1] });
      }, { margin: "-80px" });
    }
  }
}
