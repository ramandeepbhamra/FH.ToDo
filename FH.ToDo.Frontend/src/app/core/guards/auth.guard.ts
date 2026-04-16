import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthDialogService } from '../services/auth-dialog.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const authDialog = inject(AuthDialogService);

  if (auth.isAuthenticated()) {
    return true;
  }

  // Redirect to dashboard and open the login dialog
  authDialog.openLogin();
  return router.createUrlTree(['/']);
};

