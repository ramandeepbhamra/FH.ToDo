import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeSelectorService } from '../../services/theme-selector.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h4>Angular Function Health Todo App</h4>
            <p>
              Simplify your Angular Material theming with just 6 CSS variables.
            </p>
          </div>
          <div class="footer-section">
            <h4>Resources</h4>
            <ul>
              <li>
                <a href="#video">Video Tutorial</a>
              </li>
              <li>
                <a href="https://youtu.be/0mWVSDTq4SI" target="_blank"
                  >Watch Tutorial</a
                >
              </li>
              <li><a (click)="themeSelectorService.open()">Live Demo</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Connect</h4>
            <ul>
              <li>
                <a href="https://x.com/function" target="_blank"
                  >X</a
                >
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/functionhealth/"
                  target="_blank"
                  >LinkedIn</a
                >
              </li>
              <li>
                <a href="https://www.functionhealth.com/" target="_blank">Website</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>
            &copy; Function Health Todo App. Created by
            <a href="https://www.functionhealth.com/" target="_blank">Function Health</a>
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: `
    .footer {
      background: var(--background);
      padding: 64px 0 32px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 48px;
      margin-bottom: 48px;
      text-align: left;
    }

    .footer-section {
      h4 {
        color: var(--primary);
        margin-bottom: 16px;
        font-size: 1.2rem;
      }

      p {
        color: var(--primary-dark);
        line-height: 1.6;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          margin-bottom: 8px;
        }

        a {
          color: var(--primary-dark);
          text-decoration: none;
          transition: color 0.3s ease;

          &:hover {
            color: var(--primary);
          }
        }
      }
    }

    .footer-bottom {
      padding-top: 32px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      text-align: center;
      color: var(--primary-dark);

      a {
        color: var(--primary);
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    @media (max-width: 600px) {
      .footer-content {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .footer-section {
        ul {
          display: flex;
          flex-direction: column;
          align-items: center;
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
export class FooterComponent {
  themeSelectorService = inject(ThemeSelectorService);
}
