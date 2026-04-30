import { Component, ElementRef, AfterViewInit, ViewChild, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { animate, inView, stagger } from 'motion';

@Component({
  selector: 'app-smart-suggestions',
  standalone: true,
  templateUrl: './smart-suggestions.component.html',
  styleUrl: './smart-suggestions.component.css'
})
export class SmartSuggestionsComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  @ViewChild('section') section!: ElementRef;

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      inView(this.section.nativeElement, () => {
        const cards = this.section.nativeElement.querySelectorAll('.suggestion-card');
        animate(cards, { opacity: [0, 1], y: [40, 0] }, { delay: stagger(0.2), duration: 0.8, ease: [0.22, 1, 0.36, 1] });
      }, { margin: "-100px" });
    }
  }
}
