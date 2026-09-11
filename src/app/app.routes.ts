import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { CvBuilderModalComponent } from './cv-builder-modal/cv-builder-modal.component';

import { CoverLetterComponent } from './cover-letter/cover-letter.component';
import { PricingComponent } from './pricing/pricing.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { TermsComponent } from './terms/terms.component';
import { PrivacyComponent } from './privacy/privacy.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'cv-builder', component: CvBuilderModalComponent },
  { path: 'saved-jobs', redirectTo: '/dashboard?tab=jobs' },
  { path: 'cover-letter', redirectTo: '/dashboard?tab=cover-letter' },
  { path: 'templates', redirectTo: '/dashboard?tab=resume' },
  { path: 'pricing', component: PricingComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'terms-and-conditions', redirectTo: '/terms' },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'privacy-policy', redirectTo: '/privacy' },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] }
];

