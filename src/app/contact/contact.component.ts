import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/contact';

  name = signal('');
  email = signal('');
  subject = signal('');
  message = signal('');
  consent = signal(false);

  submitted = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  onSubmit(e: Event) {
    e.preventDefault();
    if (!this.name() || !this.email() || !this.consent() || !this.message()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const payload = {
      name: this.name().trim(),
      email: this.email().trim(),
      subject: this.subject().trim() || 'General Inquiry',
      message: this.message().trim(),
    };

    this.http.post<{ success: boolean; message: string; data: any }>(this.apiUrl, payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.submitted.set(true);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to send message. Please try again.');
        console.error('Contact submit error:', err);
      }
    });
  }

  resetForm() {
    this.name.set('');
    this.email.set('');
    this.subject.set('');
    this.message.set('');
    this.consent.set(false);
    this.submitted.set(false);
    this.errorMessage.set(null);
  }
}
