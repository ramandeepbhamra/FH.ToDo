import { Routes } from '@angular/router';
import { DashboardHomeComponent } from './features/dashboard/dashboard-home/dashboard-home.component';
import { DevtoolsComponent } from './features/devtools/devtools.component';
import { ButtonsComponent } from './features/devtools/buttons.component';
import { InputsComponent } from './features/devtools/inputs.component';
import { StepperComponent } from './features/devtools/stepper.component';
import { TabsComponent } from './features/devtools/tabs.component';
import { ProgressComponent } from './features/devtools/progress.component';
import { DialogComponent } from './features/devtools/dialog.component';
import { PanelsComponent } from './features/devtools/panels.component';
import { TableComponent } from './features/devtools/table.component';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardHomeComponent },
      {
        path: 'dev-tools',
        component: DevtoolsComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'buttons' },
          { path: 'buttons', component: ButtonsComponent },
          { path: 'inputs', component: InputsComponent },
          { path: 'progress', component: ProgressComponent },
          { path: 'dialog', component: DialogComponent },
          { path: 'panels', component: PanelsComponent },
          { path: 'table', component: TableComponent },
          { path: 'stepper', component: StepperComponent },
          { path: 'tabs', component: TabsComponent },
        ],
      },
      {
        path: 'users',
        loadChildren: () => import('./features/users/users.routes').then(m => m.USER_ROUTES),
      },
      {
        path: 'todos',
        loadChildren: () => import('./features/todos/todos.routes').then(m => m.TODO_ROUTES),
      },
    ],
  },
  { path: '**', redirectTo: 'auth/login' },
];

