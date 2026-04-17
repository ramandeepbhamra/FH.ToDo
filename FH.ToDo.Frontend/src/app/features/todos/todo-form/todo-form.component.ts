import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TodoTask } from '../models/todo-task.model';
import { TodoTaskService } from '../services/todo-task.service';
import { TrimOnBlurDirective } from '../../../core/directives/trim-on-blur.directive';
import { UpgradeDialogService } from '../../../shared/services/upgrade-dialog.service';

@Component({
  selector: 'app-todo-form',
  imports: [FormsModule, MatFormFieldModule, MatInput, MatButtonModule, MatIcon, TrimOnBlurDirective],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.scss',
})
export class TodoFormComponent {
  private readonly todoTaskService = inject(TodoTaskService);
  private readonly upgradeDialog = inject(UpgradeDialogService);
  private readonly snackBar = inject(MatSnackBar);

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
      error: (err: HttpErrorResponse) => {
        if (err.status === 400 && err.error?.message?.includes('Upgrade to Premium')) {
          this.upgradeDialog.openTaskLimitDialog();
        } else {
          this.snackBar.open(err.error?.message || 'Failed to create task', 'Close', { duration: 3000 });
        }
        this.isSubmitting.set(false);
      },
    });
  }
}
