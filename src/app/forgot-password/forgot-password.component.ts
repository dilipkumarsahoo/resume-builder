import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email = signal('');
  isSubmitting = signal(false);
  isSubmitted = signal(false);
  errorMessage = signal('');

  onSubmit(e: Event) {
    e.preventDefault();
    if (!this.email()) {
      this.errorMessage.set('Please enter a valid email address.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    setTimeout(() => {
      this.isSubmitting.set(false);
      this.isSubmitted.set(true);
    }, 700);
  }

  resendEmail() {
    this.isSubmitting.set(true);
    setTimeout(() => {
      this.isSubmitting.set(false);
    }, 500);
  }
}
