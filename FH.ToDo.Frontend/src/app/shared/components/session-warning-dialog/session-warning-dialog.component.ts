import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, Subscription } from 'rxjs';

export interface SessionWarningDialogData {
  totalSeconds: number;
  countdown$: Observable<number>;
}

@Component({
  selector: 'app-session-warning-dialog',
  templateUrl: './session-warning-dialog.component.html',
  styleUrl: './session-warning-dialog.component.scss',
  imports: [MatDialogModule, MatButtonModule, MatIcon, MatProgressSpinnerModule],
})
export class SessionWarningDialogComponent implements OnInit, OnDestroy {
  readonly dialogRef = inject(MatDialogRef<SessionWarningDialogComponent>);
  readonly data: SessionWarningDialogData = inject(MAT_DIALOG_DATA);

  readonly countdown = signal(this.data.totalSeconds);
  private sub: Subscription | null = null;

  ngOnInit(): void {
    this.sub = this.data.countdown$.subscribe(value => this.countdown.set(value));
  }

  stayLoggedIn(): void {
    this.dialogRef.close(true);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
