import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoaderComponent } from './loader.component';
import { NavbarComponent } from './navbar.component';
import { HeroComponent } from './hero.component';
import { TemplatesCarouselComponent } from './templates-carousel.component';
import { TrustSectionComponent } from './trust-section.component';
import { FeaturesSectionComponent } from './features-section.component';
import { SmartSuggestionsComponent } from './smart-suggestions.component';
import { TestimonialsComponent } from './testimonials.component';
import { CtaSectionComponent } from './cta-section.component';
import { FooterComponent } from './footer.component';
import { CvBuilderModalComponent } from './cv-builder-modal.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [
    LoaderComponent,
    NavbarComponent,
    HeroComponent,
    TemplatesCarouselComponent,
    TrustSectionComponent,
    FeaturesSectionComponent,
    SmartSuggestionsComponent,
    TestimonialsComponent,
    CtaSectionComponent,
    FooterComponent,
    CvBuilderModalComponent
  ],
  template: `
    <app-loader></app-loader>
    <app-navbar></app-navbar>
    <main>
      <app-hero></app-hero>
      <app-templates-carousel></app-templates-carousel>
      <app-trust-section></app-trust-section>
      <app-features-section></app-features-section>
      <app-smart-suggestions></app-smart-suggestions>
      <app-testimonials></app-testimonials>
      <app-cta-section></app-cta-section>
    </main>
    <app-footer></app-footer>
    <app-cv-builder-modal></app-cv-builder-modal>
  `,
})
export class App {}
