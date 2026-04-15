import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/models/api-response.model';
import { TaskList } from '../../core/models/task-list.model';
import { CreateTaskListRequest } from '../../core/models/create-task-list-request.model';
import { UpdateTaskListRequest } from '../../core/models/update-task-list-request.model';

@Injectable({ providedIn: 'root' })
export class TaskListService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/api/tasklists`;

  getAll(): Observable<TaskList[]> {
    return this.http
      .get<ApiResponse<TaskList[]>>(this.base)
      .pipe(map(r => r.data!));
  }

  create(request: CreateTaskListRequest): Observable<TaskList> {
    return this.http
      .post<ApiResponse<TaskList>>(this.base, request)
      .pipe(map(r => r.data!));
  }

  update(id: string, request: UpdateTaskListRequest): Observable<TaskList> {
    return this.http
      .put<ApiResponse<TaskList>>(`${this.base}/${id}`, request)
      .pipe(map(r => r.data!));
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.base}/${id}`)
      .pipe(map(() => undefined));
  }
}
