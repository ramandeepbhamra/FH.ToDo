import { Component, inject, OnInit, signal } from '@angular/core';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoTask } from '../models/todo-task.model';
import { TodoTaskService } from '../services/todo-task.service';

@Component({
  selector: 'app-todo-favourites',
  imports: [TodoItemComponent],
  templateUrl: './todo-favourites.component.html',
  styleUrl: './todo-favourites.component.scss',
})
export class TodoFavouritesComponent implements OnInit {
  private readonly todoTaskService = inject(TodoTaskService);

  readonly tasks = signal<TodoTask[]>([]);

  ngOnInit(): void {
    this.todoTaskService.getFavourites().subscribe(tasks => this.tasks.set(tasks));
  }

  onTaskUpdated(updated: TodoTask): void {
    this.tasks.update(tasks =>
      updated.isFavourite
        ? tasks.map(t => t.id === updated.id ? updated : t)
        : tasks.filter(t => t.id !== updated.id)
    );
  }

  onTaskDeleted(taskId: string): void {
    this.tasks.update(tasks => tasks.filter(t => t.id !== taskId));
  }
}
