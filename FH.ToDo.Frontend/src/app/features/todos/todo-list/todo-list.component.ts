import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoTask } from '../models/todo-task.model';
import { TodoTaskService } from '../services/todo-task.service';

@Component({
  selector: 'app-todo-list',
  imports: [
    FormsModule,
    TodoFormComponent, 
    TodoItemComponent, 
    DragDropModule, 
    MatIcon,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatTabsModule,
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly todoTaskService = inject(TodoTaskService);

  readonly listId = signal<string>('');
  readonly tasks = signal<TodoTask[]>([]);

  // Filters
  readonly searchText = signal<string>('');
  readonly showFavouritesOnly = signal<boolean>(false);
  readonly selectedTabIndex = signal<number>(0);

  readonly activeTasks = computed(() => this.tasks().filter(t => !t.isCompleted).sort((a, b) => a.order - b.order));
  readonly completedTasks = computed(() => this.tasks().filter(t => t.isCompleted).sort((a, b) => a.order - b.order));

  // Filtered results
  readonly filteredActiveTasks = computed(() => this.applyFilters(this.activeTasks()));
  readonly filteredCompletedTasks = computed(() => this.applyFilters(this.completedTasks()));

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('listId') ?? '';
      this.listId.set(id);
      this.loadTasks(id);
    });
  }

  loadTasks(listId: string): void {
    this.todoTaskService.getByList(listId).subscribe(tasks => this.tasks.set(tasks));
  }

  applyFilters(tasks: TodoTask[]): TodoTask[] {
    let filtered = tasks;

    // Search filter
    if (this.searchText()) {
      const search = this.searchText().toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(search) ||
        t.subTasks.some(st => st.title.toLowerCase().includes(search))
      );
    }

    // Favourites filter
    if (this.showFavouritesOnly()) {
      filtered = filtered.filter(t => t.isFavourite);
    }

    return filtered;
  }

  clearFilters(): void {
    this.searchText.set('');
    this.showFavouritesOnly.set(false);
  }

  onTaskAdded(task: TodoTask): void {
    this.tasks.update(tasks => [...tasks, task]);
  }

  onTaskUpdated(updated: TodoTask): void {
    this.tasks.update(tasks => tasks.map(t => t.id === updated.id ? updated : t));
  }

  onTaskDeleted(taskId: string): void {
    this.tasks.update(tasks => tasks.filter(t => t.id !== taskId));
  }

  onTaskDrop(event: CdkDragDrop<TodoTask[]>): void {
    const tasks = this.activeTasks();
    moveItemInArray(tasks, event.previousIndex, event.currentIndex);

    // Update order property
    tasks.forEach((task, index) => {
      task.order = index + 1;
    });

    // Update state
    this.tasks.update(allTasks => {
      const updatedTasks = [...allTasks];
      tasks.forEach(task => {
        const idx = updatedTasks.findIndex(t => t.id === task.id);
        if (idx !== -1) updatedTasks[idx] = task;
      });
      return updatedTasks;
    });

    // Persist to backend
    this.todoTaskService.updateOrder(this.listId(), tasks.map(t => ({ id: t.id, order: t.order }))).subscribe();
  }
}
