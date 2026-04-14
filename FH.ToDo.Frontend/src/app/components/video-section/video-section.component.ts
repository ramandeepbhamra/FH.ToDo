import { Component } from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';

@Component({
  selector: 'app-video-section',
  standalone: true,
  imports: [YouTubePlayer],
  template: `
    <section id="video" class="video-section">
      <div class="container">
        <h2>Watch how it works</h2>
        <youtube-player
          videoId="h6-BhzFD1CM"
          [height]="400"
          [width]="800"
          class="w-[800px] block mx-auto rounded-xl"
        ></youtube-player>
      </div>
    </section>
  `,
  styles: `
    .video-section {
      background: var(--background);
      padding: 32px 0 64px;
    }

    h2 {
        color: var(--primary);
        margin-bottom: 48px;
        font-size: 2rem;
      }

    .video-container {
      position: relative;
      max-width: 900px;
      margin: 0 auto;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

      youtube-player {
        display: block;
        width: 100%;
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
export class VideoSectionComponent {}
