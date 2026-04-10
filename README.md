# FH.ToDo - Task Management Application

## 📋 Overview
A production-grade ToDo/Task Management application built with **ASP.NET Core 10**, **Entity Framework Core**, and **Clean Architecture** principles. This solution demonstrates professional software development practices including domain-driven design, separation of concerns, and infrastructure abstraction.

---

## 🏗️ Architecture

### Clean Architecture Layers

```
┌─────────────────────────────────────────┐
│     FH.ToDo.Web.Host (Presentation)    │
│         ASP.NET Core Web API            │
└────────────┬────────────────────────────┘
             │ References
             ↓
┌─────────────────────────────────────────┐
│      FH.ToDo.Core (Domain Layer)        │
│    Pure domain entities & interfaces    │
│          NO external dependencies       │
└────────────┬────────────────────────────┘
             ↑ Referenced by
             │
┌────────────┴────────────────────────────┐
│   FH.ToDo.Core.EF (Infrastructure)      │
│     EF Core, DbContext, Migrations      │
└─────────────────────────────────────────┘

           Shared by All ↓
┌─────────────────────────────────────────┐
│  FH.ToDo.Core.Shared (Shared Library)   │
│    Constants, Enums, Helper Classes     │
└─────────────────────────────────────────┘
```

---

## 📦 Projects

### FH.ToDo.Core
**Domain Layer** - Contains business entities and core domain logic.
- ✅ Pure domain model (no infrastructure dependencies)
- ✅ Entity validation with Data Annotations
- ✅ Base entity with audit tracking and soft delete
- ✅ Current entities: User

📖 [View FH.ToDo.Core README](FH.ToDo.Core/README.md)

---

### FH.ToDo.Core.EF
**Infrastructure Layer** - Entity Framework Core implementation.
- ✅ DbContext with automatic audit tracking
- ✅ Fluent API configurations for database control
- ✅ Automatic soft delete handling
- ✅ Database migrations management
- ✅ Production-grade features (retry logic, connection resiliency)

📖 [View FH.ToDo.Core.EF README](FH.ToDo.Core.EF/README.md)

---

### FH.ToDo.Web.Host
**Presentation Layer** - ASP.NET Core Web API.
- ✅ RESTful API endpoints
- ✅ Swagger/OpenAPI documentation
- ✅ Dependency injection configuration
- 🚧 Controllers, DTOs, AutoMapper (to be implemented)

📖 [View FH.ToDo.Web.Host README](FH.ToDo.Web.Host/README.md)

---

### FH.ToDo.Core.Shared
**Shared Library** - Common utilities and constants.
- ✅ Enums (Priority, Status, etc.)
- ✅ Constants (error codes, messages)
- ✅ Extension methods
- ✅ Helper classes

📖 [View FH.ToDo.Core.Shared README](FH.ToDo.Core.Shared/README.md)

---

## 🚀 Getting Started

### Prerequisites
- ✅ .NET 10 SDK
- ✅ SQL Server or SQL Server LocalDB
- ✅ Visual Studio 2026 or VS Code
- ✅ Entity Framework Core CLI tools

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd FH.ToDo
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

**Current Phase**: Foundation ✅  
**Next Phase**: API Implementation 🚧

### Milestones
- [x] Project structure setup
- [x] Domain entities (User)
- [x] Database infrastructure
- [x] Migrations working
- [ ] API endpoints
- [ ] Authentication
- [ ] Full CRUD operations
- [ ] Testing suite
- [ ] Deployment pipeline

---

**Happy Coding! 🚀**
