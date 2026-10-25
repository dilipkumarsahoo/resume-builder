import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login success', response);
          if (response.data?.accessToken) {
            this.authService.saveToken(response.data.accessToken);
          }
          if (response.data?.user) {
            this.authService.saveUser(response.data.user);
          }

          const user = response.data?.user;
          if (user?.role === 'ADMIN') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'];
            const pay = this.route.snapshot.queryParams['pay'];
            const plan = this.route.snapshot.queryParams['plan'];

            if (returnUrl) {
              const queryParams: any = {};
              if (pay) queryParams.pay = pay;
              if (plan) queryParams.plan = plan;
              this.router.navigate([returnUrl], { queryParams });
            } else {
              this.router.navigate(['/dashboard']);
            }
          }
        },
        error: (error) => {
          console.error('Login error', error);
          this.errorMessage = error.error?.message || 'Invalid email or password';
          this.loading = false;
        }
      });
    }
  }
}
