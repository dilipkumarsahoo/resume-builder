import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { CvBuilderModalComponent } from './cv-builder-modal/cv-builder-modal.component';
import { OnboardingComponent } from './onboarding/onboarding';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    LoaderComponent,
    NavbarComponent,
    FooterComponent,
    CvBuilderModalComponent,
    OnboardingComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  router = inject(Router);

  isDashboard() {
    return this.router.url.includes('/dashboard');
  }
  isLogin() {
    return this.router.url.includes('/login');
  }
  isSignup() {
    return this.router.url.includes('/signup');
  }
}
