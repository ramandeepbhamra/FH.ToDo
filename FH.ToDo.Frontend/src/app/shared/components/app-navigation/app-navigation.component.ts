import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { ThemeSelectorService } from '../../../core/services/theme-selector.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './app-navigation.component.html',
  styleUrl: './app-navigation.component.scss',
  imports: [MatToolbarModule, MatButtonModule, MatIcon, RouterLink],
})
export class AppNavigationComponent {
  readonly themeSelectorService = inject(ThemeSelectorService);
  readonly authService = inject(AuthService);
}
