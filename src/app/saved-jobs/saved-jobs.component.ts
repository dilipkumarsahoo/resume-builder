import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CvBuilderService } from '../cv-builder.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-saved-jobs',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './saved-jobs.component.html',
  styleUrl: './saved-jobs.component.css'
})
export class SavedJobsComponent implements OnInit {
  cvService = inject(CvBuilderService);

  jobs: any[] = [
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

  // Cover Letter Modal State
  showCoverLetterModal = false;
  selectedJob: any = null;
  generatedCoverLetterText = '';
  isGenerating = false;
  additionalNotesInput = '';
  isEditing = false;
  copySuccess = false;

  // Add Job Modal State
  showAddJobModal = false;
  newJobPosition = '';
  newJobCompany = '';
  newJobType = 'Full-time';
  newJobStatus = 'Bookmarked';

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('saved_jobs');
      if (saved) {
        this.jobs = JSON.parse(saved);
      } else {
        this.saveJobs(); // save the initial default job
      }
    }
  }

  saveJobs() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('saved_jobs', JSON.stringify(this.jobs));
    }
  }

  openCoverLetterModal(job: any) {
    this.selectedJob = job;
    this.generatedCoverLetterText = job.coverLetter || '';
    this.additionalNotesInput = '';
    this.isEditing = false;
    this.showCoverLetterModal = true;
  }

  closeCoverLetterModal() {
    this.showCoverLetterModal = false;
    this.selectedJob = null;
    this.generatedCoverLetterText = '';
  }

  async generateCoverLetter() {
    if (!this.selectedJob) return;
    this.isGenerating = true;
    try {
      const coverLetter = await this.cvService.generateCoverLetter(
        this.selectedJob.position,
        this.selectedJob.company,
        this.additionalNotesInput
      );
      this.generatedCoverLetterText = coverLetter;
      this.selectedJob.coverLetter = coverLetter;
      this.saveJobs();
    } catch (error) {
      console.error('Failed to generate cover letter:', error);
    } finally {
      this.isGenerating = false;
    }
  }

  saveAndClose() {
    if (this.selectedJob) {
      this.selectedJob.coverLetter = this.generatedCoverLetterText;
      this.saveJobs();
    }
    this.closeCoverLetterModal();
  }

  clearCoverLetter() {
    if (this.selectedJob) {
      this.selectedJob.coverLetter = null;
      this.generatedCoverLetterText = '';
      this.saveJobs();
    }
  }

  showRegenerateForm() {
    if (this.selectedJob) {
      this.selectedJob.coverLetter = null;
      this.generatedCoverLetterText = '';
    }
  }

  copyToClipboard() {
    if (navigator.clipboard && this.generatedCoverLetterText) {
      navigator.clipboard.writeText(this.generatedCoverLetterText).then(() => {
        this.copySuccess = true;
        setTimeout(() => this.copySuccess = false, 2000);
      });
    }
  }

  downloadPDF() {
    if (!this.selectedJob) return;
    this.downloadJobCoverLetter(this.selectedJob);
  }

  downloadJobCoverLetter(job: any) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxLineWidth = pageWidth - (margin * 2);
    
    // Split the text into lines that fit the page width
    const textLines = doc.splitTextToSize(job.coverLetter || '', maxLineWidth);
    
    // Write lines
    let y = 20;
    const lineHeight = 7;
    
    for (let i = 0; i < textLines.length; i++) {
      if (y > 280) { // Page overflow
        doc.addPage();
        y = 20;
      }
      doc.text(textLines[i], margin, y);
      y += lineHeight;
    }
    
    const filename = `${job.company.replace(/\s+/g, '_')}_Cover_Letter.pdf`;
    doc.save(filename);
  }

  // Job operations
  openAddJobModal() {
    this.newJobPosition = '';
    this.newJobCompany = '';
    this.newJobType = 'Full-time';
    this.newJobStatus = 'Bookmarked';
    this.showAddJobModal = true;
  }

  addJob() {
    if (!this.newJobPosition.trim() || !this.newJobCompany.trim()) return;
    
    const newJob = {
      position: this.newJobPosition.trim(),
      company: this.newJobCompany.trim(),
      status: this.newJobStatus,
      dateSaved: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      dateApplied: null,
      type: this.newJobType,
      resume: null,
      coverLetter: null,
      notes: ''
    };

    this.jobs.push(newJob);
    this.saveJobs();
    this.showAddJobModal = false;
  }

  deleteJob(index: number) {
    if (confirm('Are you sure you want to delete this job application?')) {
      this.jobs.splice(index, 1);
      this.saveJobs();
    }
  }
}
