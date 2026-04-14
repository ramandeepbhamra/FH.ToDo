import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ThemeSelectorService } from '../../services/theme-selector.service';

@Component({
  selector: 'app-cta-section',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink],
  template: `
    <section class="cta">
      <div class="container">
        <h2>Ready to Simplify Your Material Theming?</h2>
        <p>
          Get started with Easy Material Theming today and transform how you
          style your Angular applications.
        </p>
        <div class="actions">
          <a mat-flat-button (click)="themeSelectorService.open()"
            >Try Live Demo</a
          >
          <a mat-stroked-button href="#video">
            <mat-icon>play_circle</mat-icon>
            Watch Tutorial
          </a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .cta {
      background: linear-gradient(to top, var(--background), var(--primary-light));

      h2 {
        color: var(--primary);
        font-size: 2rem;
        margin-bottom: 24px;
      }

      p {
        color: var(--primary-dark);
        margin-bottom: 32px;
        font-size: 1.2rem;
      }
    }

    .actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      align-items: center;

      a {
        min-width: 120px;
        display: flex;
        align-items: center;
        gap: 8px;

        mat-icon {
          font-size: 18px;
          height: 18px;
          width: 18px;
        }
      }
    }

    @media (max-width: 600px) {
      .actions {
        flex-direction: column;
        width: 100%;
        
        a {
          width: 100%;
          justify-content: center;
        }
      }
    }

    section {
      padding: 64px 0;
    }

    @media (max-width: 600px) {
      section {
        padding: 48px 0;
      }
    }
  `,
})
export class CtaSectionComponent {
  themeSelectorService = inject(ThemeSelectorService);
}
