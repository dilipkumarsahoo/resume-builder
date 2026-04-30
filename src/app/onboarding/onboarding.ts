import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvBuilderService } from '../cv-builder.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.css'
})
export class OnboardingComponent {
  cvService = inject(CvBuilderService);

  nextStep() {
    const current = this.cvService.onboardingStep();
    if (current < 4) {
      this.cvService.onboardingStep.set(current + 1);
    } else {
      this.skipToForm();
    }
  }

  prevStep() {
    const current = this.cvService.onboardingStep();
    if (current > 1) {
      this.cvService.onboardingStep.set(current - 1);
    }
  }

  skipToForm() {
    this.cvService.closeOnboarding();
    this.cvService.openModal();
  }
}
