import { Component, ElementRef, AfterViewInit, ViewChild, signal, inject } from '@angular/core';
import { animate, inView, stagger } from 'motion';
import { CommonModule } from '@angular/common';
import { CvBuilderService } from './cv-builder.service';

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-24 bg-white overflow-hidden" #section>
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-5xl font-bold tracking-tight text-text-main mb-4">Easiest and most feature-packed <br/> CV builder available</h2>
        </div>

        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <!-- Left: UI Preview -->
          <div class="relative bg-bg-light rounded-3xl p-8 md:p-12 border border-gray-100 shadow-inner opacity-0 translate-x-[-40px]" #previewBox>
            <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden aspect-[4/3] flex flex-col">
              <!-- Fake Browser Header -->
              <div class="h-10 border-b border-gray-100 flex items-center px-4 gap-2 bg-gray-50/50">
                <div class="w-3 h-3 rounded-full bg-red-400"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div class="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <!-- Fake UI Body -->
              <div class="flex-1 p-6 flex gap-6">
                <!-- Sidebar -->
                <div class="w-1/3 flex flex-col gap-3">
                  <div class="h-8 bg-gray-100 rounded animate-pulse"></div>
                  <div class="h-24 bg-gray-100 rounded animate-pulse transition-colors" [ngClass]="{'bg-accent/20': activeFeature() === 0}"></div>
                  <div class="h-24 bg-gray-100 rounded animate-pulse transition-colors" [ngClass]="{'bg-accent/20': activeFeature() === 1}"></div>
                  <div class="h-24 bg-gray-100 rounded animate-pulse transition-colors" [ngClass]="{'bg-accent/20': activeFeature() === 2}"></div>
                </div>
                <!-- Main Area -->
                <div class="flex-1 bg-gray-50 rounded border border-gray-100 p-4 flex flex-col gap-4">
                   <div class="h-32 bg-white rounded shadow-sm border border-gray-100 p-4 flex flex-col gap-2">
                      <div class="h-4 w-1/2 bg-gray-200 rounded"></div>
                      <div class="h-3 w-full bg-gray-100 rounded"></div>
                      <div class="h-3 w-3/4 bg-gray-100 rounded"></div>
                   </div>
                   <div class="h-32 bg-white rounded shadow-sm border border-gray-100 p-4 flex flex-col gap-2 relative overflow-hidden">
                      <div class="h-4 w-1/3 bg-gray-200 rounded"></div>
                      <div class="h-3 w-full bg-gray-100 rounded"></div>
                      <div class="h-3 w-5/6 bg-gray-100 rounded"></div>
                      
                      <!-- Highlight overlay based on active feature -->
                      @if (activeFeature() === 0) {
                        <div class="absolute inset-0 bg-accent/10 border-2 border-accent rounded flex items-center justify-center">
                          <span class="bg-accent text-white text-xs px-2 py-1 rounded-full font-medium">Pre-written</span>
                        </div>
                      }
                      @if (activeFeature() === 1) {
                        <div class="absolute inset-0 bg-accent-secondary/10 border-2 border-accent-secondary rounded flex items-center justify-center">
                          <span class="bg-accent-secondary text-white text-xs px-2 py-1 rounded-full font-medium">ATS Ready</span>
                        </div>
                      }
                   </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Features List -->
          <div class="flex flex-col gap-8" #featuresList>
            @for (feature of features; track $index) {
              <div class="flex gap-6 cursor-pointer group feature-item opacity-0 translate-x-[40px]" 
                   (mouseenter)="activeFeature.set($index)"
                   (click)="activeFeature.set($index)"
                   tabindex="0"
                   (keydown.enter)="activeFeature.set($index)"
                   (keydown.space)="activeFeature.set($index)">
                <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-colors duration-300"
                     [ngClass]="activeFeature() === $index ? 'bg-accent text-white shadow-lg shadow-accent/30' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'">
                  {{ $index + 1 }}
                </div>
                <div>
                  <h3 class="text-xl font-semibold mb-2 transition-colors duration-300"
                      [ngClass]="activeFeature() === $index ? 'text-text-main' : 'text-gray-500 group-hover:text-gray-800'">
                    {{ feature.title }}
                  </h3>
                  <p class="text-gray-500 leading-relaxed transition-all duration-300 overflow-hidden"
                     [ngStyle]="{'max-height': activeFeature() === $index ? '100px' : '0px', 'opacity': activeFeature() === $index ? '1' : '0'}">
                    {{ feature.desc }}
                  </p>
                </div>
              </div>
            }
            
            <div class="pt-6 feature-item opacity-0 translate-x-[40px]">
              <button (click)="cvService.openModal()" class="bg-accent text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-emerald-500 transition-all shadow-lg shadow-accent/30 hover:shadow-xl hover:-translate-y-1">
                Let's get started
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class FeaturesSectionComponent implements AfterViewInit {
  cvService = inject(CvBuilderService);
  @ViewChild('section') section!: ElementRef;
  @ViewChild('previewBox') previewBox!: ElementRef;
  @ViewChild('featuresList') featuresList!: ElementRef;

  activeFeature = signal(0);

  features = [
    { title: 'Pre-written content', desc: 'Stuck on what to write? Use our pre-written phrases tailored to your industry and role.' },
    { title: '40+ click & ready CV templates', desc: 'Use our recommendations or pick your own. All templates are recruiter-approved and guaranteed to pass applicant tracking systems (ATS).' },
    { title: 'Expert tips & guidance', desc: 'Get step-by-step guidance from career experts as you build your CV to ensure it stands out.' }
  ];

  ngAfterViewInit() {
    inView(this.section.nativeElement, () => {
      animate(this.previewBox.nativeElement, { opacity: [0, 1], x: [-40, 0] }, { duration: 0.8, ease: [0.22, 1, 0.36, 1] });
      
      const items = this.featuresList.nativeElement.querySelectorAll('.feature-item');
      animate(items, { opacity: [0, 1], x: [40, 0] }, { delay: stagger(0.15), duration: 0.8, ease: [0.22, 1, 0.36, 1] });
    }, { margin: "-100px" });
  }
}
