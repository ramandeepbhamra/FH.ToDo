import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemingService } from './services/theming.service';
import { NavigationComponent } from './components/navigation/navigation.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ThemeSelectorComponent } from './components/theme-selector/theme-selector.component';
import { ThemeSelectorService } from './services/theme-selector.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavigationComponent,
    MatSidenavModule,
    ThemeSelectorComponent,
  ],
  template: `
    <app-navigation />
    <mat-sidenav-container>
      <mat-sidenav
        [opened]="themeSelectorService.isOpen()"
        (closed)="themeSelectorService.close()"
        position="end"
        fixedInViewport="true"
        fixedTopGap="64"
        class="theme-selector"
      >
        <app-theme-selector />
      </mat-sidenav>
      <router-outlet />
    </mat-sidenav-container>
  `,
  styles: `
  
  :host {
    display: block;
    padding-top: 64px;
  }

  .theme-selector {
      width: 300px;
      background: var(--background);
      --mat-sidenav-container-divider-color: var(--primary-light);
    }

  `,
})
export class AppComponent {
  themingService = inject(ThemingService);
  themeSelectorService = inject(ThemeSelectorService);

  setTheme = effect(() => {
    document.body.style.setProperty(`--primary`, this.themingService.primary());
    document.body.style.setProperty(
      `--primary-light`,
      this.themingService.primaryLight()
    );
    document.body.style.setProperty(`--ripple`, this.themingService.ripple());
    document.body.style.setProperty(
      `--primary-dark`,
      this.themingService.primaryDark()
    );
    document.body.style.setProperty(
      `--background`,
      this.themingService.background()
    );
    document.body.style.setProperty(`--error`, this.themingService.error());
  });
}
