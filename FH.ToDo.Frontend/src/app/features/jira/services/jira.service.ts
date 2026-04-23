import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { GenerateTestCasesRequest } from '../models/generate-test-cases-request.model';
import { GenerateTestCasesResponse } from '../models/generate-test-cases-response.model';

@Injectable({ providedIn: 'root' })
export class JiraService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/api/jira`;

  generateTestCases(request: GenerateTestCasesRequest): Observable<GenerateTestCasesResponse> {
    return this.http
      .post<ApiResponse<GenerateTestCasesResponse>>(`${this.base}/testcases`, request)
      .pipe(map(r => r.data!));
  }
}
