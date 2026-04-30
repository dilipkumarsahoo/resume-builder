import { Component, ElementRef, AfterViewInit, ViewChild, inject } from '@angular/core';
import { animate, inView, stagger } from 'motion';
import { CvBuilderService } from '../cv-builder.service';

@Component({
  selector: 'app-cta-section',
  standalone: true,
  templateUrl: './cta-section.component.html',
  styleUrl: './cta-section.component.css'
})
export class CtaSectionComponent implements AfterViewInit {
  cvService = inject(CvBuilderService);
  @ViewChild('section') section!: ElementRef;
  @ViewChild('heading') heading!: ElementRef;
  @ViewChild('buttonWrapper') buttonWrapper!: ElementRef;

  ngAfterViewInit() {
    inView(this.section.nativeElement, () => {
      animate([this.heading.nativeElement, this.buttonWrapper.nativeElement], 
        { opacity: [0, 1], y: [40, 0] }, 
        { delay: stagger(0.2), duration: 0.8, ease: [0.22, 1, 0.36, 1] }
      );
    }, { margin: "-100px" });
  }
}
