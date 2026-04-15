import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { DevtoolsComponent } from './features/devtools/devtools.component';
import { ButtonsComponent } from './features/devtools/buttons.component';
import { InputsComponent } from './features/devtools/inputs.component';
import { StepperComponent } from './features/devtools/stepper.component';
import { TabsComponent } from './features/devtools/tabs.component';
import { ProgressComponent } from './features/devtools/progress.component';
import { DialogComponent } from './features/devtools/dialog.component';
import { PanelsComponent } from './features/devtools/panels.component';
import { TableComponent } from './features/devtools/table.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'dev-tools',
    component: DevtoolsComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'buttons',
      },
      {
        path: 'buttons',
        component: ButtonsComponent,
      },
      {
        path: 'inputs',
        component: InputsComponent,
      },
      {
        path: 'progress',
        component: ProgressComponent,
      },
      {
        path: 'dialog',
        component: DialogComponent,
      },
      {
        path: 'panels',
        component: PanelsComponent,
      },
      {
        path: 'table',
        component: TableComponent,
      },
      {
        path: 'stepper',
        component: StepperComponent,
      },
      {
        path: 'tabs',
        component: TabsComponent,
      },
    ],
  },
];

