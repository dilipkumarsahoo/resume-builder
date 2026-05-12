import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-saved-jobs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './saved-jobs.component.html',
  styleUrl: './saved-jobs.component.css'
})
export class SavedJobsComponent {
  jobs = [
    {
      position: 'Software Engineer',
      company: 'Google',
      status: 'Bookmarked',
      dateSaved: 'May 13, 2026',
      dateApplied: null,
      type: 'Full-time',
      resume: null,
      coverLetter: null,
      notes: ''
    }
  ];

  constructor() {}
}
