import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface UpgradePromptDialogData {
  title: string;
  message: string;
  mailtoLink: string;
}

@Component({
  selector: 'app-upgrade-prompt-dialog',
  templateUrl: './upgrade-prompt-dialog.component.html',
  styleUrl: './upgrade-prompt-dialog.component.scss',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class UpgradePromptDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<UpgradePromptDialogComponent>);
  readonly data = inject<UpgradePromptDialogData>(MAT_DIALOG_DATA);

  contactSupport(): void {
    window.location.href = this.data.mailtoLink;
    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close();
  }
}
