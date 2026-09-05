import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
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
    OnboardingComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  router = inject(Router);

  hideNavAndFooter() {
    const url = this.router.url;
    return (
      url.includes('/signup') ||
      url.includes('/login') ||
      url.includes('/cv-builder') ||
      url.includes('/cover-letter')
    );
  }

  isCvBuilder() {
    return this.router.url.includes('/cv-builder');
  }
  isLogin() {
    return this.router.url.includes('/login');
  }
  isSignup() {
    return this.router.url.includes('/signup');
  }
  isCoverLetter() {
    return this.router.url.includes('/cover-letter');
  }
}
