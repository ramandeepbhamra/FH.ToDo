import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { TaskList } from '../../../core/models/task-list.model';
import { TaskListService } from '../task-list.service';

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
  ],
  templateUrl: './todo-sidebar.component.html',
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .new-list-form {
      padding: 8px 16px 16px;
    }
  `,
})
export class TodoSidebarComponent {
  private readonly taskListService = inject(TaskListService);

  @Input() taskLists: TaskList[] = [];
  @Output() listCreated = new EventEmitter<TaskList>();
  @Output() listDeleted = new EventEmitter<string>();
  @Output() listRenamed = new EventEmitter<TaskList>();

  readonly showNewListInput = signal(false);
  readonly newListTitle = signal('');

  submitNewList(): void {
    const title = this.newListTitle().trim();
    if (!title) return;

    this.taskListService.create({ title }).subscribe(list => {
      this.listCreated.emit(list);
      this.newListTitle.set('');
      this.showNewListInput.set(false);
    });
  }

  cancelNewList(): void {
    this.newListTitle.set('');
    this.showNewListInput.set(false);
  }
}
