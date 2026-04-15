import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { ThemeSelectorService } from '../../core/services/theme-selector.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink],
  template: `
    <mat-toolbar class="nav-bar">
      <div class="container nav-container">
        <a routerLink="/" class="logo">
          <mat-icon>palette</mat-icon>
          <span>Function Health Todo App</span>
        </a>
        <nav>
          <a mat-button href="#features">Features</a>
          <a mat-button href="#testimonials">Testimonials</a>
          <a mat-button href="#pricing">Pricing</a>
          <a mat-button routerLink="/dev-tools"> Dev Tools </a>
          <a mat-flat-button (click)="themeSelectorService.open()"
            >Try it out</a
          >
        </nav>
      </div>
    </mat-toolbar>
  `,
  styles: `
    .nav-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: var(--background);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .nav-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
      font-size: 1.2rem;

      mat-icon {
        font-size: 24px;
        height: 24px;
        width: 24px;
      }
    }

    nav {
      display: flex;
      gap: 16px;
      align-items: center;

      a {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--primary-dark);
        font-weight: 500;

        &:hover {
          color: var(--primary);
        }

        mat-icon {
          color: currentColor;
        }

        &[mat-flat-button] {
          color: white;
        }
      }
    }

    @media (max-width: 768px) {
      .nav-container {
        nav {
          display: none;
        }
      }
    }
  `,
})
export class NavigationComponent {
  themeSelectorService = inject(ThemeSelectorService);
}
