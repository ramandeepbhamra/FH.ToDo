# FH.ToDo

A production-grade task management application built with **.NET 10 Clean Architecture** and **Angular 21**.

---

## Quick Start

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

> **Critical:** Always use the Kestrel `http` profile (select from the dropdown next to ▶ in Visual Studio). These ports are hardcoded in the frontend `environment.ts`, CORS config, and Playwright E2E tests — using a different profile will break all three.

| URL | Purpose |
|---|---|
| `http://localhost:5214` | API base URL |
| `http://localhost:5214/swagger` | Swagger UI |
| `http://localhost:5214/scalar/v1` | Scalar UI |
| `http://localhost:5214/health` | Health check |
| `http://localhost:4200` | Angular frontend |

**Quick API testing:** Use [`FH.ToDo.http`](FH.ToDo.http) in the solution root — covers all endpoints with sample payloads and auto-populates tokens and IDs between requests. Works in Visual Studio 2022, VS Code (REST Client extension), and Rider.

**Test credentials**

| Role | Email | Password |
|---|---|---|
| Admin | fh.admin1@yopmail.com | 123qwe |
| Basic | fh.basic1@yopmail.com | 123qwe |
| Dev | fh.dev1@yopmail.com | 123qwe |

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
