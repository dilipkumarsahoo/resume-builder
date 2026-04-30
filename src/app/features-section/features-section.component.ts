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
  @ViewChild('previewBox') previewBox!: ElementRef;
  @ViewChild('featuresList') featuresList!: ElementRef;

  activeFeature = signal(0);

  features = [
    { title: 'Pre-written content', desc: 'Stuck on what to write? Use our pre-written phrases tailored to your industry and role.' },
    { title: '40+ click & ready CV templates', desc: 'Use our recommendations or pick your own. All templates are recruiter-approved and guaranteed to pass applicant tracking systems (ATS).' },
    { title: 'Expert tips & guidance', desc: 'Get step-by-step guidance from career experts as you build your CV to ensure it stands out.' }
  ];

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      inView(this.section.nativeElement, () => {
        animate(this.previewBox.nativeElement, { opacity: [0, 1], x: [-40, 0] }, { duration: 0.8, ease: [0.22, 1, 0.36, 1] });
        
        const items = this.featuresList.nativeElement.querySelectorAll('.feature-item');
        animate(items, { opacity: [0, 1], x: [40, 0] }, { delay: stagger(0.15), duration: 0.8, ease: [0.22, 1, 0.36, 1] });
      }, { margin: "-100px" });
    }
  }
}
