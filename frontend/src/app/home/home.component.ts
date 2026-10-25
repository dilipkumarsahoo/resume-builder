import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { TemplatesCarouselComponent } from '../templates-carousel/templates-carousel.component';
import { TrustSectionComponent } from '../trust-section/trust-section.component';
import { FeaturesSectionComponent } from '../features-section/features-section.component';
import { SmartSuggestionsComponent } from '../smart-suggestions/smart-suggestions.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { CtaSectionComponent } from '../cta-section/cta-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    TemplatesCarouselComponent,
    TrustSectionComponent,
    FeaturesSectionComponent,
    SmartSuggestionsComponent,
    TestimonialsComponent,
    CtaSectionComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {}
