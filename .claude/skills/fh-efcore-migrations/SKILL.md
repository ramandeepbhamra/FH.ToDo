---
name: fh-efcore-migrations
description: "EF Core 10 migration workflows for FH.ToDo - creating, applying, and managing database schema changes"
---

# FH.ToDo EF Core Migrations

## Quick Reference

```bash
# From FH.ToDo.Core.EF directory
cd C:\Projects\FunctionHealth\FH.ToDo\FH.ToDo.Core.EF

# Create migration
dotnet ef migrations add {MigrationName}

# Apply migrations
dotnet ef database update

# Rollback to previous
dotnet ef database update {PreviousMigrationName}

# Remove last migration (if not applied)
dotnet ef migrations remove

# List migrations
dotnet ef migrations list

# Generate SQL script
dotnet ef migrations script
```

## Migration Naming

✅ **Good**: AddTaskEntity, AddUserEmailIndex, UpdateTaskStatusColumn  
❌ **Bad**: Changes, Update1, Fix, NewMigration

## Design-Time Factory

`ToDoDbContextFactory` enables migrations without running the app:

```csharp
public class ToDoDbContextFactory : IDesignTimeDbContextFactory<ToDoDbContext>
{
    public ToDoDbContext CreateDbContext(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build();

        var optionsBuilder = new DbContextOptionsBuilder<ToDoDbContext>();
        optionsBuilder.UseSqlServer(
            configuration.GetConnectionString("DefaultConnection"));

        return new ToDoDbContext(optionsBuilder.Options);
    }
}
```

## Connection Strings

**Development** (`appsettings.Development.json`):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=...;Database=FHToDo_Dev;..."
  }
}
```

**Production** (`appsettings.json`):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=...;Database=FHToDo;..."
  }
}
```

## Migration Files

Each migration creates:
- `{Timestamp}_{Name}.cs` - Up/Down methods
- `{Timestamp}_{Name}.Designer.cs` - Metadata
- `ToDoDbContextModelSnapshot.cs` - Updated model state

## Common Patterns

### Create Table
```csharp
migrationBuilder.CreateTable(
    name: "Tasks",
    columns: table => new
    {
        Id = table.Column<Guid>(nullable: false),
        Title = table.Column<string>(maxLength: 200, nullable: false),
        CreatedDate = table.Column<DateTime>(nullable: false, defaultValueSql: "GETUTCDATE()"),
        // ...
    },
    constraints: table =>
    {
        table.PrimaryKey("PK_Tasks", x => x.Id);
    });
```

### Add Index
```csharp
migrationBuilder.CreateIndex(
    name: "IX_Tasks_UserId",
    table: "Tasks",
    column: "UserId");
```

### Add Foreign Key
```csharp
migrationBuilder.AddForeignKey(
    name: "FK_Tasks_Users_UserId",
    table: "Tasks",
    column: "UserId",
    principalTable: "Users",
    principalColumn: "Id",
    onDelete: ReferentialAction.Restrict);
```

## Safety Checks

Before applying, review for:
- ⚠️ DROP TABLE, DROP COLUMN (data loss)
- ⚠️ Changing column types (potential data loss)
- ⚠️ Reducing string lengths (truncation)
- ⚠️ Adding NOT NULL to existing columns (needs default or data migration)

## Rollback

```bash
# Rollback to specific migration
dotnet ef database update PreviousMigrationName

# Rollback all migrations
dotnet ef database update 0

# Remove unapplied migration
dotnet ef migrations remove
```

## Troubleshooting

### Connection string not found
- Ensure `appsettings.json` exists in `FH.ToDo.Core.EF`
- Check connection string key matches: `ConnectionStrings:DefaultConnection`

### Migration already applied
- Migration is in database, no action needed
- Check `__EFMigrationsHistory` table

### Pending model changes
- Entity/configuration changed after last migration
- Create new migration to capture changes
