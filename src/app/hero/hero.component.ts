import { Component, ElementRef, AfterViewInit, ViewChild, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { animate, stagger } from 'motion';
import { CvBuilderService } from '../cv-builder.service';
import { CvPreviewComponent } from '../cv-preview/cv-preview.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CvPreviewComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  cvService = inject(CvBuilderService);
  @ViewChild('heroText') heroText!: ElementRef;
  @ViewChild('heroImage') heroImage!: ElementRef;

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Wait for loader to finish before animating hero
      setTimeout(() => {
        const items = this.heroText.nativeElement.querySelectorAll('.hero-item');
        animate(items,
          { opacity: [0, 1], y: [20, 0] },
          { delay: stagger(0.1), duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        );

        animate(this.heroImage.nativeElement,
          { opacity: [0, 1], x: [30, 0], y: [0, 0] },
          { duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }
        );
      }, 1800);
    }
  }
}
