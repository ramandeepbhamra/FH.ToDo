import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <section id="features" class="features">
      <div class="container">
        <h2>Why Choose Easy Theming?</h2>
        <div class="feature-grid">
          <div class="feature-box primary">
            <div class="icon-wrapper">
              <mat-icon>palette</mat-icon>
            </div>
            <h3>Simple Theming</h3>
            <p>
              Just 6 CSS variables to control your entire Material theme. No
              complex SASS knowledge required.
            </p>
          </div>
          <div class="feature-box secondary">
            <div class="icon-wrapper">
              <mat-icon>refresh</mat-icon>
            </div>
            <h3>Dynamic Updates</h3>
            <p>
              Change themes at runtime. Perfect for user customization or
              fetching themes from an API.
            </p>
          </div>
          <div class="feature-box accent">
            <div class="icon-wrapper">
              <mat-icon>dark_mode</mat-icon>
            </div>
            <h3>Dark Mode Support</h3>
            <p>
              Built-in support for both light and dark themes using the same 6
              variables.
            </p>
          </div>
          <div class="feature-box neutral">
            <div class="icon-wrapper">
              <mat-icon>speed</mat-icon>
            </div>
            <h3>Quick Setup</h3>
            <p>
              Get started in minutes with minimal configuration. Just import and
              start theming.
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .features {
      background: linear-gradient(135deg, var(--primary-light), var(--primary-light));
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      justify-items: center;
      gap: 16px;
      margin-top: 48px;
    }

    .feature-box {
      padding: 32px;
      border-radius: 16px;
      background: var(--background);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      border: 1px solid var(--primary-light);
      position: relative;
      overflow: hidden;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);

        .icon-wrapper {
          transform: scale(1.1);
        }
      }

      &.primary .icon-wrapper {
        background: linear-gradient(135deg, var(--primary), var(--primary-light));
      }

      &.secondary .icon-wrapper {
        background: linear-gradient(135deg, #2196f3, #1976d2);
      }

      &.accent .icon-wrapper {
        background: linear-gradient(135deg, #ff4081, #c51162);
      }

      &.neutral .icon-wrapper {
        background: linear-gradient(135deg, #607d8b, #455a64);
      }

      .icon-wrapper {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 24px;
        transition: transform 0.3s ease;

        mat-icon {
          font-size: 32px;
          height: 32px;
          width: 32px;
          color: white;
        }
      }

      h3 {
        color: var(--primary);
        margin-bottom: 16px;
        font-size: 1.4rem;
        font-weight: 500;
      }

      p {
        color: var(--primary-dark);
        line-height: 1.6;
        font-size: 1.1rem;
        margin: 0;
      }

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, 
          var(--primary-light),
          var(--primary-light)
        );
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover::before {
        opacity: 1;
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

    h2 {
        color: var(--primary);
        margin-bottom: 48px;
        font-size: 2rem;
      }
  `,
})
export class FeaturesSectionComponent {}
