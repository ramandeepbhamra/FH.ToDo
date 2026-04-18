# Project Overview — FH.ToDo

## What Is This?

FH.ToDo is a full-stack task management application built by FunctionHealth. It is a production-quality reference implementation combining a .NET 10 Clean Architecture API with an Angular 21 signal-based SPA.

---

## Purpose

- Primary use case: Users create and manage task lists and to-do items, including subtasks, due dates, and completion tracking.
- Secondary use case: Administrators manage users and view API activity logs.
- Developer use case: Dev-role users access DevTools for component inspection and API log analysis.

---

## Users and Roles

| Role | Capabilities |
|---|---|
| Basic | Create task lists (up to 10), tasks per list (up to 10), subtasks, due dates, favourites |
| Admin | All of Basic + user management (view, create, edit, delete, role change) + API logs |
| Dev | All of Basic + DevTools UI component browser + API logs |

Limits (`BasicUserTaskLimit`, `BasicUserTaskListLimit`) are configured in `appsettings.json` and enforced server-side. Exceeding a limit shows an upgrade prompt dialog (not a route change).

---

## Feature Areas

### Todos (authenticated, all roles)
- Task lists in a sidenav — create/rename via modal, delete with confirm dialog
- Tasks with title, due date, completion toggle, favourite toggle, subtasks
- Inline edit on double-click (desktop) or tap (mobile)
- Mobile: overlay sidenav via hamburger, bottom navigation bar

### Auth (public)
- Dialog-based login and registration — no route `/auth/login` exists
- JWT access token (60 min) + rotating refresh token (7 days)
- Idle session detection with countdown warning dialog

### Users (Admin only)
- List all users with pagination and sort
- Create, edit, deactivate users
- Change role (cannot change system user role)

### API Logs (Admin + Dev)
- View all logged API requests/responses
- Filter, sort, paginate

### DevTools (Dev only)
- Browser for UI components with live props
- Sidenav layout matching Todos layout

### Dashboard (public)
- Landing page — visible to unauthenticated users
- Shows login overlay CTA

---

## Tech Stack Summary

| Layer | Technology |
|---|---|
| API | .NET 10, ASP.NET Core, EF Core 10, SQLite |
| ORM mapping | Mapperly 4.3.1 (source-generated) |
| Auth | BCrypt, JWT, refresh token rotation |
| Logging | Serilog (console + rolling file + DB table) |
| Frontend | Angular 21 (standalone, signals) |
| UI library | Angular Material 21 |
| Styling | SCSS + Tailwind CSS (layout/spacing only) |
| State | Angular signals — no NgRx, no BehaviorSubject |
| Testing (BE) | xUnit, Moq, FluentAssertions, MockQueryable |
| Testing (BDD) | Reqnroll, WebApplicationFactory |
| Testing (E2E) | Playwright (TypeScript, Chromium) |
| Testing (FE) | Vitest, @vitest/coverage-v8 |

---

## Repository Layout

```
/
├── FH.ToDo.Core/
├── FH.ToDo.Core.Shared/
├── FH.ToDo.Core.EF/
├── FH.ToDo.Services.Core/
├── FH.ToDo.Services/
├── FH.ToDo.Web.Core/
├── FH.ToDo.Web.Host/
├── FH.ToDo.Tests/
├── FH.ToDo.Tests.Api.BDD/
├── FH.ToDo.Tests.Playwright/
├── FH.ToDo.Frontend/
├── .ai/                  ← AI agent definitions and project context
│   ├── agents/
│   └── context/
└── .github/
    └── copilot-instructions.md
```

---

## Key Constraints

- No route-based auth — login and register are always dialogs
- No CSS `@media` queries — always `ResponsiveService` (CDK BreakpointObserver)
- No hardcoded colours — always CSS custom properties from `ThemingService`
- No AutoMapper — Mapperly only
- No NgModules — fully standalone Angular
- Soft delete only — no hard deletes on any entity
- Limits enforced on server — never trust client-side count checks
