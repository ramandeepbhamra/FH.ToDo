import { Routes } from '@angular/router';

export const JIRA_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./jira-generator/jira-generator.component').then(m => m.JiraGeneratorComponent),
  },
];
