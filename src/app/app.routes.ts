import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CvBuilderModalComponent } from './cv-builder-modal/cv-builder-modal.component';
import { SavedJobsComponent } from './saved-jobs/saved-jobs.component';

import { CoverLetterComponent } from './cover-letter/cover-letter.component';
import { PricingComponent } from './pricing/pricing.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'cv-builder', component: CvBuilderModalComponent },
  { path: 'saved-jobs', component: SavedJobsComponent },
  { path: 'cover-letter', component: CoverLetterComponent },
  { path: 'pricing', component: PricingComponent }
];

