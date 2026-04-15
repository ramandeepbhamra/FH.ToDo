import { Routes } from '@angular/router';
import { TodoLayoutComponent } from './layout/todo-layout.component';
import { TodoListComponent } from './todo-list.component';
import { FavouritesComponent } from './favourites/favourites.component';

export const TODO_ROUTES: Routes = [
  {
    path: '',
    component: TodoLayoutComponent,
    children: [
      { path: '', redirectTo: 'favourites', pathMatch: 'full' },
      { path: 'favourites', component: FavouritesComponent },
      { path: 'list/:listId', component: TodoListComponent },
    ],
  },
];

