import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  constructor() {}
}
