import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const tab = route.queryParams['tab'];
  // Allow unauthenticated visitors to browse resume templates and cover letter templates
  if (tab === 'resume' || tab === 'cover-letter') {
    return true;
  }

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
