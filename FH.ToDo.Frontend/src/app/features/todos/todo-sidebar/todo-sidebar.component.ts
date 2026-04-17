import { Component, inject, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TodoTaskList } from '../models/todo-task-list.model';
import { TodoTaskListService } from '../services/todo-task-list.service';
import { TrimOnBlurDirective } from '../../../core/directives/trim-on-blur.directive';
import { UpgradeDialogService } from '../../../shared/services/upgrade-dialog.service';

@Component({
  selector: 'app-todo-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive,
    FormsModule,
    MatListModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInput,
    MatIcon,
    TrimOnBlurDirective,
  ],
  templateUrl: './todo-sidebar.component.html',
  styleUrl: './todo-sidebar.component.scss',
})
export class TodoSidebarComponent {
  private readonly taskListService = inject(TodoTaskListService);
  private readonly upgradeDialog = inject(UpgradeDialogService);
  private readonly snackBar = inject(MatSnackBar);

  readonly taskLists = input<TodoTaskList[]>([]);
  readonly listCreated = output<TodoTaskList>();
  readonly listDeleted = output<string>();
  readonly listRenamed = output<TodoTaskList>();

  readonly showNewListInput = signal(false);
  readonly newListTitle = signal('');

  submitNewList(): void {
    const title = this.newListTitle().trim();
    if (!title) return;

    this.taskListService.create({ title }).subscribe({
      next: (list) => {
        this.listCreated.emit(list);
        this.newListTitle.set('');
        this.showNewListInput.set(false);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 400 && err.error?.message?.includes('Upgrade to Premium')) {
          this.upgradeDialog.openTaskListLimitDialog();
        } else {
          this.snackBar.open(err.error?.message || 'Failed to create task list', 'Close', { duration: 3000 });
        }
      }
    });
  }

  cancelNewList(): void {
    this.newListTitle.set('');
    this.showNewListInput.set(false);
  }
}
