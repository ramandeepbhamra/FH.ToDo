import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { TodoTask } from '../models/todo-task.model';
import { TodoSubTask } from '../models/todo-sub-task.model';
import { TodoTaskCreateRequest } from '../models/todo-task-create-request.model';
import { TodoTaskUpdateRequest } from '../models/todo-task-update-request.model';
import { TodoSubTaskCreateRequest } from '../models/todo-sub-task-create-request.model';

@Injectable({ providedIn: 'root' })
export class TodoTaskService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/api/tasks`;

  getByList(listId: string): Observable<TodoTask[]> {
    return this.http
      .get<ApiResponse<TodoTask[]>>(`${this.base}?listId=${listId}`)
      .pipe(map(r => r.data!));
  }

  getFavourites(): Observable<TodoTask[]> {
    return this.http
      .get<ApiResponse<TodoTask[]>>(`${this.base}/favourites`)
      .pipe(map(r => r.data!));
  }

  create(request: TodoTaskCreateRequest): Observable<TodoTask> {
    return this.http
      .post<ApiResponse<TodoTask>>(this.base, request)
      .pipe(map(r => r.data!));
  }

  update(id: string, request: TodoTaskUpdateRequest): Observable<TodoTask> {
    return this.http
      .put<ApiResponse<TodoTask>>(`${this.base}/${id}`, request)
      .pipe(map(r => r.data!));
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.base}/${id}`)
      .pipe(map(() => undefined));
  }

  toggleComplete(id: string): Observable<TodoTask> {
    return this.http
      .patch<ApiResponse<TodoTask>>(`${this.base}/${id}/complete`, {})
      .pipe(map(r => r.data!));
  }

  toggleFavourite(id: string): Observable<TodoTask> {
    return this.http
      .patch<ApiResponse<TodoTask>>(`${this.base}/${id}/favourite`, {})
      .pipe(map(r => r.data!));
  }

  addSubTask(taskId: string, request: TodoSubTaskCreateRequest): Observable<TodoSubTask> {
    return this.http
      .post<ApiResponse<TodoSubTask>>(`${this.base}/${taskId}/subtasks`, request)
      .pipe(map(r => r.data!));
  }

  toggleSubTaskComplete(taskId: string, subTaskId: string): Observable<TodoSubTask> {
    return this.http
      .patch<ApiResponse<TodoSubTask>>(`${this.base}/${taskId}/subtasks/${subTaskId}/complete`, {})
      .pipe(map(r => r.data!));
  }

  deleteSubTask(taskId: string, subTaskId: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.base}/${taskId}/subtasks/${subTaskId}`)
      .pipe(map(() => undefined));
  }
}
