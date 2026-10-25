import { Component, ElementRef, AfterViewInit, ViewChild, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { animate, inView, stagger } from 'motion';

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  initials: string;
  gradient: string;
  rating: number;
  highlight: string;
  quote: string;
  tag: string;
  timeAgo: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  @ViewChild('section') section!: ElementRef;
  @ViewChild('trustBadge') trustBadge!: ElementRef;
  @ViewChild('heading') heading!: ElementRef;
  @ViewChild('subheading') subheading!: ElementRef;
  @ViewChild('cardsGrid') cardsGrid!: ElementRef;

  testimonials: Testimonial[] = [
    {
      name: 'Sarah Jenkins',
      role: 'Senior Frontend Engineer',
      company: 'Spotify',
      initials: 'SJ',
      gradient: 'from-emerald-500 to-teal-600',
      rating: 5,
      highlight: 'Landed 4 interviews within 2 weeks',
      quote: 'The AI suggestions helped transform my bullet points from boring job duties into measurable, impact-driven statements. The ATS checker showed me exactly which keywords were missing.',
      tag: 'ATS Score 98%',
      timeAgo: '2 days ago'
    },
    {
      name: 'Marcus Chen',
      role: 'Product Designer',
      company: 'Stripe',
      initials: 'MC',
      gradient: 'from-blue-500 to-indigo-600',
      rating: 5,
      highlight: 'The cleanest typography & layout',
      quote: 'As a designer, I am extremely particular about typography and visual hierarchy. The modern templates are pixel-perfect and exported seamlessly without breaking layout or alignment.',
      tag: 'Pixel-Perfect Design',
      timeAgo: '1 week ago'
    },
    {
      name: 'Elena Rostova',
      role: 'Full-Stack Developer',
      company: 'Canva',
      initials: 'ER',
      gradient: 'from-purple-500 to-pink-600',
      rating: 5,
      highlight: 'Doubled my callback rate immediately',
      quote: 'I was struggling to get past automated screening systems. After applying the AI optimization and tailoring my resume per job role, my response rate skyrocketed.',
      tag: 'AI Bullet Optimizer',
      timeAgo: '3 days ago'
    },
    {
      name: 'David Larson',
      role: 'Growth Marketing Lead',
      company: 'Notion',
      initials: 'DL',
      gradient: 'from-amber-500 to-orange-600',
      rating: 5,
      highlight: 'From application to offer in 18 days',
      quote: 'The tailored cover letter generator combined with the matching resume design gave my application a truly executive polish. Highly recommended for anyone job hunting!',
      tag: 'Cover Letter AI',
      timeAgo: '5 days ago'
    },
    {
      name: 'Priya Patel',
      role: 'Data Scientist',
      company: 'Microsoft',
      initials: 'PP',
      gradient: 'from-cyan-500 to-blue-600',
      rating: 5,
      highlight: 'Turned technical jargon into impact',
      quote: 'Summarizing complex machine learning architectures onto a crisp single-page resume was tricky. The smart assistant helped highlight my quantifiable business ROI effortlessly.',
      tag: 'Smart Suggestions',
      timeAgo: '1 week ago'
    },
    {
      name: 'Alexandre Dubois',
      role: 'Engineering Manager',
      company: 'Revolut',
      initials: 'AD',
      gradient: 'from-rose-500 to-red-600',
      rating: 5,
      highlight: 'Essential tool for any serious applicant',
      quote: 'I recommend this tool to all engineers I mentor. The real-time interactive preview, clean PDF export, and instantaneous ATS scoring eliminate hours of tedious formatting.',
      tag: 'Fast PDF Export',
      timeAgo: '2 weeks ago'
    }
  ];

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      inView(this.section.nativeElement, () => {
        animate([this.trustBadge.nativeElement, this.heading.nativeElement, this.subheading.nativeElement], 
          { opacity: [0, 1], y: [20, 0] }, 
          { delay: stagger(0.1), duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        );

        if (this.cardsGrid) {
          const cards = this.cardsGrid.nativeElement.querySelectorAll('.testimonial-card');
          animate(cards, 
            { opacity: [0, 1], y: [30, 0] }, 
            { delay: stagger(0.08, { startDelay: 0.3 }), duration: 0.6, ease: [0.22, 1, 0.36, 1] }
          );
        }
      }, { margin: "-100px" });
    }
  }
}
