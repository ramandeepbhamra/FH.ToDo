import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AppNavigationComponent } from '../../shared/components/app-navigation/app-navigation.component';
import { AppThemeSelectorComponent } from '../../shared/components/app-theme-selector/app-theme-selector.component';
import { ThemeSelectorService } from '../../core/services/theme-selector.service';

@Component({
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
  imports: [RouterOutlet, AppNavigationComponent, MatSidenavModule, AppThemeSelectorComponent],
})
export class AppLayoutComponent {
  readonly themeSelectorService = inject(ThemeSelectorService);
}
