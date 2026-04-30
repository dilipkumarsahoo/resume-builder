import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { animate, inView, stagger } from 'motion';

@Component({
  selector: 'app-smart-suggestions',
  standalone: true,
  template: `
    <section class="py-24 bg-bg-light" #section>
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid md:grid-cols-2 gap-8">
          
          <div class="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-accent/30 transition-all duration-500 group relative overflow-hidden suggestion-card opacity-0 translate-y-8">
            <div class="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/10 transition-colors"></div>
            <div class="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-8 group-hover:scale-110 transition-transform">
              <span class="material-icons text-3xl">auto_awesome</span>
            </div>
            <h3 class="text-2xl font-bold text-text-main mb-4">AI Suggestion</h3>
            <p class="text-gray-500 text-lg leading-relaxed mb-8">
              Our AI analyzes your job target and suggests the most impactful keywords and phrases to include in your summary and experience sections.
            </p>
            <a href="#" class="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all">
              See how it works <span class="material-icons text-sm">arrow_forward</span>
            </a>
          </div>

          <div class="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-accent-secondary/30 transition-all duration-500 group relative overflow-hidden suggestion-card opacity-0 translate-y-8">
            <div class="absolute top-0 right-0 w-64 h-64 bg-accent-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent-secondary/10 transition-colors"></div>
            <div class="w-14 h-14 rounded-2xl bg-accent-secondary/10 flex items-center justify-center text-accent-secondary mb-8 group-hover:scale-110 transition-transform">
              <span class="material-icons text-3xl">support_agent</span>
            </div>
            <h3 class="text-2xl font-bold text-text-main mb-4">Expert Feedback</h3>
            <p class="text-gray-500 text-lg leading-relaxed mb-8">
              Get a comprehensive review from our career experts with personalized suggestions to improve your CV's impact and readability.
            </p>
            <a href="#" class="inline-flex items-center gap-2 text-accent-secondary font-semibold hover:gap-3 transition-all">
              Request a review <span class="material-icons text-sm">arrow_forward</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  `
})
export class SmartSuggestionsComponent implements AfterViewInit {
  @ViewChild('section') section!: ElementRef;

  ngAfterViewInit() {
    inView(this.section.nativeElement, () => {
      const cards = this.section.nativeElement.querySelectorAll('.suggestion-card');
      animate(cards, { opacity: [0, 1], y: [40, 0] }, { delay: stagger(0.2), duration: 0.8, ease: [0.22, 1, 0.36, 1] });
    }, { margin: "-100px" });
  }
}
