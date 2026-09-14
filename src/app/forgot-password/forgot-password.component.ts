import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);

  email = signal('');
  isSubmitting = signal(false);
  isSubmitted = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  devResetUrl = signal<string | null>(null);

  onSubmit(e: Event) {
    e.preventDefault();
    const emailVal = this.email().trim();
    if (!emailVal) {
      this.errorMessage.set('Please enter a valid email address.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.authService.forgotPassword(emailVal).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.isSubmitted.set(true);
        this.successMessage.set(res.message || 'Password reset link sent.');
        if (res.data?.resetUrl) {
          this.devResetUrl.set(res.data.resetUrl);
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const msg = err.error?.message || 'Unable to send password reset email. Please check the address and try again.';
        this.errorMessage.set(msg);
      }
    });
  }

  resendEmail() {
    const emailVal = this.email().trim();
    if (!emailVal || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.authService.forgotPassword(emailVal).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.successMessage.set('A new reset link has been sent to your email.');
        if (res.data?.resetUrl) {
          this.devResetUrl.set(res.data.resetUrl);
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const msg = err.error?.message || 'Unable to resend reset email. Please try again.';
        this.errorMessage.set(msg);
      }
    });
  }
}

