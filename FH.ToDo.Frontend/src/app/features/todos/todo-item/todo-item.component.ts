import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TodoTask } from '../models/todo-task.model';
import { TodoTaskService } from '../services/todo-task.service';

@Component({
  selector: 'app-todo-item',
  imports: [FormsModule, MatCheckbox, MatButtonModule, MatFormFieldModule, MatInput, MatIcon],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
})
export class TodoItemComponent {
  private readonly todoTaskService = inject(TodoTaskService);
  private readonly snackBar = inject(MatSnackBar);

  readonly task = input.required<TodoTask>();
  readonly taskUpdated = output<TodoTask>();
  readonly taskDeleted = output<string>();

  readonly isEditing = signal(false);
  readonly editTitle = signal('');
  readonly newSubTaskTitle = signal('');
  readonly showSubTasks = signal(false);

  get isDueDateOverdue(): boolean {
    if (!this.task().dueDate || this.task().isCompleted) return false;
    return new Date(this.task().dueDate!) < new Date();
  }

  toggleComplete(): void {
    this.todoTaskService.toggleComplete(this.task().id).subscribe(updated => this.taskUpdated.emit(updated));
  }

  toggleFavourite(): void {
    this.todoTaskService.toggleFavourite(this.task().id).subscribe(updated => this.taskUpdated.emit(updated));
  }

  startEdit(): void {
    this.editTitle.set(this.task().title);
    this.isEditing.set(true);
  }

  saveEdit(): void {
    const title = this.editTitle().trim();
    if (!title) { this.cancelEdit(); return; }
    this.todoTaskService
      .update(this.task().id, { title, listId: this.task().listId, dueDate: this.task().dueDate })
      .subscribe(updated => {
        this.taskUpdated.emit(updated);
        this.isEditing.set(false);
      });
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }

  delete(): void {
    this.todoTaskService.delete(this.task().id).subscribe(() => this.taskDeleted.emit(this.task().id));
  }

  toggleSubTaskComplete(subTaskId: string): void {
    this.todoTaskService.toggleSubTaskComplete(this.task().id, subTaskId).subscribe(updated => {
      const subTasks = this.task().subTasks.map(s => s.id === updated.id ? updated : s);
      this.taskUpdated.emit({ ...this.task(), subTasks });
    });
  }

  deleteSubTask(subTaskId: string): void {
    this.todoTaskService.deleteSubTask(this.task().id, subTaskId).subscribe(() => {
      const subTasks = this.task().subTasks.filter(s => s.id !== subTaskId);
      this.taskUpdated.emit({ ...this.task(), subTasks });
    });
  }

  addSubTask(): void {
    const title = this.newSubTaskTitle().trim();
    if (!title) return;

    this.todoTaskService.addSubTask(this.task().id, { title }).subscribe({
      next: (subTask) => {
        this.taskUpdated.emit({ ...this.task(), subTasks: [...this.task().subTasks, subTask] });
        this.newSubTaskTitle.set('');
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open(err.error?.message || 'Failed to add subtask', 'Close', { duration: 3000 });
      }
    });
  }
}
