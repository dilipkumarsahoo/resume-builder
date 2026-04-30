import { Component, ElementRef, AfterViewInit, ViewChild, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { animate, inView, stagger } from 'motion';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  @ViewChild('section') section!: ElementRef;
  @ViewChild('trustBadge') trustBadge!: ElementRef;
  @ViewChild('heading') heading!: ElementRef;
  @ViewChild('subheading') subheading!: ElementRef;
  @ViewChild('photoGrid') photoGrid!: ElementRef;

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      inView(this.section.nativeElement, () => {
        animate([this.trustBadge.nativeElement, this.heading.nativeElement, this.subheading.nativeElement], 
          { opacity: [0, 1], y: [20, 0] }, 
          { delay: stagger(0.1), duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        );

        const photos = this.photoGrid.nativeElement.querySelectorAll('.photo-item');
        animate(photos, 
          { opacity: [0, 1], scale: [0.9, 1] }, 
          { delay: stagger(0.05, { startDelay: 0.4 }), duration: 0.6, ease: "easeOut" }
        );
      }, { margin: "-100px" });
    }
  }
}
