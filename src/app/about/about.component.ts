import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CvBuilderService } from '../cv-builder.service';

export interface CommunityReview {
  name: string;
  role: string;
  avatar: string;
  quote: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  cvService = inject(CvBuilderService);
  private router = inject(Router);

  openFaqIndex = signal<number | null>(0);
  reviewPage = signal<number>(0);
  showAllReviewsModal = signal<boolean>(false);

  allReviewPages: CommunityReview[][] = [
    [
      {
        name: 'Leslie Alexander',
        role: 'Graphic Designer',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
        quote: 'From start to finish, it was an excellent experience for us, so we definitely plan to use them again.'
      },
      {
        name: 'Darlene Robertson',
        role: 'Project Manager',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        quote: 'GlowCV transformed how I present my experience. The automated formatting saved me hours of stress and landed me 3 interviews in a week.'
      },
      {
        name: 'Eleanor Pena',
        role: 'UX Designer',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
        quote: 'We were impressed with how well GlowCV collaborated with us to craft the perfect portfolio resume.'
      },
      {
        name: 'Devon Lane',
        role: 'Sales Executive',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        quote: 'They were very professional with easy communication and clean automated ATS formatting.'
      },
      {
        name: 'Floyd Miles',
        role: 'HR Professional',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        quote: 'They took my resume without any friction and formatted it very well while adding modern style to it.'
      },
      {
        name: 'Cameron Williamson',
        role: 'Visual Designer',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
        quote: 'The team was very responsive and easy to work with. The resume templates are modern and unmatched.'
      }
    ],
    [
      {
        name: 'Sarah Jenkins',
        role: 'Frontend Engineer',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
        quote: 'The AI suggestions helped transform my bullet points from boring job duties into measurable, impact-driven statements.'
      },
      {
        name: 'Marcus Chen',
        role: 'Product Designer',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
        quote: 'As a designer, I am extremely particular about typography and visual hierarchy. The modern templates are pixel-perfect.'
      },
      {
        name: 'Elena Rostova',
        role: 'Full-Stack Developer',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
        quote: 'After applying the AI optimization and tailoring my resume per job role, my interview response rate skyrocketed.'
      },
      {
        name: 'David Larson',
        role: 'Growth Marketing Lead',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
        quote: 'The tailored cover letter generator combined with the matching resume design gave my application an executive polish.'
      },
      {
        name: 'Priya Patel',
        role: 'Data Scientist',
        avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=120&auto=format&fit=crop&q=80',
        quote: 'Summarizing complex machine learning models onto a crisp single-page resume was easy with the smart formatting assistant.'
      },
      {
        name: 'Alexandre Dubois',
        role: 'Engineering Manager',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
        quote: 'I recommend this tool to all engineers I mentor. Fast, clean PDF exports with instantaneous ATS validation.'
      }
    ]
  ];

  faqs = [
    {
      q: 'Is GlowCV really free to use?',
      a: 'Yes! Your first professional resume is 100% free forever with unlimited downloads in high-resolution PDF format without watermarks or hidden charges.'
    },
    {
      q: 'What makes GlowCV resumes ATS-friendly?',
      a: 'All our templates follow strict ATS formatting standards: machine-readable vector typography, clean semantic column structures, and standard headings that applicant tracking systems parse seamlessly.'
    },
    {
      q: 'Can I generate cover letters as well?',
      a: 'Yes! GlowCV includes an integrated AI Cover Letter builder that pairs seamlessly with your resume template for consistent job applications.'
    },
    {
      q: 'How does the AI writing assistant help me?',
      a: 'Our AI analyzes your job title and industry to generate tailored, impactful bullet points with quantified results and strong action verbs.'
    }
  ];

  nextReviewPage() {
    if (this.reviewPage() < this.allReviewPages.length - 1) {
      this.reviewPage.update(p => p + 1);
    } else {
      this.reviewPage.set(0);
    }
  }

  prevReviewPage() {
    if (this.reviewPage() > 0) {
      this.reviewPage.update(p => p - 1);
    } else {
      this.reviewPage.set(this.allReviewPages.length - 1);
    }
  }

  toggleFaq(index: number) {
    if (this.openFaqIndex() === index) {
      this.openFaqIndex.set(null);
    } else {
      this.openFaqIndex.set(index);
    }
  }

  startBuilding() {
    this.cvService.openOnboarding();
  }
}
