# FH.ToDo - Task Management Application

## 📋 Overview
A production-grade ToDo/Task Management application built with **ASP.NET Core 10**, **Entity Framework Core**, and **Clean Architecture** principles using **Generic Repository Pattern** with **Query Builder Services**. This solution demonstrates professional software development practices including domain-driven design, separation of concerns, and modern .NET 10 patterns.

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
- ✅ `UsersController` — full CRUD
- ✅ DI registration in Program.cs
- ✅ OpenAPI/Swagger + Scalar configuration

**DI Registration Pattern:**
```csharp
// Generic repository
builder.Services.AddScoped(typeof(IRepository<,>), typeof(Repository<,>));

// Mapperly mapper (singleton - stateless)
builder.Services.AddSingleton<UserMapper>();

// Application services
builder.Services.AddScoped<IUserService, UserServices>();
```

📖 [View FH.ToDo.Web.Host README](FH.ToDo.Web.Host/README.md)

---

### FH.ToDo.Frontend (Angular SPA)
**Angular 19 single-page application**

**Stack:** Angular 19, Angular Material, TypeScript (strict), SCSS

**Structure:**
```
src/app/
├── core/            # Guards, interceptors, app-wide services
├── features/        # Feature modules (auth, todos, users, dashboard, devtools)
│   └── {feature}/
│       ├── {feature}-{component}/    # One folder per component
│       │   ├── *.component.ts        # templateUrl + styleUrl — no inline
│       │   ├── *.component.html
│       │   └── *.component.scss
│       ├── forms/                    # Typed FormGroup interfaces only
│       ├── models/                   # API contracts — one interface per file
│       └── services/                 # Feature-scoped HTTP services
├── layout/          # App shell (app-layout with navigation + theme sidenav)
└── shared/          # Cross-feature components, directives, models
```

**Conventions:**
- File naming: `{feature}-{entity}-{operation}` — e.g. `todo-task-create-request.model.ts`
- Form files contain the `FormGroup<T>` **interface only** — form is instantiated in the component
- Error access: `form.controls.x.errors?.['required']` — bracket notation required (strict templates)
- Auth models: `AuthLoginRequest`, `AuthRegisterRequest`, `AuthTokenInfo`, etc. — all in `features/auth/models/`
- Task models: `TodoTask`, `TodoTaskList`, `TodoSubTask`, etc. — all in `features/todos/models/`

📖 [View FH.ToDo.Frontend README](FH.ToDo.Frontend/README.md)

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
| SQL Server | 2019 / Express 2019+ | Local or remote instance |
| Node.js | 20.x LTS | [nodejs.org](https://nodejs.org/) |
| Angular CLI | 21.x | `npm install -g @angular/cli` |
| EF Core CLI | 10.x | `dotnet tool install --global dotnet-ef` |
| Visual Studio | 2022 17.x+ | Community edition is supported |

### Backend Setup

**1 — Configure the database connection string**

Edit `FH.ToDo.Web.Host/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=FHToDoDev;User ID=sa;Password=YOUR_PASSWORD;TrustServerCertificate=True;"
  }
}
```

**2 — Apply EF Core migrations**

```powershell
dotnet ef database update --project FH.ToDo.Core.EF --startup-project FH.ToDo.Web.Host
```

Re-run this command whenever a new migration is added to the project.

**3 — Choose a launch profile**

| Profile | HTTP URL | HTTPS URL | Recommendation |
|---|---|---|---|
| `http` (Kestrel) | `http://localhost:5214` | — | ✅ Use this |
| `https` (Kestrel) | `http://localhost:5214` | `https://localhost:7182` | — |
| IIS Express | `http://localhost:52333` | `https://localhost:44387` | VS default |

> **Recommendation:** Use the Kestrel `http` profile. In Visual Studio, select it from the run profile dropdown next to the ▶ button. It gives a stable, machine-independent URL.

To trust the dev certificate (HTTPS profiles only):
```powershell
dotnet dev-certs https --trust
```

**4 — Start the backend and confirm it is healthy**

Press `F5`. Navigate to:
- Scalar UI: `http://localhost:5214/scalar/v1`
- Swagger UI: `http://localhost:5214/swagger`

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

### Unit Testing Services
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
    Assert.NotEmpty(result);
}
```

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

- [FH.ToDo.Core README](FH.ToDo.Core/README.md) - Domain layer details
- [FH.ToDo.Core.EF README](FH.ToDo.Core.EF/README.md) - Infrastructure details
- [FH.ToDo.Web.Host README](FH.ToDo.Web.Host/README.md) - API documentation
- [Microsoft Docs - Clean Architecture](https://learn.microsoft.com/dotnet/architecture/)
- [Mapperly Documentation](https://github.com/riok/mapperly)

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

### Running Tests (when implemented)
```bash
dotnet test
```

### Test Projects Structure
```
FH.ToDo.Tests/
├── Unit/
│   ├── Core.Tests/
│   └── Core.EF.Tests/
└── Integration/
    └── Web.Host.Tests/
```

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
