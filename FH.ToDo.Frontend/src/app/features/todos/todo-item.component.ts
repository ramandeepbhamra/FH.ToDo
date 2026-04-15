import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { TodoTask } from '../../core/models/todo-task.model';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-todo-item',
  imports: [
    FormsModule,
    MatCheckbox,
    MatButtonModule,
    MatFormFieldModule,
    MatInput,
    MatIcon,
  ],
  templateUrl: './todo-item.component.html',
  styles: `
    .task-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 0;
      border-bottom: 1px solid var(--primary-light);
    }

    .task-title {
      flex: 1;
      cursor: pointer;
    }

    .task-title.completed {
      text-decoration: line-through;
      opacity: 0.6;
    }

    .due-date {
      font-size: 0.75rem;
      color: var(--primary-dark);
    }

    .due-date.overdue {
      color: var(--error);
    }

    .subtasks {
      margin-left: 40px;
      padding-bottom: 4px;
    }

    .subtask-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 0;
    }

    .subtask-title {
      flex: 1;
      font-size: 0.875rem;
    }

    .subtask-title.completed {
      text-decoration: line-through;
      opacity: 0.6;
    }
  `,
})
export class TodoItemComponent {
  private readonly todoService = inject(TodoService);

  @Input({ required: true }) task!: TodoTask;
  @Output() taskUpdated = new EventEmitter<TodoTask>();
  @Output() taskDeleted = new EventEmitter<string>();

  readonly isEditing = signal(false);
  readonly editTitle = signal('');
  readonly newSubTaskTitle = signal('');
  readonly showSubTasks = signal(false);

  get isDueDateOverdue(): boolean {
    if (!this.task.dueDate || this.task.isCompleted) return false;
    return new Date(this.task.dueDate) < new Date();
  }

  toggleComplete(): void {
    this.todoService.toggleComplete(this.task.id).subscribe(updated => this.taskUpdated.emit(updated));
  }

  toggleFavourite(): void {
    this.todoService.toggleFavourite(this.task.id).subscribe(updated => this.taskUpdated.emit(updated));
  }

  startEdit(): void {
    this.editTitle.set(this.task.title);
    this.isEditing.set(true);
  }

  saveEdit(): void {
    const title = this.editTitle().trim();
    if (!title) { this.cancelEdit(); return; }
    this.todoService
      .update(this.task.id, { title, listId: this.task.listId, dueDate: this.task.dueDate })
      .subscribe(updated => {
        this.taskUpdated.emit(updated);
        this.isEditing.set(false);
      });
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }

  delete(): void {
    this.todoService.delete(this.task.id).subscribe(() => this.taskDeleted.emit(this.task.id));
  }

  toggleSubTaskComplete(subTaskId: string): void {
    this.todoService.toggleSubTaskComplete(this.task.id, subTaskId).subscribe(updated => {
      const subTasks = this.task.subTasks.map(s => s.id === updated.id ? updated : s);
      this.taskUpdated.emit({ ...this.task, subTasks });
    });
  }

  deleteSubTask(subTaskId: string): void {
    this.todoService.deleteSubTask(this.task.id, subTaskId).subscribe(() => {
      const subTasks = this.task.subTasks.filter(s => s.id !== subTaskId);
      this.taskUpdated.emit({ ...this.task, subTasks });
    });
  }

  addSubTask(): void {
    const title = this.newSubTaskTitle().trim();
    if (!title) return;
    this.todoService.addSubTask(this.task.id, { title }).subscribe(subTask => {
      this.taskUpdated.emit({ ...this.task, subTasks: [...this.task.subTasks, subTask] });
      this.newSubTaskTitle.set('');
    });
  }
}

