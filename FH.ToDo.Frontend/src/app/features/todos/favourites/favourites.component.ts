import { Component, inject, OnInit, signal } from '@angular/core';
import { TodoItemComponent } from '../todo-item.component';
import { TodoTask } from '../../../core/models/todo-task.model';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-favourites',
  imports: [TodoItemComponent],
  templateUrl: './favourites.component.html',
  styles: ``,
})
export class FavouritesComponent implements OnInit {
  private readonly todoService = inject(TodoService);

  readonly tasks = signal<TodoTask[]>([]);

  ngOnInit(): void {
    this.todoService.getFavourites().subscribe(tasks => this.tasks.set(tasks));
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
