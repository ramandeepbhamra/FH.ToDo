# EF Core Configuration - FH.ToDo

## DbContext

`FH.ToDo.Core.EF/Context/ToDoDbContext.cs`

Features:
- Automatic audit tracking via SaveChanges override
- Automatic soft delete handling
- Configuration auto-discovery

## Connection Strings

**Development**: `FH.ToDo.Core.EF/appsettings.Development.json`  
**Production**: `FH.ToDo.Core.EF/appsettings.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=...;Database=FHToDo_Dev;..."
  }
}
```

## Design-Time Factory

`FH.ToDo.Core.EF/Factories/ToDoDbContextFactory.cs`

Enables migrations without running the app.

## Migration Workflow

```bash
cd FH.ToDo.Core.EF
dotnet ef migrations add AddTaskEntity
dotnet ef database update
```

## Configuration Pattern

Each entity has separate `IEntityTypeConfiguration<>` class:

```csharp
public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasIndex(u => u.Email).IsUnique();
        builder.HasQueryFilter(u => !u.IsDeleted);
    }
}
```

Auto-discovered via:
```csharp
modelBuilder.ApplyConfigurationsFromAssembly(typeof(UserConfiguration).Assembly);
```
