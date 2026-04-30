import { Component, signal, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { animate } from 'motion';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    @if (isVisible()) {
      <div #loaderContainer class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-xl">
            CV
          </div>
          <span class="text-2xl font-semibold tracking-tight text-text-main">Builder</span>
        </div>
        <div class="w-64 h-1 bg-bg-light rounded-full overflow-hidden">
          <div #progressBar class="h-full bg-accent w-0 rounded-full"></div>
        </div>
      </div>
    }
  `
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
