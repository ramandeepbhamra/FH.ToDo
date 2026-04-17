# Copilot Instructions

## General Guidelines
- Confirm all changes with the user before applying them.
- Do not create new markdown files — **exception: `README.md` at the repo root is permitted and must be kept up to date**.

## Project Guidelines

### Authentication Architecture
- **Dialog-based authentication** — no route-based `/auth/login` or `/auth/register` pages.
- Use `AuthDialogService.openLogin()` and `AuthDialogService.openRegister()` to show auth modals.
- Dashboard route (`/`) is **public** — unauthenticated users can view it; login dialog shown when needed.
- Auth dialogs are lazy-loaded via dynamic imports.

### Session Management
- Session idle timeout implemented using `@ng-idle/core` wrapped by abstract `IdleService`.
- Configuration loaded from backend via `GET /api/config` during app initialization.
- `SessionWarningDialogComponent` displays live countdown before logout.
- Health check runs on app startup; `HealthCheckDialogComponent` shown if API unreachable.

### Profile Management
- Authenticated users can edit their own profile (FirstName, LastName, PhoneNumber) via profile dialog.
- Profile dialog accessed by clicking username in navigation, lazy-loaded on demand.
- Backend endpoint: `PUT /api/profile` using `UpdateProfileDto`.

### Directives
- `TrimOnBlurDirective` trims whitespace from text inputs on blur event.
- Applied to FirstName/LastName fields: `<input trimOnBlur .../>`

### Types
- All types (interfaces, classes, enums, DTOs) must be defined in separate files — one type per file — on both backend and frontend. This rule applies to ALL type declarations, including nested static classes, nested enums, and nested interfaces. Use C# partial classes to split nested types across files while preserving the outer class name.

### Angular Components
- Every component lives in its own folder named after the component: `auth-login-dialog/`.
- All files inside that folder are prefixed with the full component name: `auth-login-dialog.component.ts`, `auth-login-dialog.component.html`, `auth-login-dialog.component.scss`.
- **Dialog components** follow same structure: `{feature}-{name}-dialog/` folder.
- No inline `template:` or `styles:` — always separate `.html` and `.scss` files via `templateUrl` and `styleUrl`.
- Existing components with inline templates are migrated in a dedicated refactor pass — do not change them as part of feature work.

### Angular File Naming
- Convention: `{feature}-{component}.{type}.ts` — e.g. `auth-login.component.ts`, `todo-task.model.ts`, `auth-login.form.ts`.
- Model naming for request/response DTOs: `{feature}-{entity}-{operation}-request.model.ts` — e.g. `todo-task-create-request.model.ts`.

### Angular Folder Structure (per feature)features/{feature}/
  {feature}-{component}/          ← one folder per component
    {feature}-{component}.component.ts
    {feature}-{component}.component.html
    {feature}-{component}.component.scss
  forms/                          ← typed FormGroup schemas + factories
    {feature}-{entity}.form.ts
  models/                         ← API contracts, entity interfaces
    {feature}-{entity}.model.ts
    {feature}-{entity}-{operation}-request.model.ts
  services/
    {feature}-{entity}.service.ts
  {feature}.routes.ts
### Angular Forms
- Use Angular reactive forms only (`FormGroup`, `FormControl`).
- Each `.form.ts` file exports a single typed interface — the form schema — named with a `Form` suffix: e.g. `AuthLoginForm`.
- The `.form.ts` file contains **only the interface** — no factory function, no default values.
- The `FormGroup` is instantiated in the component with validators and defaults: `readonly form = new FormGroup<AuthLoginForm>({...})`.
- Use `nonNullable: true` on all `FormControl` instances for better type inference.
- Error access in templates uses **bracket notation**: `form.controls.email.errors?.['required']`, `form.errors?.['passwordMismatch']`.

### Angular Models
- Model files contain the interface only — no initial data, no factory, no schema.
- API request/response types go in `models/` — no `Form` suffix.
- Entity types (e.g. `TodoTask`) go in `models/` with no operation suffix.

## AI Agent Guidelines
- Define the AI agent's role clearly, ensuring it understands its purpose within the codebase.
- Follow conventions for naming and structuring code to maintain consistency.
- Reference the `README.md` for project-specific information and guidelines.
- Ensure that all interactions with the codebase are aligned with the established project rules and conventions.

