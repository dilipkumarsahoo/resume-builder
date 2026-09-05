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

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'dashboard', redirectTo: '/cover-letter' },
  { path: 'cv-builder', component: CvBuilderModalComponent },
  { path: 'saved-jobs', redirectTo: '/cover-letter?tab=jobs' },
  { path: 'cover-letter', component: CoverLetterComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent }
];

