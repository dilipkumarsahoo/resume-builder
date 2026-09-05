import { Component, ElementRef, AfterViewInit, ViewChild, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { animate, stagger } from 'motion';
import { CvBuilderService } from '../cv-builder.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  cvService = inject(CvBuilderService);
  @ViewChild('heroContent') heroContent!: ElementRef;
  @ViewChild('heroMockup') heroMockup!: ElementRef;

  activeTab: 'resume' | 'coverLetter' = 'resume';

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        if (this.heroContent?.nativeElement) {
          const items = this.heroContent.nativeElement.querySelectorAll('.hero-anim');
          if (items.length) {
            animate(items,
              { opacity: [0.3, 1], y: [16, 0] },
              { delay: stagger(0.08), duration: 0.7, ease: [0.22, 1, 0.36, 1] }
            );
          }
        }

        if (this.heroMockup?.nativeElement) {
          animate(this.heroMockup.nativeElement,
            { opacity: [0.5, 1], y: [20, 0] },
            { duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }
          );
        }
      }, 100);
    }
  }

  setTab(tab: 'resume' | 'coverLetter') {
    this.activeTab = tab;
  }
}
