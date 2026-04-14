---
name: fh-fluent-api-patterns
description: "Fluent API configuration patterns for FH.ToDo - indexes, relationships, SQL defaults, and query filters"
---

# FH.ToDo Fluent API Patterns

## Configuration Location

`FH.ToDo.Core.EF/Configurations/{Entity}Configuration.cs`

## Template

```csharp
using FH.ToDo.Core.Entities.{Domain};
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FH.ToDo.Core.EF.Configurations;

public class {Entity}Configuration : IEntityTypeConfiguration<{Entity}>
{
    public void Configure(EntityTypeBuilder<{Entity}> builder)
    {
        // Configuration here
    }
}
```

## Indexes

### Single Column Index
```csharp
builder.HasIndex(e => e.Email)
    .HasDatabaseName("IX_Users_Email");
```

### Unique Index
```csharp
builder.HasIndex(e => e.Email)
    .IsUnique()
    .HasDatabaseName("IX_Users_Email");
```

### Composite Index
```csharp
builder.HasIndex(e => new { e.FirstName, e.LastName })
    .HasDatabaseName("IX_Users_FullName");
```

### Covering Index (Include columns)
```csharp
builder.HasIndex(e => e.Email)
    .IsUnique()
    .IncludeProperties(e => new { e.FirstName, e.LastName })
    .HasDatabaseName("IX_Users_Email_Covering");
```

## SQL Defaults

### DateTime Default
```csharp
builder.Property(e => e.CreatedDate)
    .HasDefaultValueSql("GETUTCDATE()");
```

### Boolean Default
```csharp
builder.Property(e => e.IsActive)
    .HasDefaultValue(true);

builder.Property(e => e.IsDeleted)
    .HasDefaultValue(false);
```

### String Default
```csharp
builder.Property(e => e.Status)
    .HasDefaultValue("Pending");
```

## Relationships

### One-to-Many
```csharp
builder.HasOne(t => t.User)
    .WithMany(u => u.Tasks)
    .HasForeignKey(t => t.UserId)
    .OnDelete(DeleteBehavior.Restrict);
```

### Many-to-Many (via join entity)
```csharp
builder.HasOne(tt => tt.Task)
    .WithMany(t => t.TaskTags)
    .HasForeignKey(tt => tt.TaskId);

builder.HasOne(tt => tt.Tag)
    .WithMany(t => t.TaskTags)
    .HasForeignKey(tt => tt.TagId);
```

## Precision

### Decimal
```csharp
builder.Property(e => e.Price)
    .HasPrecision(18, 2);
```

### DateTime
```csharp
builder.Property(e => e.CreatedDate)
    .HasPrecision(3);  // Milliseconds
```

## Query Filters

### Soft Delete Filter
```csharp
builder.HasQueryFilter(e => !e.IsDeleted);
```

### Tenant Filter
```csharp
builder.HasQueryFilter(e => e.TenantId == _currentTenant.Id);
```

### Combined Filters
```csharp
builder.HasQueryFilter(e => !e.IsDeleted && e.IsActive);
```

## Value Conversions

### Enum to String
```csharp
builder.Property(e => e.Status)
    .HasConversion<string>();
```

### JSON Column
```csharp
builder.Property(e => e.Metadata)
    .HasColumnType("nvarchar(max)")
    .HasConversion(
        v => JsonSerializer.Serialize(v, null),
        v => JsonSerializer.Deserialize<Dictionary<string, string>>(v, null));
```

## Complete Example

```csharp
public class ToDoTaskConfiguration : IEntityTypeConfiguration<ToDoTask>
{
    public void Configure(EntityTypeBuilder<ToDoTask> builder)
    {
        // Primary Key (inherited from BaseEntity)
        builder.HasKey(t => t.Id);

        // Indexes
        builder.HasIndex(t => t.UserId)
            .HasDatabaseName("IX_Tasks_UserId");

        builder.HasIndex(t => t.DueDate)
            .HasDatabaseName("IX_Tasks_DueDate");

        builder.HasIndex(t => t.IsCompleted)
            .HasDatabaseName("IX_Tasks_IsCompleted");

        builder.HasIndex(t => t.IsDeleted)
            .HasDatabaseName("IX_Tasks_IsDeleted");

        // Relationships
        builder.HasOne(t => t.User)
            .WithMany()
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // SQL Defaults
        builder.Property(t => t.CreatedDate)
            .HasDefaultValueSql("GETUTCDATE()");

        builder.Property(t => t.IsCompleted)
            .HasDefaultValue(false);

        builder.Property(t => t.IsDeleted)
            .HasDefaultValue(false);

        // Query Filter (soft delete)
        builder.HasQueryFilter(t => !t.IsDeleted);
    }
}
```

## Registration

Configurations are auto-discovered via:

```csharp
// In ToDoDbContext.OnModelCreating
modelBuilder.ApplyConfigurationsFromAssembly(
    typeof(UserConfiguration).Assembly);
```

## Best Practices

✅ **DO**:
- Create one configuration class per entity
- Use descriptive index names
- Set SQL defaults for audit dates
- Implement query filters for soft delete
- Use Restrict for critical relationships

❌ **DON'T**:
- Put configuration in entity class
- Forget to create indexes for foreign keys
- Use Cascade delete without careful consideration
- Duplicate index definitions
