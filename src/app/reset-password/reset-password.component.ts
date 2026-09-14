import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  token = signal<string>('');
  email = signal<string>('');

  newPassword = signal<string>('');
  confirmPassword = signal<string>('');
  showPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);

  isSubmitting = signal<boolean>(false);
  isSuccess = signal<boolean>(false);
  errorMessage = signal<string>('');
  isLinkInvalid = signal<boolean>(false);

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const tokenParam = params['token'];
      const emailParam = params['email'];

      if (!tokenParam || !emailParam) {
        this.isLinkInvalid.set(true);
        this.errorMessage.set('Invalid or missing password reset link. Please request a new one.');
      } else {
        this.token.set(tokenParam);
        this.email.set(emailParam);
        this.isLinkInvalid.set(false);
      }
    });
  }

  toggleShowPassword(): void {
    this.showPassword.update((val) => !val);
  }

  toggleShowConfirmPassword(): void {
    this.showConfirmPassword.update((val) => !val);
  }

  onSubmit(e: Event): void {
    e.preventDefault();
    this.errorMessage.set('');

    const password = this.newPassword().trim();
    const confirm = this.confirmPassword().trim();

    if (!password) {
      this.errorMessage.set('Please enter a new password.');
      return;
    }

    if (password.length < 6) {
      this.errorMessage.set('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirm) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    this.isSubmitting.set(true);

    this.authService
      .resetPassword({
        token: this.token(),
        email: this.email(),
        newPassword: password,
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.isSuccess.set(true);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          const msg =
            err.error?.message ||
            'Failed to reset password. The link may have expired or is invalid.';
          this.errorMessage.set(msg);
        },
      });
  }
}
