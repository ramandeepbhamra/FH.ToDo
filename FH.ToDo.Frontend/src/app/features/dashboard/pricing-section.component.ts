import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pricing-section',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatListModule, MatIconModule],
  template: `
    <section id="pricing" class="pricing-section">
      <div class="container">
        <header class="section-header">
          <h2>Simple Pricing</h2>
          <p class="subtitle">
            Everything you need to get started with Material theming
          </p>
        </header>

        <div class="pricing-card">
          <mat-card>
            <div class="popular-badge">Best Value</div>
            <mat-card-header>
              <mat-card-title>Complete Package</mat-card-title>
              <mat-card-subtitle>
                <div class="price-container">
                  <span class="price">$10</span>
                  <span class="period">one-time payment</span>
                </div>
              </mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="features-list">
                <div class="feature-item">
                  <mat-icon color="primary">check_circle</mat-icon>
                  <span>Dynamic Theme Selector</span>
                </div>
                <div class="feature-item">
                  <mat-icon color="primary">check_circle</mat-icon>
                  <span>Landing Page Template</span>
                </div>
                <div class="feature-item">
                  <mat-icon color="primary">check_circle</mat-icon>
                  <span>Material Components Explorer</span>
                </div>
                <div class="feature-item">
                  <mat-icon color="primary">check_circle</mat-icon>
                  <span>Easy Theming CSS File</span>
                </div>
                <div class="feature-item">
                  <mat-icon color="primary">check_circle</mat-icon>
                  <span>Lifetime Updates</span>
                </div>
              </div>
            </mat-card-content>
            <mat-card-actions>
              <div class="flex justify-center w-full">
                <a
                  mat-flat-button
                  class="buy-button lemonsqueezy-button"
                  href="https://x.com/function"
                  >Buy now</a
                >
              </div>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </section>
  `,
  styles: `
    .pricing-section {
      padding: 6rem 1rem;
      background: linear-gradient(to bottom, var(--primary), var(--primary-light));
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
    }

    .section-header {
      margin-bottom: 3rem;
    }

    h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: var(--primary-dark);
      font-weight: 700;
    }

    .subtitle {
      font-size: 1.2rem;
      color: var(--primary-dark);
      opacity: 0.8;
    }

    .pricing-card {
      max-width: 450px;
      margin: 0 auto;
      position: relative;
      border-radius: 16px;
    }

    mat-card {
      padding: 2.5rem;
      position: relative;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      overflow: hidden;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      }
    }

    .popular-badge {
      position: absolute;
      top: 1rem;
      right: -2rem;
      background: var(--primary);
      color: white;
      padding: 0.5rem 3rem;
      transform: rotate(45deg);
      font-size: 0.9rem;
      font-weight: 500;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .price-container {
      margin: 1.5rem 0;
    }

    .price {
      font-size: 3.5rem;
      font-weight: 700;
      color: var(--primary);
      line-height: 1;
    }

    .period {
      display: block;
      font-size: 1rem;
      opacity: 0.7;
      margin-top: 0.5rem;
    }

    mat-card-header {
      justify-content: center;
      text-align: center;
      margin-bottom: 2rem;
    }

    mat-card-title {
      font-size: 1.5rem !important;
      font-weight: 600 !important;
      margin-bottom: 1rem !important;
    }

    .features-list {
      text-align: left;
      margin: 2rem 0;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;

      mat-icon {
        font-size: 1.25rem;
        width: 1.25rem;
        height: 1.25rem;
      }

      span {
        font-size: 1.1rem;
      }
    }

    mat-card-actions {
      padding: 1rem 0 0;
    }

    .buy-button {
      padding: 0.75rem 2.5rem;
      font-size: 1.1rem;
      border-radius: 2rem;
      font-weight: 500;
      letter-spacing: 0.5px;
      transition: transform 0.2s ease;

      &:hover {
        transform: scale(1.05);
      }
    }

    @media (max-width: 600px) {
      .pricing-section {
        padding: 4rem 1rem;
      }

      h2 {
        font-size: 2rem;
      }

      .price {
        font-size: 3rem;
      }

      mat-card {
        padding: 2rem 1.5rem;
      }
    }
  `,
})
export class PricingSectionComponent {}
