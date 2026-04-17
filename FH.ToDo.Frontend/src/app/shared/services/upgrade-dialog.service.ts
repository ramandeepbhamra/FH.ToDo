import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '../../core/services/config.service';

@Injectable({ providedIn: 'root' })
export class UpgradeDialogService {
  private readonly dialog = inject(MatDialog);
  private readonly configService = inject(ConfigService);

  /**
   * Opens the upgrade prompt dialog
   * @param title Dialog title
   * @param message Dialog message
   */
  async openUpgradeDialog(title: string, message: string): Promise<void> {
    const { UpgradePromptDialogComponent } = await import(
      '../components/upgrade-prompt-dialog/upgrade-prompt-dialog.component'
    );

    const supportEmail = this.configService.config().supportEmail;
    const mailtoLink = `mailto:${supportEmail}`;

    this.dialog.open(UpgradePromptDialogComponent, {
      width: '500px',
      disableClose: false,
      data: { 
        title, 
        message, 
        mailtoLink 
      },
    });
  }

  /**
   * Opens upgrade dialog for task limit exceeded
   */
  openTaskLimitDialog(): void {
    this.openUpgradeDialog(
      'Upgrade to Premium',
      'Upgrade to Premium for unlimited access to all features.'
    );
  }

  /**
   * Opens upgrade dialog for task list limit exceeded
   */
  openTaskListLimitDialog(): void {
    this.openUpgradeDialog(
      'Upgrade to Premium',
      'Upgrade to Premium for unlimited access to all features.'
    );
  }
}
