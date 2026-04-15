import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/models/api-response.model';
import { TodoTask } from '../../core/models/todo-task.model';
import { SubTask } from '../../core/models/sub-task.model';
import { CreateTodoTaskRequest } from '../../core/models/create-todo-task-request.model';
import { UpdateTodoTaskRequest } from '../../core/models/update-todo-task-request.model';
import { CreateSubTaskRequest } from '../../core/models/create-sub-task-request.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
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

  create(request: CreateTodoTaskRequest): Observable<TodoTask> {
    return this.http
      .post<ApiResponse<TodoTask>>(this.base, request)
      .pipe(map(r => r.data!));
  }

  update(id: string, request: UpdateTodoTaskRequest): Observable<TodoTask> {
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

  addSubTask(taskId: string, request: CreateSubTaskRequest): Observable<SubTask> {
    return this.http
      .post<ApiResponse<SubTask>>(`${this.base}/${taskId}/subtasks`, request)
      .pipe(map(r => r.data!));
  }

  toggleSubTaskComplete(taskId: string, subTaskId: string): Observable<SubTask> {
    return this.http
      .patch<ApiResponse<SubTask>>(`${this.base}/${taskId}/subtasks/${subTaskId}/complete`, {})
      .pipe(map(r => r.data!));
  }

  deleteSubTask(taskId: string, subTaskId: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.base}/${taskId}/subtasks/${subTaskId}`)
      .pipe(map(() => undefined));
  }
}

