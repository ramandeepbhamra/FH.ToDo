import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { ThemeSelectorService } from '../../../core/services/theme-selector.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuthDialogService } from '../../../core/services/auth-dialog.service';
import { UserRole } from '../../../core/enums/user-role.enum';

@Component({
  selector: 'app-navigation',
  templateUrl: './app-navigation.component.html',
  styleUrl: './app-navigation.component.scss',
  imports: [MatToolbarModule, MatButtonModule, MatIcon, RouterLink],
})
export class AppNavigationComponent {
  private readonly authService       = inject(AuthService);
  private readonly themeSelectorService = inject(ThemeSelectorService);
  readonly authDialogService         = inject(AuthDialogService);

  readonly currentUser     = this.authService.currentUser;
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly isAdmin         = computed(() => this.currentUser()?.role === UserRole.Admin);
  readonly isDevUser       = computed(() => this.currentUser()?.role === UserRole.Dev);

  readonly logout    = () => this.authService.logout();
  readonly openTheme = () => this.themeSelectorService.open();
}
