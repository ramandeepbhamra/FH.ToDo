import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-health-check-dialog',
  templateUrl: './health-check-dialog.component.html',
  styleUrl: './health-check-dialog.component.scss',
  imports: [MatDialogModule, MatButtonModule, MatIcon],
})
export class HealthCheckDialogComponent {
  refresh(): void {
    window.location.reload();
  }
}
