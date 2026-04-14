# Claude Code Instructions - FH.ToDo

This repository is the **FH.ToDo** task management application built with **Clean Architecture** and **.NET 10**.

Claude Code automatically loads this file into context when you start a session in this repo.

---

## Project Type

**FH.ToDo** - Task management application following Clean Architecture principles with:
- ASP.NET Core 10 Web API
- Entity Framework Core 10
- SQL Server database
- AutoMapper v14
- Hybrid validation approach (Data Annotations + Fluent API)

---

## Architecture (Non-Negotiables)

### Layer Separation - STRICT
- **NEVER** bypass layer boundaries
- **NEVER** reference Web.Host from Core or Core.EF  
- **NEVER** reference Core.EF from Core
- **NEVER** access DbContext directly from Controllers

### Reference Flow
```
Web.Host → Services → Core.EF → Core
         ↘ Services.Core ↗
```

### Layer Responsibilities

| Layer | Purpose | Can Reference | Cannot Reference |
|-------|---------|---------------|------------------|
| **Core** | Domain entities, interfaces | Core.Shared | Anything else |
| **Core.EF** | EF Core, DbContext, migrations | Core | Services, Web.Host |
| **Services.Core** | DTOs, service interfaces | Core | Core.EF, Services |
| **Services** | Service implementations, AutoMapper | Core, Core.EF, Services.Core | Web.Host |
| **Web.Host** | API controllers, DI, config | All | None |

---

## Entity Rules

### BaseEntity Inheritance
**ALL entities MUST**:
- Inherit from `BaseEntity` (provides Id, audit fields, soft delete)
- Use `Guid` as primary key
- Place in `FH.ToDo.Core/Entities/{Domain}/`

### Validation Approach - HYBRID
- **Data Annotations** in entity class for validation
  - `[Required]`, `[MaxLength]`, `[EmailAddress]`, `[Phone]`
- **Fluent API** in separate configuration class for database features
  - Indexes, relationships, SQL defaults, query filters

**Example Entity**:
```csharp
[Table("Tasks")]
public class ToDoTask : BaseEntity
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
}
```

**Example Configuration**:
```csharp
public class ToDoTaskConfiguration : IEntityTypeConfiguration<ToDoTask>
{
    public void Configure(EntityTypeBuilder<ToDoTask> builder)
    {
        builder.HasIndex(t => t.UserId);
        builder.HasQueryFilter(t => !t.IsDeleted);
    }
}
```

---

## Migration Rules

### Commands (from FH.ToDo.Core.EF directory)
```bash
dotnet ef migrations add {DescriptiveName}
dotnet ef database update
dotnet ef migrations list
```

### Naming Conventions
- ✅ Good: `AddTaskEntity`, `AddUserEmailIndex`
- ❌ Bad: `Changes`, `Update1`, `Fix`

### Safety
- **Always** review generated SQL before applying
- **Never** modify applied migrations
- **Test** in development first

---

## DTO & Mapping Rules

### DTO Types
- **CreateDto** - Input, use `record`
- **UpdateDto** - Input, use `record`  
- **ListDto** - Output, use `class`
- **DetailDto** - Output, use `class`

### AutoMapper
- Create profiles in `FH.ToDo.Services/Mappers/`
- **Always** ignore audit fields when mapping from DTO to Entity
- **Never** expose entities directly in API

**Required Ignores**:
```csharp
.ForMember(dest => dest.Id, opt => opt.Ignore())
.ForMember(dest => dest.CreatedDate, opt => opt.Ignore())
.ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
.ForMember(dest => dest.ModifiedDate, opt => opt.Ignore())
.ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
.ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
.ForMember(dest => dest.DeletedDate, opt => opt.Ignore())
.ForMember(dest => dest.DeletedBy, opt => opt.Ignore())
```

---

## Controller Rules

- Inherit from `ApiControllerBase`
- Use `[Authorize]` at class level (default)
- Use `[AllowAnonymous]` for public endpoints
- Return `Success()`, `Created()`, `BadRequest()`, etc.
- **NEVER** inject DbContext directly
- **ALWAYS** use service layer

---

## Database Rules

### Indexes
- Create for **all** foreign keys
- Create for frequently queried columns
- Use composite indexes for multi-column queries
- Unique indexes for business keys (email)

### Soft Delete
- **Automatic** via DbContext.SaveChanges()
- Query filter: `WHERE IsDeleted = 0`
- Use `IgnoreQueryFilters()` to include deleted

### Audit Fields
- `CreatedDate` - Auto-set (SQL default: GETUTCDATE())
- `ModifiedDate` - Auto-set on update
- `CreatedBy`, `ModifiedBy`, `DeletedBy` - Set by application

---

## Key Files

- **DbContext**: `FH.ToDo.Core.EF/Context/ToDoDbContext.cs`
- **Base Entity**: `FH.ToDo.Core/Entities/Base/BaseEntity.cs`
- **Migrations**: `FH.ToDo.Core.EF/Migrations/`
- **API Controllers**: `FH.ToDo.Web.Host/Controllers/`

---

## Available Agents

Use `@` to invoke specialized agents:
- `@dba-ef-architect` - Database design, EF Core, migrations
- `@api-developer` - API controllers, endpoints
- `@service-developer` - Service layer, business logic
- `@code-reviewer` - Code quality reviews
- `@schema-reviewer` - Database schema audits
- `@migration-specialist` - Migration troubleshooting

---

## Available Commands

### Generate Commands
- `/generate:entity` - Create domain entity
- `/generate:migration` - EF Core migration
- `/generate:mapping` - AutoMapper profile + DTOs
- `/generate:crud` - Full CRUD stack

### Review Commands
- `/review:schema-audit` - Database schema review
- `/review:code-quality` - Code quality check

---

## Quick Reference

**Create Entity** → **Create Configuration** → **Add DbSet** → **Generate Migration** → **Apply Migration** → **Create DTOs** → **Create Mapping** → **Create Service** → **Create Controller**

---

Keep instructions **concise, actionable, and layer-correct**.
