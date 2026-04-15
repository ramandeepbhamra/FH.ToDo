import { Component } from '@angular/core';
import { HeroSectionComponent } from './hero-section.component';
import { VideoSectionComponent } from './video-section.component';
import { FeaturesSectionComponent } from './features-section.component';
import { TestimonialsSectionComponent } from './testimonials-section.component';
import { PricingSectionComponent } from './pricing-section.component';
import { CtaSectionComponent } from './cta-section.component';
import { FooterComponent } from './footer.component';
import { ScrollAnimationDirective } from '../../shared/directives/scroll-animation.directive';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HeroSectionComponent,
    VideoSectionComponent,
    FeaturesSectionComponent,
    TestimonialsSectionComponent,
    PricingSectionComponent,
    CtaSectionComponent,
    FooterComponent,
    ScrollAnimationDirective,
  ],
  template: `
    <app-hero-section />
    <div scrollAnimation="fade-in-up">
      <app-video-section />
    </div>
    <div scrollAnimation="fade-in-up" [delay]="100">
      <app-features-section />
    </div>
    <div scrollAnimation="fade-in-up" [delay]="200">
      <app-testimonials-section />
    </div>
    <div scrollAnimation="fade-in-up" [delay]="300">
      <app-pricing-section />
    </div>
    <div scrollAnimation="fade-in-up" [delay]="400">
      <app-cta-section />
    </div>
    <div scrollAnimation="fade-in-up" [delay]="500">
      <app-footer />
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .fade-in-up {
      animation: fadeInUp 0.8s ease forwards;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .fade-in-left {
      animation: fadeInLeft 0.8s ease forwards;
    }

    @keyframes fadeInLeft {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .fade-in-right {
      animation: fadeInRight 0.8s ease forwards;
    }

    @keyframes fadeInRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .zoom-in {
      animation: zoomIn 0.8s ease forwards;
    }

    @keyframes zoomIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `,
})
export class DashboardComponent {}
