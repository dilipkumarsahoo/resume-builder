import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CvBuilderService } from '../cv-builder.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  showUploadModal = false;
  // Mock data for the dashboard
  documents = [
    {
      name: 'New Resume (1)',
      job: 'Software Engineer',
      type: 'Resume',
      createdAt: 'May 11, 2024',
      lastEdit: '2 hours ago'
    }
  ];

  constructor(public cvService: CvBuilderService) {}

  openTemplateSelection() {
    this.cvService.isOnboardingOpen.set(true);
    this.cvService.onboardingStep.set(4);
    this.cvService.hideOnboardingSteps.set(true);
    document.body.style.overflow = 'hidden';
  }
}
