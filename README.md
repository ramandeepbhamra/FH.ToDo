# FH.ToDo

A production-grade, fully responsive task management application built with **.NET 10 Clean Architecture** and **Angular 21**.

Designed for four roles — **Basic**, **Premium**, **Admin**, and **Dev** — each with distinct access and capabilities:

- **Tasks & Lists** — create task lists, add tasks with due dates, subtasks, completion tracking, and favourites; drag-and-drop reordering
- **Dashboard** — public landing page accessible to all visitors with role-aware CTAs
- **User Management** — Admin-only user administration: create, edit, assign roles, deactivate accounts
- **API Logs** — Admin and Dev users can browse, filter, and paginate all logged API activity
- **DevTools** — Dev-only live component browser with full theming support

Responsive across all screen sizes — desktop, tablet, and mobile — without a single CSS `@media` query. All layout breakpoints are managed in TypeScript via Angular CDK's `BreakpointObserver`, surfaced as signals through `ResponsiveService`. This keeps responsive behaviour testable, consistent, and completely decoupled from stylesheets.

> For a full breakdown of every feature, role permissions, and business rules see [Features](docs/features.md).

---

## Quick Start

> [!WARNING]
> **Always run the backend using the Kestrel `http` launch profile — not IIS Express.**
> The API is configured to serve on port `5214`. This is the expected default across the Angular `environment.ts`, CORS policy, and Playwright E2E tests. Selecting IIS Express or any other launch profile will break all three.

> [!NOTE]
> **Test accounts** are seeded automatically on first run by `DataSeeder`. Accounts exist for all four roles — Basic, Premium, Admin, and Dev. Alternatively, register a new Basic account directly via the app.

### Prerequisites

| Tool | Version |
|---|---|
| .NET SDK | 10.x |
| Node.js | 20.x LTS |
| Angular CLI | 21.x (`npm install -g @angular/cli`) |

### Backend

```bash
dotnet run --project FH.ToDo.Web.Host
```

Database is created and seeded automatically on first run. No SQL Server required — SQLite file-based.

| URL | Purpose |
|---|---|
| `http://localhost:5214` | API base URL |
| `http://localhost:5214/swagger` | Swagger UI |
| `http://localhost:5214/scalar/v1` | Scalar UI |
| `http://localhost:5214/health` | Health check |
| `http://localhost:4200` | Angular frontend |

**Quick API testing:** Use [`FH.ToDo.http`](FH.ToDo.http) in the solution root — covers all endpoints with sample payloads and auto-populates tokens and IDs between requests. Works in Visual Studio 2022, VS Code (REST Client extension), and Rider.

### Frontend

```bash
cd FH.ToDo.Frontend
npm install
ng serve
# App → http://localhost:4200
```

### Run All Tests

```bash
dotnet test FH.ToDo.Tests                  # Unit tests
dotnet test FH.ToDo.Tests.Api.BDD          # BDD integration tests
cd FH.ToDo.Tests.Playwright && npm test    # E2E tests (requires FE + BE running)
cd FH.ToDo.Frontend && npm test            # Frontend unit tests
```

---

## Project Structure

```
FH.ToDo/
├── FH.ToDo.Core/              Domain entities, IRepository<T,K>
├── FH.ToDo.Core.Shared/       Enums, constants
├── FH.ToDo.Core.EF/           DbContext, Fluent API, migrations
├── FH.ToDo.Services.Core/     Service interfaces, DTOs
├── FH.ToDo.Services/          Business logic, Mapperly mappers
├── FH.ToDo.Web.Core/          ApiControllerBase, JWT, middleware
├── FH.ToDo.Web.Host/          Controllers, Program.cs
├── FH.ToDo.Tests/             xUnit unit tests
├── FH.ToDo.Tests.Api.BDD/     Reqnroll BDD integration tests
├── FH.ToDo.Tests.Playwright/  Playwright E2E tests
└── FH.ToDo.Frontend/          Angular 21 SPA
```

---

## Documentation

| Document | Description |
|---|---|
| [Features](docs/features.md) | Roles, permissions, and detailed behaviour for every feature |
| [Architecture Overview](docs/architecture/overview.md) | Layer diagram, domain model, key design decisions |
| [Scalability](docs/architecture/scalability.md) | Architectural, testing, and feature scaling roadmap |
| [Getting Started](docs/development/getting-started.md) | Full local setup and CORS configuration |
| [Adding Features](docs/development/adding-features.md) | Step-by-step checklist for adding new features |

### Project READMEs

| Project | README |
|---|---|
| FH.ToDo.Core | [Domain layer](FH.ToDo.Core/README.md) |
| FH.ToDo.Core.EF | [Infrastructure / migrations](FH.ToDo.Core.EF/README.md) |
| FH.ToDo.Core.Shared | [Shared enums and constants](FH.ToDo.Core.Shared/README.md) |
| FH.ToDo.Web.Host | [API controllers and config](FH.ToDo.Web.Host/README.md) |
| FH.ToDo.Frontend | [Angular SPA](FH.ToDo.Frontend/README.md) |
| FH.ToDo.Tests | [Unit tests](FH.ToDo.Tests/README.md) |
| FH.ToDo.Tests.Api.BDD | [BDD integration tests](FH.ToDo.Tests.Api.BDD/README.md) |
| FH.ToDo.Tests.Playwright | [E2E tests](FH.ToDo.Tests.Playwright/README.md) |

---

## Design Decisions & Trade-offs

### Architecture

**Mapperly over AutoMapper**
Mapperly is a compile-time source generator — zero runtime reflection, no registration overhead, and mapping errors caught at build time. AutoMapper resolves mappings at runtime, which can hide mismatches until production. Trade-off: less dynamic flexibility, but faster, safer, and more maintainable.

**Generic `IRepository<T,K>` over per-entity repositories**
One generic interface and one implementation cover every entity in the system. Services compose queries via private `BuildQuery()` methods, keeping business logic in the service layer. Trade-off: complex queries stay in services rather than specialised repositories, but eliminates significant boilerplate and keeps the pattern consistent.

**SQLite for development, designed to migrate to MSSQL/PostgreSQL**
SQLite requires zero infrastructure — the database file is auto-created on first run via `MigrateAsync()`. The entire data layer (EF Core, Fluent API, generic repository) is database-agnostic. Switching to MSSQL or PostgreSQL is a connection string and NuGet package change with no service or controller code touched. Trade-off: SQLite is single-writer and not suitable for concurrent production load, but removes all setup friction for local development and assessment review.

> **Note on SQLite files:** `*.db`, `*.db-shm`, and `*.db-wal` are intentionally gitignored. The database is always auto-created and seeded on first run — committing the file would cause stale seed data conflicts across environments.

**Soft delete on all entities**
No entity is ever hard-deleted. `IsDeleted` is filtered globally via EF Core query filters, so all queries are automatically scoped without manual `Where(!e.IsDeleted)` calls. Trade-off: the database accumulates historical data, but gains a full audit trail, data recovery capability, and compliance-readiness.

**Fluent API only for EF configuration — no data annotations for schema**
All database schema decisions (indexes, constraints, relationships, query filters) live in `IEntityTypeConfiguration<T>` classes. Data annotations on entities are not duplicated in Fluent API. Trade-off: slightly more files, but a single source of truth that prevents annotation/Fluent API conflicts as the schema evolves.

---

### Frontend

**Dialog-based authentication over route-based**
Login and registration are Angular Material dialogs lazy-loaded via dynamic `import()`. The dashboard is always publicly accessible — authentication never interrupts navigation context or breaks the browser back button. Trade-off: slightly less browser-history-friendly, but a significantly better UX for a SPA where the shell is always present.

**Angular signals over NgRx**
Signals are Angular's built-in reactive primitive — no boilerplate, no actions, no reducers, no selectors. For an application at this scale, signals with service-level state are sufficient and far less ceremonious. Trade-off: no Redux DevTools or time-travel debugging, but the codebase is dramatically simpler and easier to onboard.

**`ResponsiveService` over CSS `@media` queries**
All responsive behaviour is driven by CDK `BreakpointObserver` signals in `ResponsiveService`. Layout decisions are made in TypeScript and reflected in templates via `@if` and `computed()` — never in SCSS. Trade-off: slightly more code than media queries, but eliminates CSS/TypeScript state drift and makes responsive behaviour testable.

**Lazy-loaded dialogs via dynamic `import()`**
Auth, profile, task list, and confirm dialogs are not bundled in the main chunk. Each is loaded on first open. Trade-off: small async delay on first dialog open, but the initial bundle is significantly smaller and time-to-interactive is faster.

---

### Testing

**Three-layer test strategy**
- **Unit tests** (xUnit + Moq + FluentAssertions) — service logic in isolation, fast feedback
- **BDD integration tests** (Reqnroll + WebApplicationFactory) — full HTTP request/response cycle against a real in-memory SQLite database, human-readable Gherkin scenarios
- **E2E tests** (Playwright, Chromium) — critical user journeys against the running app
- **Frontend unit tests** (Vitest) — service and component logic in isolation

Each layer catches a different class of bug. Trade-off: more setup investment, but confidence at every level of the stack.

---

### What We Would Do Next

- **Migrate to MSSQL or PostgreSQL** for production — the data layer is already database-agnostic
- **Add CQRS via MediatR** — the service layer is already structured with clear read/write separation
- **Output caching** on read-heavy endpoints (`/api/config`, task lists) via ASP.NET Core's built-in `AddOutputCache()`
- **Multi-device refresh token support** — add `DeviceId` to `RefreshToken` to allow one token per device rather than one per user
- **Multilingual support (i18n)** — the theme-aware, signal-driven frontend is well-positioned for runtime locale switching
- **Two-factor authentication** — TOTP-based 2FA for Admin and Dev roles

---

## Tech Stack

| Layer | Technology |
|---|---|
| API | .NET 10, ASP.NET Core, EF Core 10, SQLite |
| Mapping | Mapperly 4.3.1 (source-generated) |
| Auth | BCrypt, JWT (60 min) + refresh token rotation |
| Logging | Serilog — console + rolling file + DB table |
| Frontend | Angular 21, standalone components, signals |
| UI | Angular Material 21 + Tailwind CSS |
| BE Tests | xUnit + Moq + FluentAssertions + MockQueryable |
| BDD Tests | Reqnroll + WebApplicationFactory |
| E2E Tests | Playwright (TypeScript, Chromium) |
| FE Tests | Vitest + @vitest/coverage-v8 |
