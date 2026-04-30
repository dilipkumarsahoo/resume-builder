import { Component, signal, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { animate } from 'motion';

@Component({
  selector: 'app-loader',
  standalone: true,
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent implements AfterViewInit {
  isVisible = signal(true);
  @ViewChild('progressBar') progressBar!: ElementRef;
  @ViewChild('loaderContainer') loaderContainer!: ElementRef;

  ngAfterViewInit() {
    if (this.progressBar && this.loaderContainer) {
      animate(this.progressBar.nativeElement, { width: ['0%', '100%'] }, { duration: 1.5, ease: 'easeInOut' }).finished.then(() => {
        animate(this.loaderContainer.nativeElement, { opacity: [1, 0], scale: [1, 1.05] }, { duration: 0.5, ease: 'easeOut' }).finished.then(() => {
          this.isVisible.set(false);
        });
      });
    }
  }
}
