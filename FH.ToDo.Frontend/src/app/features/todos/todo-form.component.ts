import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { TodoTask } from '../../core/models/todo-task.model';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-todo-form',
  imports: [FormsModule, MatFormFieldModule, MatInput, MatButtonModule, MatIcon],
  templateUrl: './todo-form.component.html',
  styles: `
    .form-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }
  `,
})
export class TodoFormComponent {
  private readonly todoService = inject(TodoService);

  @Input({ required: true }) listId!: string;
  @Output() taskAdded = new EventEmitter<TodoTask>();

  readonly title = signal('');
  readonly isSubmitting = signal(false);

  submit(): void {
    const title = this.title().trim();
    if (!title || !this.listId) return;

    this.isSubmitting.set(true);
    this.todoService.create({ title, listId: this.listId }).subscribe({
      next: task => {
        this.taskAdded.emit(task);
        this.title.set('');
        this.isSubmitting.set(false);
      },
      error: () => this.isSubmitting.set(false),
    });
  }
}

