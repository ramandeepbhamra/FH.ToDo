# FH.ToDo Frontend

Angular 19 SPA for the FH.ToDo task management application.

---

## Stack

| | |
|---|---|
| Framework | Angular 19 |
| UI | Angular Material 19 |
| Language | TypeScript (strict mode) |
| Styles | SCSS |
| Forms | Angular Reactive Forms (typed) |
| HTTP | Angular HttpClient + JWT interceptor |
| Auth | JWT + refresh token rotation |

---

## Running locally

```bash
npm install
ng serve
# → http://localhost:4200
```

Backend must be running at `http://localhost:5214` (see root README).

---

## Folder structure

```
src/app/
├── core/
│   ├── guards/          # auth.guard.ts
│   ├── interceptors/    # auth.interceptor.ts (attaches JWT, handles 401 refresh)
│   └── services/        # auth.service.ts, storage.service.ts, theming.service.ts …
│
├── features/
│   ├── auth/
│   │   ├── auth-login/        # login page component
│   │   ├── auth-register/     # register page component
│   │   ├── forms/             # AuthLoginForm, AuthRegisterForm interfaces
│   │   └── models/            # AuthLoginRequest, AuthLoginResponse, AuthUser …
│   │
│   ├── todos/
│   │   ├── todo-layout/       # sidebar shell component
│   │   ├── todo-sidebar/      # task list navigation
│   │   ├── todo-list/         # tasks for a list
│   │   ├── todo-item/         # single task row + subtasks
│   │   ├── todo-form/         # add-task input
│   │   ├── todo-favourites/   # starred tasks page
│   │   ├── forms/             # TodoTaskForm, TodoTaskListForm interfaces
│   │   ├── models/            # TodoTask, TodoTaskList, TodoSubTask, request models
│   │   └── services/          # TodoTaskService, TodoTaskListService
│   │
│   ├── users/
│   │   ├── user-list/         # (stub)
│   │   ├── user-form/         # (stub)
│   │   ├── forms/             # UserForm interface
│   │   ├── models/            # User, UserListItem, UserCreateRequest …
│   │   └── services/          # UserService (stub)
│   │
│   ├── dashboard/             # Landing page (hero, video, features, pricing …)
│   │   ├── dashboard-home/
│   │   ├── dashboard-hero-section/
│   │   └── … (one folder per section)
│   │
│   └── devtools/              # Angular Material component showcase (keep as-is)
│
├── layout/
│   └── app-layout/            # Shell: navigation bar + theme sidenav
│
└── shared/
    ├── components/
    │   ├── app-navigation/    # Top nav bar
    │   ├── app-toolbar/       # Toolbar (used in devtools)
    │   └── app-theme-selector/# Theme colour picker sidenav content
    ├── directives/            # scroll-animation.directive.ts
    └── models/                # api-response.model, entity.model, paged-*.model
```

---

## Conventions

### Component structure
Every component has its own folder. All three files are required:

```
{feature}-{component}/
  {feature}-{component}.component.ts    ← templateUrl + styleUrl (no inline)
  {feature}-{component}.component.html
  {feature}-{component}.component.scss
```

### File naming
`{feature}-{entity}-{operation}.{type}.ts`

| Example | Explanation |
|---|---|
| `todo-task-create-request.model.ts` | feature=todo, entity=task, operation=create |
| `auth-login-request.model.ts` | feature=auth, entity=login, operation=request |
| `todo-task.form.ts` | typed form interface for a task |

### Forms
`.form.ts` files contain **only the typed interface** — `FormGroup<T>` is instantiated in the component:

```typescript
// todo-task.form.ts — interface only
export interface TodoTaskForm {
  title: FormControl<string>;
  dueDate: FormControl<string | null>;
}

// todo-form.component.ts — form created here
readonly form = new FormGroup<TodoTaskForm>({
  title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  dueDate: new FormControl<string | null>(null),
});
```

### Error checking in templates
Use bracket notation — dot notation is rejected by `strictTemplates` + `noPropertyAccessFromIndexSignature`:

```html
@if (form.controls.email.errors?.['required'] && form.controls.email.touched) {
  <mat-error>Email is required</mat-error>
}
```

### Models
- One interface per file
- API contracts go in `models/` — no `Form` suffix
- Form interfaces go in `forms/` — `Form` suffix required
- `virtual` is a C# concept — not applicable here
