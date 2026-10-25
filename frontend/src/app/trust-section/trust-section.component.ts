import { Component, ElementRef, AfterViewInit, ViewChild, inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { animate, inView, stagger } from 'motion';

@Component({
  selector: 'app-trust-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trust-section.component.html',
  styleUrl: './trust-section.component.css'
})
export class TrustSectionComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  @ViewChild('trustSection') section!: ElementRef;
  @ViewChild('statGrid') statGrid!: ElementRef;
  @ViewChild('counter1') counter1!: ElementRef;
  @ViewChild('counter2') counter2!: ElementRef;
  @ViewChild('counter3') counter3!: ElementRef;
  @ViewChild('counter4') counter4!: ElementRef;

  companies = [
    { name: 'Google', icon: 'google' },
    { name: 'Microsoft', icon: 'microsoft' },
    { name: 'Amazon', icon: 'amazon' },
    { name: 'Spotify', icon: 'spotify' },
    { name: 'Stripe', icon: 'stripe' },
    { name: 'Canva', icon: 'canva' },
    { name: 'Airbnb', icon: 'airbnb' }
  ];

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      inView(this.section.nativeElement, () => {
        // Animate counter 1 (88%)
        if (this.counter1) {
          animate(0, 88, {
            duration: 1.8,
            ease: "easeOut",
            onUpdate: (latest) => {
              this.counter1.nativeElement.textContent = Math.round(latest).toString();
            }
          });
        }

        // Animate counter 2 (3.2x)
        if (this.counter2) {
          animate(0, 3.2, {
            duration: 1.8,
            ease: "easeOut",
            onUpdate: (latest) => {
              this.counter2.nativeElement.textContent = latest.toFixed(1);
            }
          });
        }

        // Animate counter 3 (99.4%)
        if (this.counter3) {
          animate(0, 99.4, {
            duration: 1.8,
            ease: "easeOut",
            onUpdate: (latest) => {
              this.counter3.nativeElement.textContent = latest.toFixed(1);
            }
          });
        }

        // Animate counter 4 (48k+)
        if (this.counter4) {
          animate(0, 48, {
            duration: 1.8,
            ease: "easeOut",
            onUpdate: (latest) => {
              this.counter4.nativeElement.textContent = Math.round(latest).toString();
            }
          });
        }

        if (this.statGrid) {
          const cards = this.statGrid.nativeElement.querySelectorAll('.stat-card');
          animate(cards, 
            { opacity: [0, 1], y: [20, 0] },
            { delay: stagger(0.1), duration: 0.7, ease: [0.22, 1, 0.36, 1] }
          );
        }
      }, { margin: "-80px" });
    }
  }
}
