import { Component } from '@angular/core';

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  template: `
    <section id="testimonials" class="testimonials">
      <div class="container">
        <h2>What Customers Say</h2>
        <div class="testimonial-grid">
          <div class="testimonial">
            <p>
              "This is <strong>genius</strong> and
              <strong>saved me hours </strong>. Thank you!"
            </p>
            <cite>- Greg Lynn</cite>
          </div>
          <div class="testimonial">
            <p>
              "Thank you so much for this, you just made my life
              <strong>so much easier </strong>"
            </p>
            <cite>- Christo Eloff</cite>
          </div>
          <!-- <div class="testimonial">
            <p>
              "Dark mode support out of the box saved me hours of development
              time."
            </p>
            <cite>- UI Designer</cite>
          </div> -->
        </div>
      </div>
    </section>
  `,
  styles: `
    .testimonials {
      background: var(--background);

      h2 {
        color: var(--primary);
        margin-bottom: 48px;
        font-size: 2rem;
      }
    }

    .testimonial-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 300px));
      place-content: center;
      gap: 32px;
    }

    .testimonial {
      padding: 24px;
      border-radius: 8px;
      background: var(--primary-light);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

      p {
        color: var(--primary-dark);
        font-style: italic;
        margin-bottom: 16px;
        line-height: 1.6;
      }

      cite {
        color: var(--primary);
        font-weight: 500;
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
export class TestimonialsSectionComponent {}
