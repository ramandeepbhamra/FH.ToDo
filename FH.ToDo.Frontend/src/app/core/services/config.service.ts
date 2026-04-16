import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/models/api-response.model';
import { AppConfig } from '../models/app-config.model';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly http = inject(HttpClient);

  readonly config = signal<AppConfig>({ idleTimeoutMinutes: 15, warningCountdownSeconds: 30 });

  load(): Observable<AppConfig> {
    return this.http
      .get<ApiResponse<AppConfig>>(`${environment.apiBaseUrl}/api/config`)
      .pipe(
        map(r => r.data!),
        tap(c => this.config.set(c))
      );
  }
}
