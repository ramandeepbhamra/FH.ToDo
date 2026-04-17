# FH.ToDo - Task Management Application

## 📋 Overview
A production-grade ToDo/Task Management application built with **ASP.NET Core 10**, **Entity Framework Core**, and **Clean Architecture** principles using **Generic Repository Pattern** with **Query Builder Services**. This solution demonstrates professional software development practices including domain-driven design, separation of concerns, modern .NET 10 patterns, and **dialog-based authentication** with **session idle timeout management**.

### Key Features
- ✅ **Zero-setup database** — SQLite auto-created on first run (no SQL Server needed)
- ✅ **Dialog-based authentication** — no route-based auth pages
- ✅ **Session idle timeout** with countdown warning dialog
- ✅ **Health check** on app startup with API reachability verification
- ✅ **Profile management** — users can edit their own FirstName, LastName, PhoneNumber
- ✅ **User management** with system user protection and exclusion filters
- ✅ **Data seeding** — 40 users (10 per role) auto-seeded on startup
- ✅ **Public dashboard** — unauthenticated users can view dashboard, login when needed
- ✅ **Swagger UI with token injection** — One-click "Open Swagger" button (dev only)

---

## 🏗️ Architecture

### Clean Architecture with Generic Repositories

```
┌──────────────────────────────────────────────┐
│  FH.ToDo.Web.Host (Presentation Layer)       │
│         ASP.NET Core 10 Web API              │
│  - Controllers (DTOs in/out)                 │
│  - DI Configuration                          │
└────────────┬─────────────────────────────────┘
             │ depends on ↓
┌────────────┴─────────────────────────────────┐
│  FH.ToDo.Services (Application Layer)        │
│  - Business Logic                            │
│  - Private Query Builders                    │
│  - DTO Mapping (Mapperly)                    │
└────────────┬─────────────────────────────────┘
             │ depends on ↓
┌────────────┴─────────────────────────────────┐
│  FH.ToDo.Services.Core (Contracts)           │
│  - Service Interfaces (IUserService)         │
│  - DTOs (Request/Response)                   │
└────────────┬─────────────────────────────────┘
             │ depends on ↓
┌────────────┴─────────────────────────────────┐
│  FH.ToDo.Core (Domain Layer) ⭐ CORE         │
│  - Entities (User, etc.)                     │
│  - IRepository<TEntity, TKey> (Generic)      │
│  - Extensions (QueryableExtensions)          │
│  - NO infrastructure dependencies            │
└────────────┬─────────────────────────────────┘
             ↑ implements │
┌────────────┴─────────────────────────────────┐
│  FH.ToDo.Core.EF (Infrastructure Layer)      │
│  - Repository<TEntity, TKey> Implementation  │
│  - DbContext + Migrations                    │
│  - EF Core Configurations                    │
└──────────────────────────────────────────────┘

              Shared Utilities ↓
┌──────────────────────────────────────────────┐
│  FH.ToDo.Core.Shared (Shared Library)        │
│  - Constants, Enums, Helpers                 │
└──────────────────────────────────────────────┘
```

---

## 🎯 Key Design Decisions

### ✅ Generic Repository Pattern
- **No custom repositories** (IUserRepository ❌) unless raw SQL is needed
- Single `IRepository<TEntity, TKey>` for all entities
- Services inject `IRepository<User, Guid>` directly
- **Why?** Simpler, less boilerplate, more maintainable

### ✅ Query Builder Pattern in Services
- Private `GetXxxFilteredQuery()` methods in services
- Business logic stays in service layer
- Reusable, composable query builders
- **Why?** Clean separation, testable, scalable

### ✅ Mapperly for DTO Mapping
- **Source generator** (compile-time, zero runtime overhead)
- Replaces AutoMapper — no runtime reflection, no security concerns
- `RequiredMappingStrategy = RequiredMappingStrategy.Target` — source extras silently skipped
- Sensitive fields (`IsDeleted`, `DeletedDate`, `DeletedBy`, `PasswordHash`) explicitly guarded with `[MapperIgnoreSource]`
- **Why?** Fastest, safest, most modern approach

### ✅ Extension Methods
- `WhereIf`, `PageBy`, `OrderByIf` for cleaner queries
- String helpers (`HasValue()`, `IsNullOrWhiteSpace()`)
- **Why?** Fluent, chainable, readable code

### ✅ Explicit Generic Key Types
- `BaseEntity<TKey>` instead of hardcoded Guid
- `IRepository<TEntity, TKey>` supports int, long, Guid, string
- **Why?** Flexibility for future entities with different key types

---

## 📦 Projects

### FH.ToDo.Core (Domain Layer)
**Pure domain model with generic repository interfaces**

**Contents:**
- ✅ `Entities/` - Domain entities (User, etc.)
  - `BaseEntity<TKey>` - Generic base with audit fields
  - Soft-delete support (`IsDeleted`)
- ✅ `Repositories/` - Repository interfaces
  - `IRepository<TEntity, TKey>` - Generic CRUD interface
  - Returns `IQueryable` for flexible composition
- ✅ `Extensions/` - Query helpers
  - `QueryableExtensions` - WhereIf, PageBy, etc.

**Key Features:**
- No infrastructure dependencies
- Generic key types (int, long, Guid, string)
- Explicit key type declarations required

📖 [View FH.ToDo.Core README](FH.ToDo.Core/README.md)

---

### FH.ToDo.Core.EF (Infrastructure Layer)
**EF Core implementation of generic repositories**

**Contents:**
- ✅ `Repositories/Repository.cs` - Generic implementation
  - Implements `IRepository<TEntity, TKey>`
  - Returns `IQueryable` (not executed)
  - Supports eager loading with `GetAllIncluding()`
- ✅ `Context/ToDoDbContext` - EF Core DbContext
  - Automatic audit field population
  - Soft-delete query filters
- ✅ `Configurations/` - Fluent API configurations
- ✅ `Migrations/` - Database migrations

**Key Features:**
- Generic repository works for all entities
- No custom repository classes needed
- Full EF Core power available

📖 [View FH.ToDo.Core.EF README](FH.ToDo.Core.EF/README.md)

---

### FH.ToDo.Services (Application Layer)
**Business logic with query builders**

**Contents:**
- ✅ `Users/UserServices` - User business logic
  - Public API: `GetPeople(input)`
  - Private query builder: `GetUsersFilteredQuery()`
  - Injects `IRepository<User, Guid>` directly
- ✅ `Mapping/UserMapper` - Mapperly source generator
  - Compile-time DTO mapping
  - Zero runtime overhead

**Pattern:**
```csharp
public class UserServices : IUserService
{
    private readonly IRepository<User, Guid> _userRepository;

    public async Task<List<UserListDto>> GetPeople(input)
    {
        var query = GetUsersFilteredQuery(input);
        query = query.OrderBy(...);
        var users = await query.ToListAsync();
        return _mapper.Map(users);
    }

    private IQueryable<User> GetUsersFilteredQuery(input)
    {
        return _userRepository.GetAll()
            .Where(u => !u.IsDeleted)
            .WhereIf(input.Filter.HasValue(), ...);
    }
}
```

---

### FH.ToDo.Services.Core (Application Contracts)
**Service interfaces and DTOs**

**Contents:**
- ✅ `Users/IUserService` - Service contracts
- ✅ `Users/Dto/` - Request/Response DTOs
  - `GetUserInput` - Request DTO
  - `UserListDto` - Response DTO
- ✅ `Base/IApplicationService` - Marker interface

**Key Rules:**
- DTOs never expose entities
- All properties properly nullable
- Used by both services and controllers

---

### FH.ToDo.Web.Host (Presentation Layer)
**ASP.NET Core 10 Web API**

**Contents:**
- ✅ `AuthController` — login + self-registration (JWT)
- ✅ `ConfigController` — public config endpoint (`GET /api/config`) for session settings
- ✅ `ProfileController` — authenticated user profile management (`GET/PUT /api/profile`)
- ✅ `UsersController` — full CRUD
- ✅ Health check endpoint: `GET /health` (database connectivity check)
- ✅ DI registration in Program.cs
- ✅ OpenAPI/Swagger + Scalar configuration
- ✅ Session configuration: `Session:IdleTimeoutMinutes`, `Session:WarningCountdownSeconds`

**DI Registration Pattern:**
```csharp
// Generic repository
builder.Services.AddScoped(typeof(IRepository<,>), typeof(Repository<,>));

// Mapperly mapper (singleton - stateless)
builder.Services.AddSingleton<UserMapper>();

// Application services
builder.Services.AddScoped<IUserService, UserServices>();

// Health checks
builder.Services.AddHealthChecks()
    .AddDbContextCheck<ToDoDbContext>("database");
```

📖 [View FH.ToDo.Web.Host README](FH.ToDo.Web.Host/README.md)

---

### FH.ToDo.Frontend (Angular SPA)
**Angular 19 single-page application with dialog-based authentication and session management**

**Stack:** Angular 19, Angular Material, TypeScript (strict), SCSS, @ng-idle/core

**Structure:**
```
src/app/
├── core/
│   ├── guards/          # auth.guard.ts
│   ├── interceptors/    # auth.interceptor.ts (JWT attachment + 401 handling)
│   ├── services/        # auth.service.ts, auth-dialog.service.ts, idle.service.ts, config.service.ts
│   ├── directives/      # trim-on-blur.directive.ts
│   ├── initializers/    # app.initializer.ts (health check + config load)
│   ├── validators/      # password-match.validator.ts, no-whitespace.validator.ts
│   └── models/          # app-config.model.ts
├── features/
│   ├── auth/
│   │   ├── auth-login-dialog/        # Login dialog (lazy-loaded)
│   │   ├── auth-register-dialog/     # Register dialog (lazy-loaded)
│   │   ├── forms/                    # AuthLoginForm, AuthRegisterForm interfaces
│   │   └── models/                   # AuthLoginRequest, AuthRegisterRequest, AuthUser
│   ├── profile/
│   │   ├── user-profile-dialog/      # Edit own profile (lazy-loaded)
│   │   ├── forms/                    # UserProfileForm
│   │   └── models/                   # UpdateProfileRequest
│   ├── todos/            # Task management feature
│   ├── users/            # User management feature
│   ├── dashboard/        # Public landing page (hero, features, pricing)
│   └── devtools/         # Material component showcase
├── layout/               # App shell (navigation + theme sidenav)
└── shared/
    ├── components/
    │   ├── app-navigation/           # Top nav (Sign in/Register when unauthenticated)
    │   ├── session-warning-dialog/   # Idle timeout warning with countdown
    │   └── health-check-dialog/      # Non-dismissable dialog when API unreachable
    ├── directives/
    └── models/
```

**Conventions:**
- **Dialog-based auth:** No `/auth/login` or `/auth/register` routes — use `AuthDialogService.openLogin()`
- **Session management:** Idle timeout via abstract `IdleService` (concrete: `NgIdleService`)
- **App initialization:** Health check + config load before Angular bootstrap
- **Profile management:** Edit own FirstName, LastName, PhoneNumber via lazy-loaded dialog
- **TrimOnBlurDirective:** Auto-trim whitespace on FirstName/LastName fields
- File naming: `{feature}-{entity}-{operation}` — e.g. `todo-task-create-request.model.ts`
- Form files: Interface only (no factories) — `FormGroup<T>` instantiated in component
- Error access: `form.controls.x.errors?.['required']` — bracket notation required

📖 [View FH.ToDo.Frontend README](FH.ToDo.Frontend/README.md)

---

### FH.ToDo.Tests (Unit Tests)
**xUnit test project for unit testing services and business logic**

**Contents:**
- ✅ `Services/` - Service layer tests
  - `AuthenticationServiceSimpleTests` - Password hashing/verification (3 tests)
- ✅ **Technology Stack:**
  - xUnit 2.9.3
  - Moq 4.20.72 (mocking)
  - FluentAssertions 7.0.0 (assertions)
  - MockQueryable.Moq 8.0.0 (async EF mocking)
  - EF Core InMemory 10.0.5

**Current Coverage:** 3 tests passing (authentication service)

📖 [View FH.ToDo.Tests README](FH.ToDo.Tests/README.md)

---

### FH.ToDo.Tests.Api.BDD (API Integration Tests)
**Reqnroll BDD test project for end-to-end API testing**

**Contents:**
- ✅ `Features/` - Gherkin feature files
  - `Authentication.Login.feature` - 6 login scenarios
- ✅ `StepDefinitions/` - Step implementations
  - `AuthenticationLoginSteps` - Given/When/Then steps
- ✅ `Infrastructure/` - Test infrastructure
  - `CustomWebApplicationFactory` - In-memory API host + DB seeding
  - `ScenarioContextHelper` - Shared state between steps
  - `Hooks` - Test lifecycle management

**Technology Stack:**
- Reqnroll 2.4.0 (BDD framework)
- WebApplicationFactory (real HTTP server)
- SQLite In-Memory (isolated test database)
- FluentAssertions (readable assertions)

**Current Coverage:** 6 scenarios passing (~10s execution)
- ✅ Successful login with valid credentials
- ✅ Failed login (invalid password, non-existent user)
- ✅ Input validation (empty email/password)
- ✅ Admin user authentication
- ✅ JWT token structure validation

📖 [View FH.ToDo.Tests.Api.BDD README](FH.ToDo.Tests.Api.BDD/README.md)

---

### FH.ToDo.Core.Shared (Shared Library)
**Common utilities**

**Contents:**
- ✅ Enums, Constants, Helpers
- ✅ Shared across all layers

📖 [View FH.ToDo.Core.Shared README](FH.ToDo.Core.Shared/README.md)

---

## 🚀 Getting Started

### Prerequisites

| Tool | Minimum Version | Notes |
|---|---|---|
| .NET SDK | 10.x | [dotnet.microsoft.com](https://dotnet.microsoft.com/download/dotnet/10.0) |
| Node.js | 20.x LTS | [nodejs.org](https://nodejs.org/) |
| Angular CLI | 21.x | `npm install -g @angular/cli` |
| Visual Studio | 2022 17.x+ | Community edition is supported |
| **Database** | **None required!** | SQLite (file-based) - **zero setup** ✅ |

> **💡 No SQL Server installation needed!** The app uses SQLite and auto-creates the database on first run.

### Backend Setup

**1 — Run the app (database auto-created)**

```powershell
dotnet run --project FH.ToDo.Web.Host
```

**That's it!** ✅ The app will automatically:
- **Create the SQLite database file** (if it doesn't exist)
- **Apply all EF Core migrations** via `context.Database.MigrateAsync()`
- **Seed 40 test users** (10 per role: Basic, Premium, Admin, Dev)
- **Start listening** on `http://localhost:5214`

> **💡 How it works:** `Program.cs` includes startup code that runs `MigrateAsync()` before the app starts. No manual migration commands needed!

**Database Location:**
- **dotnet run from solution root**: `FH.ToDo/FHToDo.db`
- **Visual Studio F5**: `FH.ToDo.Web.Host/FHToDo.db`

Both locations work perfectly - the database is auto-created wherever the relative path `Data Source=../FHToDo.db` resolves.

**Test Credentials:**
```
Email: fh.admin1@yopmail.com
Password: 123qwe
Role: Admin

Other test users: fh.basic1@yopmail.com, fh.premium1@yopmail.com, fh.dev1@yopmail.com
All passwords: 123qwe
```

---

**🔧 Manual Migration (Fallback Only):**

If auto-migration fails for any reason, you can apply migrations manually:

```powershell
dotnet ef database update --project FH.ToDo.Core.EF --startup-project FH.ToDo.Web.Host
```

Then run the app normally. See [Troubleshooting](#-troubleshooting) for more details.

---

**2 — Choose a launch profile (Optional)**

| Profile | HTTP URL | HTTPS URL | Recommendation |
|---|---|---|---|
| `http` (Kestrel) | `http://localhost:5214` | — | ✅ Use this |
| `https` (Kestrel) | `http://localhost:5214` | `https://localhost:7182` | — |
| IIS Express | `http://localhost:52333` | `https://localhost:44387` | VS default |

> **Recommendation:** Use the Kestrel `http` profile. In Visual Studio, select it from the run profile dropdown next to the ▶ button.

To trust the dev certificate (HTTPS profiles only):
```powershell
dotnet dev-certs https --trust
```

**3 — Verify the backend is healthy**

Press `F5`. Navigate to:
- Scalar UI: `http://localhost:5214/scalar/v1`
- Swagger UI: `http://localhost:5214/swagger`

**4 — Test the API quickly**

**Option A: Use the .http file** (Recommended for Visual Studio):
- Open `FH.ToDo.http` in the solution root
- Click "Send Request" above any endpoint
- Variables auto-populate between requests (login token, created IDs, etc.)

**Option B: Use Swagger UI**:
- Navigate to `http://localhost:5214/swagger`
- Authenticate using "Authorize" button with JWT token

> **💡 Tip:** The `.http` file includes all endpoints with sample data and is the fastest way to test the API!

---

### Frontend Setup

**1 — Install dependencies**

```powershell
cd FH.ToDo.Frontend
npm install
```

**2 — Set the backend URL**

Open `src/environments/environment.ts` and set `apiBaseUrl` to match the active backend profile:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5214',  // match your active launch profile
};
```

| Active profile | `apiBaseUrl` value |
|---|---|
| Kestrel `http` | `http://localhost:5214` |
| Kestrel `https` | `https://localhost:7182` |
| IIS Express HTTP | `http://localhost:52333` |
| IIS Express HTTPS | `https://localhost:44387` |

**3 — Start the frontend**

```powershell
ng serve
```

Angular dev server runs at `http://localhost:4200`.

---

### CORS

The backend allows requests from these origins (configured in `appsettings.json`):

```
http://localhost:3000
http://localhost:4200
https://localhost:5001
```

`http://localhost:4200` is included by default. **No proxy configuration is required.**

---

### Common Issues

**`ERR_CONNECTION_REFUSED`**
The backend is not running or `environment.ts` points to the wrong port.
Verify the backend is healthy via the Scalar/Swagger URL, then confirm `apiBaseUrl` matches.

**`Provisional headers are shown` (CORS preflight blocked)**
Ensure the middleware order in `Program.cs` is `UseCors` **before** `UseHttpsRedirection`:
```csharp
app.UseCors("AllowAll");
app.UseHttpsRedirection();
```

**Migration fails**
Verify the SQL Server connection string in `appsettings.Development.json` and that the instance is reachable.

---

### When to Update This File

Update `README.md` whenever:
- [ ] A new key is added to `appsettings.json` or `environment.ts`
- [ ] A new EF Core migration changes the setup steps
- [ ] The backend launch profile or port changes
- [ ] The minimum Node.js or .NET SDK version changes
- [ ] A new npm dependency or global CLI tool is required
- [ ] CORS origins are updated

---

## 💻 Development

### Adding a New Entity

1. **Create Entity** in `FH.ToDo.Core/Entities/`:
```csharp
public class Product : BaseEntity<int>  // ← Explicit key type
{
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
}
```

2. **Add to DbContext** in `FH.ToDo.Core.EF/Context/ToDoDbContext.cs`:
```csharp
public DbSet<Product> Products => Set<Product>();
```

3. **Create Migration**:
```bash
dotnet ef migrations add AddProductEntity
dotnet ef database update
```

4. **No custom repository needed!** Use generic in service:
```csharp
public class ProductService
{
    private readonly IRepository<Product, int> _productRepository;

    public ProductService(IRepository<Product, int> productRepository)
    {
        _productRepository = productRepository;
    }
}
```

### Creating a Service with Query Builder

```csharp
public class ProductService : IProductService
{
    private readonly IRepository<Product, int> _productRepository;

    // Public API
    public async Task<List<ProductDto>> GetProducts(GetProductInput input)
    {
        var query = GetProductsFilteredQuery(input);
        query = query.OrderBy(p => p.Name);
        var products = await query.ToListAsync();
        return _mapper.Map(products);
    }

    // Private query builder
    private IQueryable<Product> GetProductsFilteredQuery(GetProductInput input)
    {
        return _productRepository.GetAll()
            .Where(p => !p.IsDeleted)
            .WhereIf(input.MinPrice.HasValue, p => p.Price >= input.MinPrice)
            .WhereIf(input.SearchTerm.HasValue(), p => p.Name.Contains(input.SearchTerm!));
    }
}
```

---

## 🧪 Testing

### Test Projects

| Project | Type | Framework | Purpose |
|---------|------|-----------|---------|
| **FH.ToDo.Tests** | Unit Tests | xUnit, Moq, FluentAssertions | Service layer testing |
| **FH.ToDo.Tests.Api.BDD** | API Integration Tests (BDD) | Reqnroll (BDD), xUnit, WebApplicationFactory | End-to-end API testing with Gherkin scenarios |

---

### FH.ToDo.Tests (Unit Tests) ✅

**Purpose:** Test individual services, repositories, and business logic in isolation.

**Current Coverage:** Authentication service password hashing and verification (3 tests passing)

**Running Tests:**
```powershell
# Run all unit tests
dotnet test FH.ToDo.Tests

# Run with verbose output
dotnet test FH.ToDo.Tests --verbosity detailed

# Watch mode (auto-run on changes)
dotnet watch test --project FH.ToDo.Tests
```

**Example Test:**
```csharp
[Fact]
public async Task GetPeople_WithFilter_ReturnsFilteredUsers()
{
    // Arrange
    var mockRepo = new Mock<IRepository<User, Guid>>();
    var users = new List<User> { /* test data */ }.AsQueryable();
    mockRepo.Setup(r => r.GetAll()).Returns(users);

    var service = new UserServices(mockRepo.Object, mapper);

    // Act
    var result = await service.GetPeople(new GetUserInput { Filter = "john" });

    // Assert
    result.Should().NotBeEmpty();
}
```

📖 **[View FH.ToDo.Tests README](FH.ToDo.Tests/README.md)** for detailed documentation

---

### FH.ToDo.Tests.Api.BDD (API Integration Tests) ✅

**Purpose:** Test complete API workflows using real HTTP requests against an in-memory database.

**Framework:** Reqnroll (modern BDD framework) with Gherkin syntax for human-readable test scenarios.

**Current Coverage:** Authentication/Login API (6 scenarios, all passing)
- ✅ Successful login with valid credentials
- ✅ Failed login with invalid password
- ✅ Failed login with non-existent user
- ✅ Failed login with empty email
- ✅ Failed login with empty password
- ✅ Admin user successful login

**Test Infrastructure:**
- **In-memory SQLite database** (isolated, no file cleanup needed)
- **WebApplicationFactory** (full ASP.NET Core pipeline)
- **Pre-seeded test users** (testuser@example.com, admin@example.com)
- **Real HTTP client** (tests actual endpoint responses)

**Running BDD Tests:**
```powershell
# Run all BDD tests
dotnet test FH.ToDo.Tests.Api.BDD

# Run with detailed Gherkin output
dotnet test FH.ToDo.Tests.Api.BDD --verbosity normal

# Run specific feature/scenario
dotnet test FH.ToDo.Tests.Api.BDD --filter "DisplayName~Authentication"
dotnet test FH.ToDo.Tests.Api.BDD --filter "DisplayName~successful"

# Watch mode (auto-run on changes)
dotnet watch test --project FH.ToDo.Tests.Api.BDD
```

**Example BDD Scenario:**
```gherkin
Feature: User Authentication - Login
    As a user of the FH.ToDo application
    I want to authenticate with my credentials
    So that I can access protected resources

Scenario: Successful login with valid credentials
    Given I am not authenticated
    When I attempt to login with the following credentials:
        | Email                | Password     |
        | testuser@example.com | Password123! |
    Then the response status code should be 200
    And the response should contain an access token
    And the response should contain a refresh token
    And the token should contain the user email "testuser@example.com"
```

📖 **[View FH.ToDo.Tests.Api.BDD README](FH.ToDo.Tests.Api.BDD/README.md)** for detailed BDD testing guide

**Visual Studio Test Explorer:**
1. Open Test Explorer: `Test` → `Test Explorer` (or `Ctrl + E, T`)
2. Build solution: `Ctrl + Shift + B`
3. Click ▶️ to run all tests
4. Tests appear grouped by feature → scenario

**Test Results Summary:**
```
✅ FH.ToDo.Tests (3 passing)
  ✅ AuthenticationServiceSimpleTests
    ✅ VerifyPassword_WithCorrectPassword_ReturnsTrue
    ✅ VerifyPassword_WithIncorrectPassword_ReturnsFalse
    ✅ HashPassword_GeneratesValidHash

✅ FH.ToDo.Tests.Api.BDD (6 passing)
  ✅ User Authentication - Login
    ✅ Successful login with valid credentials
    ✅ Failed login with invalid password
    ✅ Failed login with non-existent user
    ✅ Failed login with empty email
    ✅ Failed login with empty password
    ✅ Admin user successful login
```

**Total:** 9 tests passing across 2 test projects

---

## 📚 Extension Methods Available

### QueryableExtensions

```csharp
// Conditional filtering
query.WhereIf(condition, predicate)

// Pagination
query.PageBy(skipCount, maxResultCount)
query.PageByPageNumber(pageNumber, pageSize)

// Conditional ordering
query.OrderByIf(condition, keySelector)
query.OrderByDescendingIf(condition, keySelector)

// Conditional limiting
query.TakeIf(condition, maxCount)

// String utilities
string.HasValue()
string.IsNullOrWhiteSpace()
```

---

## 🛠️ Troubleshooting

### Database Setup

**✅ Automatic (Default):**

The app **automatically creates the database** on first run via `context.Database.MigrateAsync()` in `Program.cs`:

```csharp
// Auto-apply migrations and seed data on startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ToDoDbContext>();

    // ✅ Creates DB + applies all migrations automatically
    await context.Database.MigrateAsync();

    // ✅ Seeds 40 test users
    await scope.ServiceProvider.GetRequiredService<IDataSeeder>().SeedAsync();
}
```

**Just run the app - no manual steps needed!**

---

**⚠️ Manual Fallback (if auto-migration fails):**

If for any reason auto-migration doesn't work, you can apply migrations manually:

```powershell
# Navigate to solution root
cd C:\Projects\FunctionHealth\FH.ToDo

# Apply migrations manually
dotnet ef database update --project FH.ToDo.Core.EF --startup-project FH.ToDo.Web.Host

# Run the app
dotnet run --project FH.ToDo.Web.Host
```

This creates the database at the same location and applies all migrations.

---

### Database Issues

**Problem:** Need to reset or recreate the database

**Solution 1 - Delete and restart** (simplest):
```powershell
# Stop the app, delete the database file, restart
Remove-Item FHToDo.db       # From solution root
# OR
Remove-Item FH.ToDo.Web.Host\FHToDo.db    # If running from VS

dotnet run --project FH.ToDo.Web.Host
```
The database will be **auto-recreated with fresh data** via `MigrateAsync()` + `SeedAsync()`.

**Solution 2 - Using EF Core CLI**:
```powershell
# Drop database
dotnet ef database drop --project FH.ToDo.Core.EF --startup-project FH.ToDo.Web.Host --force

# Run app (will auto-create)
dotnet run --project FH.ToDo.Web.Host
```

**Database location:**
- `dotnet run` → `FH.ToDo/FHToDo.db` (solution root)
- Visual Studio F5 → `FH.ToDo.Web.Host/FHToDo.db` (project root)

---

### Common Errors

**Error:** `Connection string keyword 'server' is not supported`  
**Cause:** Old SQL Server connection string in `appsettings.json`  
**Fix:** Ensure all appsettings files use SQLite:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=../FHToDo.db"
  }
}
```

**Error:** `No DbContext was found`  
**Cause:** Missing EF Core tools  
**Fix:** Install EF Core CLI tools:
```powershell
dotnet tool install --global dotnet-ef
```

**Error:** `Database file is locked`  
**Cause:** Multiple instances of the app running  
**Fix:** Stop all running instances, delete lock file:
```powershell
Remove-Item FHToDo.db-shm, FHToDo.db-wal -ErrorAction SilentlyContinue
```

---

## 🎯 Best Practices Followed

✅ **Clean Architecture** - Clear separation of concerns  
✅ **Generic Repositories** - No boilerplate custom repositories  
✅ **Query Builders** - Business logic in services  
✅ **Mapperly** - Compile-time, type-safe mapping  
✅ **Explicit Key Types** - `BaseEntity<TKey>` flexibility  
✅ **Extension Methods** - Fluent, readable queries  
✅ **DTOs Only** - Never expose entities from services  
✅ **Async/Await** - Throughout the stack  
✅ **Soft Delete** - Built-in data protection  
✅ **Audit Fields** - Automatic tracking  

---

## 🛠️ Technology Stack

- **Framework**: ASP.NET Core 10
- **Language**: C# 14
- **ORM**: Entity Framework Core 10
- **Database**: SQL Server
- **Mapping**: Mapperly (source generator)
- **API Docs**: OpenAPI/Swagger
- **Architecture**: Clean Architecture + Generic Repository + Query Builders

---

## 📖 Further Reading

### Project Documentation
- [FH.ToDo.Core README](FH.ToDo.Core/README.md) - Domain layer details
- [FH.ToDo.Core.EF README](FH.ToDo.Core.EF/README.md) - Infrastructure details
- [FH.ToDo.Web.Host README](FH.ToDo.Web.Host/README.md) - API documentation
- [FH.ToDo.Tests README](FH.ToDo.Tests/README.md) - Testing guide and runbook
- [FH.ToDo.Frontend README](FH.ToDo.Frontend/README.md) - Angular SPA documentation

### API Testing
- **[FH.ToDo.http](FH.ToDo.http)** - HTTP request collection for quick API testing
  - All endpoints with sample payloads
  - Works in Visual Studio 2022, VS Code (REST Client), and Rider
  - Variables auto-populate (tokens, IDs)

### External Resources
- [Microsoft Docs - Clean Architecture](https://learn.microsoft.com/dotnet/architecture/)
- [Mapperly Documentation](https://github.com/riok/mapperly)
- [ASP.NET Core Testing](https://learn.microsoft.com/aspnet/core/test/)

---

## 📝 License

[Your License Here]

---

## 👥 Contributors

[Your Team/Contributors Here]

---

**Built with ❤️ using .NET 10 and Clean Architecture principles**
```

2. **Update connection strings**:
   - Edit `FH.ToDo.Core.EF\appsettings.json`
   - Edit `FH.ToDo.Web.Host\appsettings.json`

3. **Apply database migrations**:
```powershell
cd FH.ToDo.Core.EF
dotnet ef database update
```

4. **Run the application**:
```powershell
cd FH.ToDo.Web.Host
dotnet run
```

5. **Access Swagger UI**:
   - Navigate to: `https://localhost:<port>/swagger`

---

## 🗄️ Database Schema

### Current Tables

#### Users
User accounts with full audit tracking and soft delete support.

**Columns**:
- Id (GUID, PK)
- Email (unique, indexed)
- FirstName, LastName (indexed together)
- PhoneNumber
- IsActive
- CreatedDate, CreatedBy, ModifiedDate, ModifiedBy
- IsDeleted, DeletedDate, DeletedBy

**Indexes**:
- IX_Users_Email (Unique)
- IX_Users_FullName (FirstName + LastName)
- IX_Users_IsDeleted

---

## 🎯 Features

### Implemented ✅
- [x] Clean Architecture structure
- [x] Domain entities with validation
- [x] EF Core with Fluent API
- [x] Automatic audit tracking
- [x] Soft delete functionality
- [x] Database migrations
- [x] Connection resiliency
- [x] Query filters

### To Be Implemented 🚧
- [ ] User authentication (JWT)
- [ ] Authorization & roles
- [ ] API Controllers (CRUD)
- [ ] DTOs and AutoMapper
- [ ] ToDo/Task entities
- [ ] Categories and tags
- [ ] Search and filtering
- [ ] Unit tests
- [ ] Integration tests
- [ ] Logging (Serilog)
- [ ] API versioning
- [ ] Rate limiting
- [ ] Caching

---

## 🛠️ Technology Stack

### Backend
- **Framework**: ASP.NET Core 10
- **ORM**: Entity Framework Core 10
- **Database**: SQL Server
- **API Documentation**: Swagger/OpenAPI

### Architecture Patterns
- Clean Architecture
- Domain-Driven Design (DDD)
- Repository Pattern (optional)
- CQRS (planned)

### Future Additions
- AutoMapper
- FluentValidation
- MediatR (for CQRS)
- Serilog
- xUnit / NUnit

---

## 📝 Development Workflow

### Adding a New Entity

1. **Create entity in Core**:
```csharp
// FH.ToDo.Core/Entities/Tasks/ToDoTask.cs
[Table("Tasks")]
public class ToDoTask : BaseEntity
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
}
```

2. **Create configuration in Core.EF**:
```csharp
// FH.ToDo.Core.EF/Configurations/ToDoTaskConfiguration.cs
public class ToDoTaskConfiguration : IEntityTypeConfiguration<ToDoTask>
{
    public void Configure(EntityTypeBuilder<ToDoTask> builder)
    {
        builder.HasIndex(t => t.UserId);
    }
}
```

3. **Add DbSet**:
```csharp
// FH.ToDo.Core.EF/Context/ToDoDbContext.cs
public DbSet<ToDoTask> Tasks => Set<ToDoTask>();
```

4. **Create and apply migration**:
```powershell
cd FH.ToDo.Core.EF
dotnet ef migrations add AddToDoTaskEntity
dotnet ef database update
```

---

## 🧪 Testing

### Running Tests

```bash
dotnet test
```

**Current Test Coverage:**
- ✅ **AuthenticationService** - Password hashing and verification (3 tests)
  - Correct password validation
  - Incorrect password rejection
  - Hash generation and validation

**Test Results:**
```
✅ 3 Tests Passed | 0 Failed
```

### Test Project Structure
```
FH.ToDo.Tests/
├── Services/
│   └── AuthenticationServiceSimpleTests.cs
├── Controllers/                         (To be added)
└── FH.ToDo.Tests.csproj
```

**Testing Stack:**
- **Framework:** xUnit 2.9.2
- **Mocking:** Moq 4.20.72
- **Assertions:** FluentAssertions 7.0.0

---

## 📊 Design Decisions

### Why Clean Architecture?
- ✅ **Testability**: Domain logic can be tested without infrastructure
- ✅ **Maintainability**: Clear separation of concerns
- ✅ **Flexibility**: Easy to swap infrastructure (database, UI, etc.)
- ✅ **Scalability**: Each layer can scale independently

### Why Hybrid Approach (Annotations + Fluent API)?
- ✅ **Annotations**: Validation at application layer, works with DTOs
- ✅ **Fluent API**: Full database control (indexes, defaults, relationships)
- ✅ **Best of both worlds**: Clean entities + powerful configurations

### Why Soft Delete?
- ✅ **Data preservation**: Never lose data
- ✅ **Audit trail**: Track what was deleted and when
- ✅ **Compliance**: Meet regulatory requirements
- ✅ **Undo functionality**: Can restore deleted items

---

## 🔒 Security Considerations

- [ ] Use HTTPS only
- [ ] Implement authentication (JWT)
- [ ] Add authorization policies
- [ ] Validate all inputs
- [ ] Use parameterized queries (EF Core does this)
- [ ] Store secrets in Azure Key Vault
- [ ] Implement rate limiting
- [ ] Add CORS policies

---

## 📚 Resources

### Documentation
- [ASP.NET Core Docs](https://docs.microsoft.com/aspnet/core)
- [EF Core Docs](https://docs.microsoft.com/ef/core)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

### Tutorials
- [Clean Architecture with .NET](https://docs.microsoft.com/dotnet/architecture/modern-web-apps-azure/)
- [EF Core Migrations](https://docs.microsoft.com/ef/core/managing-schemas/migrations/)

---

## 🤝 Contributing

### Branch Strategy
- `master` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches

### Commit Message Format
```
<type>(<scope>): <subject>

Example:
feat(user): add user registration endpoint
fix(db): resolve migration conflict
docs(readme): update installation instructions
```

---

## 📄 License

[Add your license information here]

---

## 👥 Team

**Version**: 1.0  
**Last Updated**: April 10, 2026  
**Maintained by**: FunctionHealth Team

---

## ✅ Project Status

**Current Phase**: Authentication & Core API ✅  
**Next Phase**: Todo Feature 🚧

### Milestones
- [x] Project structure setup
- [x] Domain entities (User)
- [x] Database infrastructure
- [x] EF Core migrations
- [x] JWT Authentication (login + register)
- [x] User CRUD API
- [x] Angular frontend structure (routing, guards, interceptors)
- [x] Login & Register pages (frontend + backend)
- [ ] Todo entity and CRUD API
- [ ] Todo Angular feature
- [ ] Testing suite
- [ ] Deployment pipeline

---

**Happy Coding! 🚀**
