import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { animate, inView } from 'motion';

@Component({
  selector: 'app-trust-section',
  standalone: true,
  templateUrl: './trust-section.component.html',
  styleUrl: './trust-section.component.css'
})
export class TrustSectionComponent implements AfterViewInit {
  @ViewChild('trustSection') section!: ElementRef;
  @ViewChild('counter') counter!: ElementRef;
  @ViewChild('iconBadge') iconBadge!: ElementRef;
  @ViewChild('subtext') subtext!: ElementRef;
  @ViewChild('logos') logos!: ElementRef;

  ngAfterViewInit() {
    inView(this.section.nativeElement, () => {
      // Animate counter
      animate(0, 86, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (latest) => {
          if (this.counter) {
            this.counter.nativeElement.textContent = Math.round(latest).toString();
          }
        }
      });

      // Animate elements
      animate([this.iconBadge.nativeElement, this.subtext.nativeElement, this.logos.nativeElement], 
        { opacity: [0, 1], y: [20, 0] },
        { delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }
      );
    }, { margin: "-100px" });
  }
}
