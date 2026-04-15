import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TodoSidebarComponent } from './todo-sidebar.component';
import { ResponsiveService } from '../../../core/services/responsive.service';
import { TaskListService } from '../task-list.service';
import { TaskList } from '../../../core/models/task-list.model';

@Component({
  selector: 'app-todo-layout',
  imports: [RouterOutlet, MatSidenavModule, TodoSidebarComponent],
  templateUrl: './todo-layout.component.html',
  styles: `
    mat-drawer-container {
      height: calc(100vh - 64px);
    }

    .sidebar {
      width: 220px;
      background: var(--background);
      --mat-sidenav-container-divider-color: var(--primary-light);
    }
  `,
})
export class TodoLayoutComponent implements OnInit {
  private readonly taskListService = inject(TaskListService);
  private readonly responsiveService = inject(ResponsiveService);

  readonly taskLists = signal<TaskList[]>([]);
  readonly drawerOpen = signal(true);

  readonly drawerMode = computed(() =>
    this.responsiveService.smallWidth() ? 'over' : 'side'
  );

  ngOnInit(): void {
    this.taskListService.getAll().subscribe(lists => this.taskLists.set(lists));
  }

  onListCreated(list: TaskList): void {
    this.taskLists.update(lists => [...lists, list]);
  }

  onListDeleted(listId: string): void {
    this.taskLists.update(lists => lists.filter(l => l.id !== listId));
  }

  onListRenamed(updated: TaskList): void {
    this.taskLists.update(lists => lists.map(l => l.id === updated.id ? updated : l));
  }
}
