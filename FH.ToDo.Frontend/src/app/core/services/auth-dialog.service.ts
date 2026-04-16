import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

/**
 * Opens the login and register dialogs.
 * Calling openLogin / openRegister while another auth dialog is open
 * closes it first — enabling seamless switching between the two.
 */
@Injectable({ providedIn: 'root' })
export class AuthDialogService {
  private readonly dialog = inject(MatDialog);

  openLogin(): void {
    this.dialog.closeAll();
    import('../../features/auth/auth-login-dialog/auth-login-dialog.component')
      .then(m => this.dialog.open(m.AuthLoginDialogComponent, { width: '440px', disableClose: false }));
  }

  openRegister(): void {
    this.dialog.closeAll();
    import('../../features/auth/auth-register-dialog/auth-register-dialog.component')
      .then(m => this.dialog.open(m.AuthRegisterDialogComponent, { width: '520px', disableClose: false }));
  }
}
