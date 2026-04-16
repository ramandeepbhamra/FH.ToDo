import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { TodoTask } from '../models/todo-task.model';
import { TodoTaskService } from '../services/todo-task.service';

@Component({
  selector: 'app-todo-form',
  imports: [FormsModule, MatFormFieldModule, MatInput, MatButtonModule, MatIcon],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.scss',
})
export class TodoFormComponent {
  private readonly todoTaskService = inject(TodoTaskService);

  readonly listId = input.required<string>();
  readonly taskAdded = output<TodoTask>();

  readonly title = signal('');
  readonly isSubmitting = signal(false);

  submit(): void {
    const title = this.title().trim();
    if (!title || !this.listId()) return;

    this.isSubmitting.set(true);
    this.todoTaskService.create({ title, listId: this.listId() }).subscribe({
      next: task => {
        this.taskAdded.emit(task);
        this.title.set('');
        this.isSubmitting.set(false);
      },
      error: () => this.isSubmitting.set(false),
    });
  }
}
