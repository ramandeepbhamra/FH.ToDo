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
| Auth | JWT + refresh token rotation + dialog-based auth |
| Session | @ng-idle/core (idle timeout + warning dialog) |
| App Init | Health check + config loading on startup |

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
│   ├── services/        # auth.service.ts, auth-dialog.service.ts, idle.service.ts, config.service.ts, storage.service.ts …
│   ├── directives/      # trim-on-blur.directive.ts
│   ├── initializers/    # app.initializer.ts (health check + config load)
│   ├── matchers/        # password-match.matcher.ts
│   ├── validators/      # password-match.validator.ts, no-whitespace.validator.ts
│   └── models/          # app-config.model.ts
│
├── features/
│   ├── auth/
│   │   ├── auth-login-dialog/        # login dialog component (lazy-loaded)
│   │   ├── auth-register-dialog/     # register dialog component (lazy-loaded)
│   │   ├── forms/                    # AuthLoginForm, AuthRegisterForm interfaces
│   │   └── models/                   # AuthLoginRequest, AuthLoginResponse, AuthUser …
│   │
│   ├── profile/
│   │   ├── user-profile-dialog/      # edit own profile dialog (lazy-loaded)
│   │   ├── forms/                    # UserProfileForm interface
│   │   └── models/                   # UpdateProfileRequest
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
│   │   ├── user-list/         # user management list
│   │   ├── user-form/         # user create/edit dialog
│   │   ├── forms/             # UserForm interface
│   │   ├── models/            # User, UserListItem, UserCreateRequest …
│   │   └── services/          # UserService
│   │
│   ├── dashboard/             # Landing page (hero, video, features, pricing …)
│   │   ├── dashboard-home/
│   │   ├── dashboard-hero-section/
│   │   ├── dashboard-pricing-section/  # shows Basic (unauthenticated) / Premium (authenticated) cards
│   │   ├── dashboard-features-section/ # todo app features
│   │   └── … (one folder per section)
│   │
│   └── devtools/              # Angular Material component showcase (keep as-is)
│
├── layout/
│   └── app-layout/            # Shell: navigation bar + theme sidenav
│
└── shared/
    ├── components/
    │   ├── app-navigation/           # Top nav bar (shows Sign in/Register when unauthenticated, username when authenticated)
    │   ├── app-toolbar/              # Toolbar (used in devtools)
    │   ├── app-theme-selector/       # Theme colour picker sidenav content
    │   ├── session-warning-dialog/   # Idle timeout warning with live countdown
    │   └── health-check-dialog/      # Non-dismissable dialog shown when API is unreachable
    ├── directives/            # scroll-animation.directive.ts
    └── models/                # api-response.model, entity.model, paged-*.model
```

---

## Conventions

### Authentication Architecture
- **Dialog-based authentication** — no route-based `/auth/login` or `/auth/register` pages
- Use `AuthDialogService.openLogin()` and `AuthDialogService.openRegister()` to show auth modals
- Dashboard route (`/`) is **public** — unauthenticated users see it with login dialog overlay when needed
- Auth dialogs are lazy-loaded via dynamic imports: `import('...').then(m => dialog.open(m.AuthLoginDialogComponent))`
- Switching between login/register automatically closes the other dialog first

### Session Management
- Session idle timeout implemented using `@ng-idle/core` wrapped by abstract `IdleService`
- Concrete implementation: `NgIdleService` (registered as `useClass` in `app.config.ts`)
- To swap libraries, implement `IdleService` and change the provider binding
- Configuration loaded from backend via `GET /api/config` during app initialization
- `SessionWarningDialogComponent` displays live countdown driven by `idle.onTimeoutWarning` observable
- Idle service started when user authenticates, stopped on logout
- Settings: `config().idleTimeoutMinutes` and `config().warningCountdownSeconds`

### App Initialization
- `app.initializer.ts` runs **before** Angular bootstrap (registered as `APP_INITIALIZER`)
- Performs two steps:
  1. **Health check**: `GET /health` — shows `HealthCheckDialogComponent` (non-dismissable) if API is unreachable
  2. **Config load**: `GET /api/config` — populates `ConfigService.config` signal with session settings
- All app initializer logic uses `firstValueFrom()` for proper async/await handling
- Health check dialog provides "Refresh" button only — user must fix connectivity to proceed

### Profile Management
- Any authenticated user can edit their own profile: FirstName, LastName, PhoneNumber
- Profile dialog accessed by clicking username in `app-navigation` component
- Lazy-loaded: `import('...user-profile-dialog.component').then(m => dialog.open(...))`
- Backend endpoint: `PUT /api/profile` using `UpdateProfileRequest`
- Uses `TrimOnBlurDirective` on FirstName/LastName fields

### Directives
- `TrimOnBlurDirective` trims leading/trailing whitespace from text inputs on blur event
- Apply as attribute: `<input trimOnBlur .../>`
- Used on FirstName/LastName fields in register and profile dialogs
- Implementation: `@HostListener('blur')` → `control.setValue(value.trim(), { emitEvent: false })`

### Component structure
Every component has its own folder. All three files are required:

```
{feature}-{component}/
  {feature}-{component}.component.ts    ← templateUrl + styleUrl (no inline)
  {feature}-{component}.component.html
  {feature}-{component}.component.scss
```

**Dialog components** follow the same structure: `{feature}-{name}-dialog/` folder.

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
