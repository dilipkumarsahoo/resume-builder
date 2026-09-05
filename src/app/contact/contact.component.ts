import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  name = signal('');
  email = signal('');
  subject = signal('');
  message = signal('');
  consent = signal(false);

  submitted = signal(false);
  isSubmitting = signal(false);

  onSubmit(e: Event) {
    e.preventDefault();
    if (!this.name() || !this.email() || !this.consent()) {
      return;
    }

    this.isSubmitting.set(true);
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.submitted.set(true);
    }, 600);
  }

  resetForm() {
    this.name.set('');
    this.email.set('');
    this.subject.set('');
    this.message.set('');
    this.consent.set(false);
    this.submitted.set(false);
  }
}
