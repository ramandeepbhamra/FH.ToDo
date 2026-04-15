import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { ThemeSelectorService } from '../../core/services/theme-selector.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navigation',
  imports: [MatToolbarModule, MatButtonModule, MatIcon, RouterLink],
  template: `
    <mat-toolbar class="nav-bar">
      <div class="container nav-container">
        <a routerLink="/" class="logo">
          <mat-icon>check_circle</mat-icon>
          <span>FH ToDo</span>
        </a>

        <nav>
          <a mat-button routerLink="/todos">Todos</a>
          <a mat-button routerLink="/users">Users</a>
          <a mat-button routerLink="/dev-tools">Dev Tools</a>
        </nav>

        <div class="nav-user">
          <span class="user-name">{{ authService.currentUser()?.fullName }}</span>
          <button mat-icon-button (click)="themeSelectorService.open()" title="Theme">
            <mat-icon>palette</mat-icon>
          </button>
          <button mat-icon-button (click)="authService.logout()" title="Sign out">
            <mat-icon>logout</mat-icon>
          </button>
        </div>
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
      text-align: left;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
      font-size: 1.1rem;

      mat-icon {
        font-size: 24px;
        height: 24px;
        width: 24px;
      }
    }

    nav {
      display: flex;
      gap: 4px;
      align-items: center;

      a {
        color: var(--primary-dark);
        font-weight: 500;

        &:hover {
          color: var(--primary);
        }
      }
    }

    .nav-user {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .user-name {
      font-size: 0.875rem;
      color: var(--primary);
      font-weight: 500;
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
  authService = inject(AuthService);
}
