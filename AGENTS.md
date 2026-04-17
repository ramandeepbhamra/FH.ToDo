# FH.ToDo — Agent Instructions

This file is the primary instruction set for any AI agent (GitHub Copilot, Claude, Cursor, etc.) working in this repository.
Read this file **first**, before reading any other file or making any change.

---

## Your Role

You are a **senior full-stack engineer** on the FH.ToDo project. Your responsibilities are:

- Write clean, idiomatic code that matches the existing codebase conventions exactly
- Follow Clean Architecture principles on the backend
- Follow Angular v19/v21 signal-based patterns on the frontend
- Keep all README and skill files up to date when conventions change
- Never introduce patterns from older framework versions (Angular ≤16, AutoMapper, constructor DI in Angular)
- Never break the build — verify after every set of changes

---

## Solution Map

```
FH.ToDo/
├── FH.ToDo.Core/            # Domain — entities, interfaces. Zero external dependencies
├── FH.ToDo.Core.Shared/     # Shared enums, constants, helpers
├── FH.ToDo.Core.EF/         # Infrastructure — DbContext, Fluent API configs, migrations
├── FH.ToDo.Services/        # Application — services, Mapperly mappers, DTOs
├── FH.ToDo.Web.Core/        # Web infrastructure — JWT, ApiControllerBase, middleware
├── FH.ToDo.Web.Host/        # Presentation — ASP.NET Core Web API entry point
└── FH.ToDo.Frontend/        # Angular 19 SPA
```

---

## README Files — Read These for Context

| File | Read when |
|---|---|
| `README.md` | Understanding the full solution, stack, setup |
| `FH.ToDo.Core/README.md` | Creating or modifying entities |
| `FH.ToDo.Core.EF/README.md` | Writing Fluent API configurations or migrations |
| `FH.ToDo.Web.Host/README.md` | Working on controllers, auth, JWT |
| `FH.ToDo.Frontend/README.md` | Any Angular work — structure, naming, forms, errors |

---

## Skill Files — Read These Before Writing Code

| Skill file | Read when |
|---|---|
| `.claude/skills/fh-entity-patterns/SKILL.md` | Creating a new entity |
| `.claude/skills/fh-fluent-api-patterns/SKILL.md` | Writing Fluent API configuration |
| `.claude/skills/fh-automapper-patterns/SKILL.md` | Writing a mapper (Mapperly, NOT AutoMapper) |
| `.claude/skills/fh-efcore-migrations/SKILL.md` | Creating or applying migrations |
| `.claude/skills/fh-audit-softdelete-patterns/SKILL.md` | Understanding audit/soft-delete behaviour |

---

## Backend Rules (.NET 10 / C#)

### Entities
- All entities inherit `BaseEntity<Guid>` — never plain `BaseEntity`
- `virtual` on **navigation properties only** — never on scalars (`string`, `bool`, `int`, `DateTime?`, FK `Guid`)
- One type per file — no nested classes, enums, or interfaces in entity files
- Use `[Required]`, `[MaxLength]`, `[EmailAddress]`, `[Phone]` data annotations for validation
- `IsSystemUser` flag on `User` entity — system users cannot have their role changed

### User Management
- `GetUsersInputDto.ExcludeUserId` — filters out the requesting user from user lists
- `UpdateUserAsync` guards against changing `IsSystemUser` roles
- `UpdateProfileAsync` — separate method for users to edit their own FirstName, LastName, PhoneNumber
- Data seeder creates 40 users (10 per role) with `IsSystemUser` set for specific accounts

###
- **Never duplicate** what a data annotation already declares (no `.IsRequired()` or `.HasMaxLength()` if `[Required]`/`[MaxLength]` exists on the entity)
- Fluent API owns: indexes, relationships, `HasDefaultValueSql()`, `HasQueryFilter()`, cascade rules
- Every entity gets a global query filter: `builder.HasQueryFilter(e => !e.IsDeleted)`

### Mapperly
- Package: `Riok.Mapperly` v4.3.1 — **not AutoMapper**
- Class-level: `[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]`
- Per-method: `[MapperIgnoreSource]` for every sensitive field (`IsDeleted`, `DeletedDate`, `DeletedBy`, `CreatedBy`, `ModifiedDate`, `ModifiedBy`)
- `PasswordHash` **must** have explicit `[MapperIgnoreSource]` on every User→DTO method — no exceptions
- Register as singleton: `builder.Services.AddSingleton<UserMapper>()`

### Controllers & Auth
- `[AllowAnonymous]` applied **per method** — never at controller class level when the controller has `[Authorize]` methods
- `Revoke` endpoint requires `[Authorize]` — a valid token must be presented
- JWT: `MapInboundClaims = false` in `AddJwtBearer` options
- `ApiControllerBase` helpers (`BadRequest`, `NotFound`, `Unauthorized`) are **overloads** — no `new` keyword

### Health Checks & Configuration
- Health check endpoint: `app.MapHealthChecks("/health")` with `AddDbContextCheck<ToDoDbContext>("database")`
- Public config endpoint: `GET /api/config` returns `AppConfigResponse` with session settings (`IdleTimeoutMinutes`, `WarningCountdownSeconds`)
- `ConfigController` marked `[AllowAnonymous]` — configuration must be accessible before authentication

### Profile Management
- `ProfileController` allows authenticated users to manage their own profile
- `GET /api/profile` — returns current user's profile
- `PUT /api/profile` — updates FirstName, LastName, PhoneNumber only (uses `CurrentUserId` from `ApiControllerBase`)
- Uses `UpdateProfileDto` (not `UpdateUserDto`) to restrict editable fields

---

## Frontend Rules (Angular 19 / v21)

### Authentication Architecture
- **Dialog-based auth** — no route-based `/auth/login` or `/auth/register` pages
- Use `AuthDialogService.openLogin()` and `AuthDialogService.openRegister()` to show auth modals
- Dashboard route (`/`) is **public** — unauthenticated users see it with login dialog overlay
- Auth dialogs are lazy-loaded via dynamic imports
- Switching between login/register automatically closes the other dialog first

### Component structure (non-negotiable)
- Every component lives in its **own folder** named after the component
- Three files always required: `.component.ts`, `.component.html`, `.component.scss`
- **No inline `template:`** — always `templateUrl`
- **No inline `styles:`** — always `styleUrl`
- `standalone: true` is implicit since v17 — do not declare it
- **Dialog components** follow the same structure: `{feature}-{name}-dialog/` folder

### File naming
```
{feature}-{entity}-{operation}.{type}.ts

Examples:
  todo-task-create-request.model.ts   ← feature=todo, entity=task, operation=create
  auth-login.form.ts                  ← feature=auth, entity=login, type=form
  todo-task.service.ts                ← feature=todo, entity=task
```

### Folder structure per feature
```
features/{feature}/
  {feature}-{component}/       ← one folder per component
  forms/                       ← typed FormGroup<T> interfaces only (no factories)
  models/                      ← one interface per file, API contracts
  services/                    ← HTTP services
  {feature}.routes.ts
```

### Inputs and Outputs (v19+)
```typescript
// ✅ v19+ — required
readonly task = input.required<TodoTask>();

// ✅ v19+ — optional with default
readonly taskLists = input<TodoTaskList[]>([]);

// ✅ v19+ — output
readonly taskUpdated = output<TodoTask>();

// ❌ Old — never use these
@Input({ required: true }) task!: TodoTask;
@Output() taskUpdated = new EventEmitter<TodoTask>();
```

When using `input()`, the value is a signal — always call it with `()`:
- In `.ts`: `this.task().id`, `this.task().title`
- In `.html`: `task().isCompleted`, `task().dueDate`

### Dependency Injection
```typescript
// ✅ v14+ — inject() function
private readonly service = inject(MyService);

// ❌ Old — constructor injection
constructor(private service: MyService) {}
```

### Forms
- `.form.ts` contains **only the typed interface** — no factory, no defaults:
  ```typescript
  export interface AuthLoginForm {
    email: FormControl<string>;
    password: FormControl<string>;
  }
  ```
- `FormGroup<T>` is instantiated in the component with `nonNullable: true` on all controls
- Error access in templates uses **bracket notation** (dot notation rejected by `strictTemplates`):
  ```html
  @if (form.controls.email.errors?.['required'] && form.controls.email.touched) {
  ```

### Template control flow
- Use `@if`, `@for`, `@switch` — **never** `*ngIf`, `*ngFor`, `*ngSwitch`
- `@for` always requires `track`:
  ```html
  @for (item of items(); track item.id) { ... }
  ```

### Two-way binding
```typescript
// ✅ model() for two-way bound inputs
readonly isOpen = model.required<boolean>();
```

### What stays as-is (still correct in v21)
- `implements OnInit` + `ngOnInit()` — correct for initialization logic
- `BehaviorSubject` in `auth.service.ts` — required for concurrent refresh token coordination
- `devtools/` feature — keep as-is, exceptions to all structure rules apply

---

## Session Management & App Initialization

### Idle Timeout Pattern
- Use abstract `IdleService` interface — concrete implementation is `NgIdleService` (wraps `@ng-idle/core`)
- To swap libraries, implement `IdleService` and change `useClass` in `app.config.ts`
- Session timeout is configurable via `appsettings.json` → `Session:IdleTimeoutMinutes` and `Session:WarningCountdownSeconds`
- Idle service started when user authenticates, stopped when user logs out
- `SessionWarningDialogComponent` shows live countdown driven by `onTimeoutWarning` observable

### App Initializer
- `app.initializer.ts` runs **before** Angular bootstrap
- Performs health check: `GET /health` — shows `HealthCheckDialogComponent` (non-dismissable) if API unreachable
- Loads remote config: `GET /api/config` — populates `ConfigService` with session settings
- All app initializer logic uses `firstValueFrom()` for proper async/await handling

### Health Checks
- Backend: `MapHealthChecks("/health")` with `AddDbContextCheck<ToDoDbContext>("database")`
- Frontend: app initializer checks health on startup, displays dialog if API is down
- Dialog provides "Refresh" button only — user must fix connectivity to proceed

### Configuration Service
- `ConfigService` loads session settings from backend via `/api/config`
- Settings stored as signal: `config = signal<AppConfig>(...)`
- Backend `ConfigController` serves `AppConfigResponse` with `IdleTimeoutMinutes` and `WarningCountdownSeconds`

---

## Profile Management

### User Profile
- Any authenticated user can edit their own profile: FirstName, LastName, PhoneNumber
- Profile dialog accessed by clicking username in navigation
- Lazy-loaded: `import('...user-profile-dialog.component').then(m => dialog.open(...))`
- Backend: `PUT /api/profile` endpoint (`ProfileController` + `UpdateProfileDto`)
- Service: `IUserService.UpdateProfileAsync(userId, input)` — updates only profile fields, not email/role/password

---

## Directives

### TrimOnBlurDirective
- Trims leading/trailing whitespace from text inputs on blur event
- Apply as attribute: `<input trimOnBlur .../>`
- Used on FirstName/LastName fields in register and profile dialogs
- Implementation: `@HostListener('blur')` → `control.setValue(value.trim())`

---

## One Type Per File — Both Backend and Frontend

Every interface, class, enum, and DTO must be in its own file.
- C#: use `partial` classes to split nested types
- TypeScript: one `export interface` or `export class` per `.ts` file

---

## Model Naming Conventions

### Backend DTOs
`{Operation}{Entity}Dto` — e.g. `CreateUserDto`, `UpdateTaskDto`, `UserListDto`

### Frontend models
`{feature}-{entity}-{operation}-request.model.ts`
- `todo-task-create-request.model.ts` → `TodoTaskCreateRequest`
- `auth-login-request.model.ts` → `AuthLoginRequest`
- `todo-task-list-update-request.model.ts` → `TodoTaskListUpdateRequest`

### Frontend interfaces
- Entities: `TodoTask`, `TodoTaskList`, `TodoSubTask`
- Auth models: `AuthUser`, `AuthLoginRequest`, `AuthTokenInfo`, `AuthUserInfo`
- Users: `User`, `UserListItem`, `UserCreateRequest`, `UserUpdateRequest`

---

## What Never To Do

| Never | Reason |
|---|---|
| `standalone: true` on components | Implicit since Angular v17 |
| `@Input()` / `@Output()` / `EventEmitter` | Use `input()` / `output()` |
| Constructor injection in Angular | Use `inject()` |
| AutoMapper `CreateMap<>()` | Project uses Mapperly |
| `.IsRequired()` in Fluent API when `[Required]` exists | Duplication |
| `virtual` on scalar entity properties | Navigation properties only |
| `new` keyword on `ApiControllerBase` helpers | They are overloads |
| `[AllowAnonymous]` on controller class | Per-method only |
| `MapInboundClaims` left at default | Must be `false` |
| Inline templates or styles | Always separate `.html`/`.scss` files |
| Multiple types in one file | One type per file |
| `errors?.required` dot notation in templates | Use `errors?.['required']` |
| `hasError('required')` | Use `errors?.['required']` |
| Route-based `/auth/login` or `/auth/register` | Use dialog-based auth |
| Implement `IdleService` directly | Use abstract class, bind concrete impl |
| Hard-code session timeout values | Load from `ConfigService` |

---

## When Making Changes

1. **Read** the relevant README and skill file first
2. **Check** existing files in the same feature for conventions
3. **Build** after every set of changes: the build must succeed before moving on
4. **Update** the relevant README and skill file if a new convention is introduced
5. **Clean up** empty folders after moving or deleting files
6. **One type per file** — always verify before creating

---

## Copilot Instructions

The `.github/copilot-instructions.md` file contains the authoritative Angular conventions for GitHub Copilot.
Keep it in sync whenever Angular conventions change.
