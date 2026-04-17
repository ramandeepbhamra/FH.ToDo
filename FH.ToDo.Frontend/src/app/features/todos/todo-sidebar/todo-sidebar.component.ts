import { Component, inject, input, output, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatTooltipModule,
    TrimOnBlurDirective,
  ],
  templateUrl: './todo-sidebar.component.html',
  styleUrl: './todo-sidebar.component.scss',
})
export class TodoSidebarComponent {
  private readonly taskListService = inject(TodoTaskListService);
  private readonly upgradeDialog = inject(UpgradeDialogService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

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
        if (err.status === 400 && err.error?.message?.includes('task list')) {
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

  async confirmDelete(event: Event, list: TodoTaskList): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    const { ConfirmDialogComponent } = await import(
      '../../../shared/components/confirm-dialog/confirm-dialog.component'
    );

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Task List',
        message: `Are you sure you want to delete "${list.title}"? All tasks and subtasks in this list will also be deleted.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.deleteList(list.id);
      }
    });
  }

  private deleteList(id: string): void {
    // Check if we're deleting the currently active list
    const isCurrentList = this.router.url.includes(`/todos/list/${id}`);

    this.taskListService.delete(id).subscribe({
      next: () => {
        this.listDeleted.emit(id);
        this.snackBar.open('Task list deleted successfully', 'Close', { duration: 3000 });

        // Navigate to favorites if deleting the current list
        if (isCurrentList) {
          this.router.navigate(['/todos/favourites']);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open(err.error?.message || 'Failed to delete task list', 'Close', { duration: 3000 });
      },
    });
  }
}
