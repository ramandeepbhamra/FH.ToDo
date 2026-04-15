import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoTask } from '../models/todo-task.model';
import { TodoTaskService } from '../services/todo-task.service';

@Component({
  selector: 'app-todo-list',
  imports: [TodoFormComponent, TodoItemComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly todoTaskService = inject(TodoTaskService);

  readonly listId = signal<string>('');
  readonly tasks = signal<TodoTask[]>([]);

  readonly activeTasks = () => this.tasks().filter(t => !t.isCompleted).sort((a, b) => a.order - b.order);
  readonly completedTasks = () => this.tasks().filter(t => t.isCompleted).sort((a, b) => a.order - b.order);

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

  onTaskAdded(task: TodoTask): void {
    this.tasks.update(tasks => [...tasks, task]);
  }

  onTaskUpdated(updated: TodoTask): void {
    this.tasks.update(tasks => tasks.map(t => t.id === updated.id ? updated : t));
  }

  onTaskDeleted(taskId: string): void {
    this.tasks.update(tasks => tasks.filter(t => t.id !== taskId));
  }
}
