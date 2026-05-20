import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { CvBuilderService } from '../cv-builder.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  showUploadModal = false;
  isDropdownOpen = false;
  isDragging = false;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.cvService.uploadAndParseResume(input.files[0], () => {
        this.showUploadModal = false;
      });
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      this.cvService.uploadAndParseResume(event.dataTransfer.files[0], () => {
        this.showUploadModal = false;
      });
    }
  }

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

  constructor(
    public cvService: CvBuilderService,
    private authService: AuthService,
    private router: Router
  ) {}

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  openTemplateSelection() {
    this.cvService.isOnboardingOpen.set(true);
    this.cvService.onboardingStep.set(4);
    this.cvService.hideOnboardingSteps.set(true);
    document.body.style.overflow = 'hidden';
  }
}
