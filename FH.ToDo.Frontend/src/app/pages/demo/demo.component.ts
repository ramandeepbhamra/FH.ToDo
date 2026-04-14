import { Component, signal, inject, computed, effect } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { CreditsComponent } from '../../components/credits/credits.component';
import { MainMenuComponent } from '../../components/main-menu/main-menu.component';
import { ThemeSelectorComponent } from '../../components/theme-selector/theme-selector.component';
import { ResponsiveService } from '../../services/responsive.service';
import { ThemingService } from '../../services/theming.service';

@Component({
  selector: 'app-demo',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MainMenuComponent,
    MatMenuModule,
    MatButtonModule,
    CreditsComponent,
  ],
  template: `
    <mat-drawer-container>
      <mat-drawer
        class="component-selector"
        [(opened)]="componentSelectorOpen"
        [mode]="componentSelectorMode()"
      >
        <app-main-menu />
        <app-credits class="credits" />
      </mat-drawer>
      <mat-drawer-content class="ml-[200px]">
        <div class="p-6">
          <router-outlet />
        </div>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
  styles: `

    mat-drawer-container {
      height: calc(100vh - 64px);
    }

    .component-selector {
      width: 200px;
      height: inherit;
      background: var(--background);
      --mat-sidenav-container-divider-color: var(--primary-light);
    }

    .credits {
      position: absolute;
      bottom: 20px;
    }
  `,
})
export class DemoComponent {
  componentSelectorOpen = signal(true);
  themingService = inject(ThemingService);
  responsiveService = inject(ResponsiveService);

  componentSelectorMode = computed(() => {
    if (this.responsiveService.smallWidth()) {
      return 'over';
    }
    return 'side';
  });

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
