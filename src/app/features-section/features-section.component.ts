import { Component, ElementRef, AfterViewInit, ViewChild, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { animate, inView, stagger } from 'motion';
import { CommonModule } from '@angular/common';
import { CvBuilderService } from '../cv-builder.service';

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features-section.component.html',
  styleUrl: './features-section.component.css'
})
export class FeaturesSectionComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  cvService = inject(CvBuilderService);
  @ViewChild('section') section!: ElementRef;
  @ViewChild('leftCol') leftCol!: ElementRef;
  @ViewChild('rightCol') rightCol!: ElementRef;

  activeFeature = signal(0);

  features = [
    {
      num: '01',
      title: 'Easy edit online',
      desc: 'Easily customize and update every section with real-time live preview and drag-and-drop simplicity.'
    },
    {
      num: '02',
      title: 'Add AI pre-written phrases',
      desc: 'Generate tailored summary statements and role-specific bullet points powered by cutting-edge AI.'
    },
    {
      num: '03',
      title: 'Automatic spell-checker',
      desc: 'Catch typos, grammar mistakes, and passive tone instantly to ensure flawless recruiter submissions.'
    },
    {
      num: '04',
      title: 'Export to any format',
      desc: 'Download your finished resume in PDF, DOCX, or share via a personalized live web link.'
    }
  ];

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      inView(this.section.nativeElement, () => {
        if (this.leftCol?.nativeElement) {
          const items = this.leftCol.nativeElement.querySelectorAll('.feature-step-item');
          animate(items, { opacity: [0, 1], y: [20, 0] }, { delay: stagger(0.1), duration: 0.7, ease: [0.22, 1, 0.36, 1] });
        }

        if (this.rightCol?.nativeElement) {
          animate(this.rightCol.nativeElement, { opacity: [0, 1], scale: [0.96, 1], y: [20, 0] }, { duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] });
        }
      }, { margin: "-80px" });
    }
  }

  selectFeature(index: number) {
    this.activeFeature.set(index);
  }
}
