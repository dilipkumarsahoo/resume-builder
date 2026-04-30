import { Component, ElementRef, AfterViewInit, ViewChild, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { animate, stagger } from 'motion';
import { CvBuilderService } from '../cv-builder.service';

@Component({
  selector: 'app-hero',
  standalone: true,
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
          { opacity: [0, 1], x: [40, 0], y: [40, 0] },
          { duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }
        );

        // Floating animation for the image
        animate(this.heroImage.nativeElement,
          { y: [-10, 10] },
          { duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }
        );
      }, 1800);
    }
  }
}
