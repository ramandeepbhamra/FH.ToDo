import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavigationComponent } from '../shared/components/navigation.component';
import { ThemeSelectorComponent } from '../shared/components/theme-selector.component';
import { ThemeSelectorService } from '../core/services/theme-selector.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, NavigationComponent, MatSidenavModule, ThemeSelectorComponent],
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
export class AppLayoutComponent {
  themeSelectorService = inject(ThemeSelectorService);
}
