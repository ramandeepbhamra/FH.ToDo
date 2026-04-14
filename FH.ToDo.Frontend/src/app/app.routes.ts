import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { DemoComponent } from './pages/demo/demo.component';
import { ButtonsComponent } from './pages/buttons/buttons.component';
import { InputsComponent } from './pages/inputs/inputs.component';
import { StepperComponent } from './pages/stepper/stepper.component';
import { TabsComponent } from './pages/tabs/tabs.component';
import { ProgressComponent } from './pages/progress/progress.component';
import { DialogComponent } from './pages/dialog/dialog.component';
import { PanelsComponent } from './pages/panels/panels.component';
import { TableComponent } from './pages/table/table.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'components',
    component: DemoComponent,
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
        path: 'dialog',
        component: DialogComponent,
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
