import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { catchError, firstValueFrom, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ConfigService } from '../services/config.service';
import { HealthCheckDialogComponent } from '../../shared/components/health-check-dialog/health-check-dialog.component';

export function appInitializer(): () => Promise<void> {
  return async () => {
    const http   = inject(HttpClient);
    const config = inject(ConfigService);
    const dialog = inject(MatDialog);

    // 1. Health check — show blocking dialog if API is unreachable
    const healthy = await firstValueFrom(
      http.get(`${environment.apiBaseUrl}/health`, { responseType: 'text' }).pipe(
        catchError(() => of(null))
      )
    );

    if (!healthy) {
      dialog.open(HealthCheckDialogComponent, { disableClose: true, width: '400px' });
      return;
    }

    // 2. Load remote config (session timeout settings etc.)
    await firstValueFrom(config.load().pipe(catchError(() => of(null))));
  };
}
