import { Component } from '@angular/core';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { VideoSectionComponent } from '../../components/video-section/video-section.component';
import { FeaturesSectionComponent } from '../../components/features-section/features-section.component';
import { TestimonialsSectionComponent } from '../../components/testimonials-section/testimonials-section.component';
import { PricingSectionComponent } from '../../components/pricing-section/pricing-section.component';
import { CtaSectionComponent } from '../../components/cta-section/cta-section.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ScrollAnimationDirective } from '../../shared/directives/scroll-animation.directive';

@Component({
  selector: 'app-landing',
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

    /* Animation classes */
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

    /* Optional: Add more animations as needed */
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
export class LandingComponent {}
