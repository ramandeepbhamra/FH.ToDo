# FH.ToDo Clean Architecture Rules

## Non-Negotiables

### Layer Separation
- **NEVER** bypass layer boundaries
- **NEVER** reference Web.Host from Core or Core.EF
- **NEVER** reference Core.EF from Core
- **NEVER** access DbContext directly from Controllers

### Reference Flow
```
Web.Host → Services → Core.EF → Core
         ↘ Services.Core ↗
```

**Allowed References**:
- ✅ Web.Host can reference: Services, Services.Core, Core, Core.EF
- ✅ Services can reference: Services.Core, Core, Core.EF
- ✅ Core.EF can reference: Core only
- ✅ Core can reference: Core.Shared only

**Forbidden References**:
- ❌ Core cannot reference: Core.EF, Services, Web.Host
- ❌ Core.EF cannot reference: Services, Web.Host
- ❌ Services.Core cannot reference: Core.EF, Services, Web.Host

## Layer Responsibilities

### FH.ToDo.Core (Domain Layer)
**Contains**:
- Domain entities (POCOs with validation attributes)
- Domain interfaces
- Domain exceptions

**Rules**:
- ✅ Entities inherit from `BaseEntity`
- ✅ Use Data Annotations for validation only
- ✅ No database configuration in entities
- ✅ No business logic in entities (keep them anemic for this project)
- ❌ NO dependencies on EF Core
- ❌ NO dependencies on infrastructure

### FH.ToDo.Core.EF (Infrastructure Layer)
**Contains**:
- DbContext (ToDoDbContext)
- Entity configurations (IEntityTypeConfiguration<>)
- EF Core migrations
- Design-time factory

**Rules**:
- ✅ Use Fluent API for all database configuration
- ✅ Separate configuration classes for each entity
- ✅ Configure indexes, relationships, SQL defaults here
- ✅ Implement query filters for soft delete
- ❌ NO business logic
- ❌ NO DTOs

### FH.ToDo.Services.Core (Service Contracts Layer)
**Contains**:
- Service interfaces
- DTOs (Data Transfer Objects)
- Input/Output models

**Rules**:
- ✅ DTOs are simple, serializable POCOs
- ✅ Input DTOs use records (immutable)
- ✅ Output DTOs use classes
- ✅ Separate DTOs for Create, Update, List, Detail
- ❌ NO entity references
- ❌ NO implementation code

### FH.ToDo.Services (Service Implementation Layer)
**Contains**:
- Service implementations
- AutoMapper profiles
- Business logic

**Rules**:
- ✅ Inject DbContext via constructor
- ✅ Use AutoMapper for entity ↔ DTO mapping
- ✅ Handle business logic here
- ✅ Return DTOs, never entities
- ❌ NO direct database queries in controllers
- ❌ NO exposing IQueryable

### FH.ToDo.Web.Host (Presentation Layer)
**Contains**:
- API Controllers
- Middleware
- DI registration
- Configuration

**Rules**:
- ✅ Controllers are thin, delegate to services
- ✅ Use DTOs for all inputs/outputs
- ✅ Return ApiControllerBase methods (Success, Created, etc.)
- ✅ Use [Authorize] for protected endpoints
- ❌ NO business logic in controllers
- ❌ NO direct DbContext injection
- ❌ NO direct entity references

## Entity Rules

### BaseEntity Inheritance
**ALL entities MUST**:
- Inherit from `BaseEntity`
- Use `Guid` as primary key
- Have audit fields (provided by BaseEntity)
- Support soft delete (provided by BaseEntity)

### Validation Attributes
**Use Data Annotations for**:
- `[Required]` - Not null validation
- `[MaxLength(n)]` - String length constraints
- `[EmailAddress]` - Email format
- `[Phone]` - Phone number format
- `[Range(min, max)]` - Numeric ranges

**Define constants for lengths**:
```csharp
public const int MaxTitleLength = 200;

[MaxLength(MaxTitleLength)]
public string Title { get; set; }
```

### Table Naming
- Use `[Table("TableName")]` attribute
- Table names are **plural** (Users, Tasks, Categories)
- Can be overridden in Fluent API if needed

## Configuration Rules

### Fluent API Configuration
**Each entity MUST have**:
- Separate `IEntityTypeConfiguration<>` class
- Placed in `FH.ToDo.Core.EF/Configurations/`
- Named `{Entity}Configuration.cs`

**Configure**:
- ✅ Indexes (unique, composite, covering)
- ✅ Relationships (HasOne, HasMany, OnDelete)
- ✅ SQL defaults (GETUTCDATE(), default values)
- ✅ Precision for decimals
- ✅ Query filters for soft delete

**Example**:
```csharp
public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        // Indexes
        builder.HasIndex(u => u.Email).IsUnique();
        builder.HasIndex(u => new { u.FirstName, u.LastName });

        // SQL Defaults
        builder.Property(u => u.CreatedDate)
            .HasDefaultValueSql("GETUTCDATE()");

        // Query Filter
        builder.HasQueryFilter(u => !u.IsDeleted);
    }
}
```

## Migration Rules

### Naming Conventions
- ✅ Descriptive action-based names
- ✅ Examples: `AddTaskEntity`, `AddUserEmailIndex`, `UpdateTaskStatusColumn`
- ❌ Vague names: `Changes`, `Update1`, `Fix`

### Safety
- ✅ **Always** review generated SQL
- ✅ **Test** in development first
- ✅ **Backup** before applying to production
- ❌ **Never** modify applied migrations
- ❌ **Never** apply destructive changes without data migration plan

### Commands
```bash
# From FH.ToDo.Core.EF directory
dotnet ef migrations add {Name}
dotnet ef database update
dotnet ef migrations remove  # Only if not applied
```

## DTO & Mapping Rules

### DTO Patterns

**CreateDto** (Input):
```csharp
public record CreateUserDto(
    string Email,
    string FirstName,
    string LastName,
    string? PhoneNumber
);
```

**UpdateDto** (Input):
```csharp
public record UpdateUserDto(
    string Email,
    string FirstName,
    string LastName,
    string? PhoneNumber,
    bool IsActive
);
```

**ListDto** (Output):
```csharp
public class UserListDto
{
    public Guid Id { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public bool IsActive { get; set; }
}
```

### AutoMapper Rules
- ✅ Create separate profile per domain
- ✅ **Always** ignore audit fields when mapping from DTO to Entity
- ✅ Use explicit `ForMember` configurations
- ❌ Never use `ReverseMap()` without review
- ❌ Never map `Id` from DTO to Entity (except updates)

**Example**:
```csharp
public class UserMappingProfile : Profile
{
    public UserMappingProfile()
    {
        CreateMap<User, UserListDto>();

        CreateMap<CreateUserDto, User>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedDate, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedDate, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedDate, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedBy, opt => opt.Ignore());
    }
}
```

## API Rules

### Controller Patterns
- ✅ Inherit from `ApiControllerBase`
- ✅ Use `[Authorize]` at class level
- ✅ Use `[AllowAnonymous]` for public endpoints
- ✅ Return `Success()`, `Created()`, `BadRequest()`, etc.
- ✅ Use route parameters for IDs: `[HttpGet("{id}")]`
- ✅ Use `[FromQuery]` for complex inputs
- ✅ Use `[FromBody]` for POST/PUT payloads

### HTTP Methods
- `GET` - Retrieve (no body)
- `POST` - Create (body required)
- `PUT` - Update (body required, ID in route)
- `DELETE` - Delete (no body, ID in route)

### Response Format
Use ApiControllerBase helpers:
```csharp
return Success(data);                    // 200 OK
return Created(data, "Created");         // 201 Created
return BadRequest("Invalid");            // 400 Bad Request
return NotFound();                       // 404 Not Found
```

## Audit & Soft Delete Rules

### Audit Fields
- Automatically populated by `ToDoDbContext.SaveChanges()`
- `CreatedDate` - Set on insert
- `ModifiedDate` - Set on update
- `CreatedBy`, `ModifiedBy` - **Must** be set by application layer

### Soft Delete
- **Never** use `DbSet.Remove()` directly
- Use service method that sets `IsDeleted = true`
- Or allow DbContext to handle via interceptor
- Query filter automatically excludes deleted: `WHERE IsDeleted = 0`

### Including Soft-Deleted
```csharp
var allUsers = await _context.Users
    .IgnoreQueryFilters()  // Include soft-deleted
    .ToListAsync();
```

## Database Design Rules

### Indexes
- ✅ Create for **all** foreign keys
- ✅ Create for frequently queried columns
- ✅ Use composite indexes for multi-column queries
- ✅ Use unique indexes for business keys (email, username)

### String Lengths
- ✅ **Always** set explicit max length
- ✅ Use constants: `MaxEmailLength = 256`
- ✅ Common lengths: Email (256), Name (100), Phone (20), URL (2000)

### Defaults
- ✅ `CreatedDate DEFAULT GETUTCDATE()`
- ✅ `IsDeleted DEFAULT 0`
- ✅ `IsActive DEFAULT 1`

### Relationships
- ✅ Define foreign keys explicitly
- ✅ Use `OnDelete(DeleteBehavior.Restrict)` for critical relations
- ✅ Use `OnDelete(DeleteBehavior.Cascade)` sparingly

## Testing Rules

### Unit Tests
- Test service logic
- Mock DbContext via `DbContextOptions<>`
- Test AutoMapper profiles

### Integration Tests
- Test controller endpoints
- Use in-memory database or test database
- Verify full request/response cycle

## Security Rules

- ✅ **Always** use `[Authorize]` on controllers
- ✅ Use `[AllowAnonymous]` explicitly for public endpoints
- ✅ Validate all inputs
- ✅ Never expose internal IDs in URLs (consider obfuscation)
- ✅ Use HTTPS only
- ❌ Never trust client input
- ❌ Never expose stack traces to clients

## Performance Rules

- ✅ Use `AsNoTracking()` for read-only queries
- ✅ Use paging for list endpoints
- ✅ Create indexes for filtering/sorting columns
- ✅ Use `Select()` to project only needed columns
- ❌ Avoid `Include()` for unused navigation properties
- ❌ Avoid N+1 queries

## Summary

**Remember**:
1. **Entities** in Core with validation attributes
2. **Configurations** in Core.EF with Fluent API
3. **Services** implement business logic
4. **Controllers** are thin orchestrators
5. **DTOs** for all API boundaries
6. **AutoMapper** for entity ↔ DTO conversion
7. **Soft delete** on all entities
8. **Audit fields** on all entities
9. **Clean Architecture** layer separation
10. **Security** on all endpoints
