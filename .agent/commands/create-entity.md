# Create Entity

Create a new domain entity in FH.ToDo following Clean Architecture patterns.

## Usage

`/create-entity {EntityName} in {Domain}`

**Examples**:
- `/create-entity Task in Tasks`
- `/create-entity Category in Categories`
- `/create-entity Tag in Tags`

## What It Does

1. **Creates entity class** in `FH.ToDo.Core/Entities/{Domain}/{EntityName}.cs`
2. **Creates configuration** in `FH.ToDo.Core.EF/Configurations/{EntityName}Configuration.cs`
3. **Adds DbSet** to `ToDoDbContext.cs`
4. **Creates migration**: `dotnet ef migrations add Add{EntityName}Entity`
5. **Builds** to verify compilation

## Workflow

1. Ask for entity properties (name:type pairs)
2. Create entity class inheriting from `BaseEntity`
3. Add Data Annotations for validation
4. Create Fluent API configuration class
5. Configure indexes, relationships, SQL defaults
6. Add DbSet to ToDoDbContext
7. Generate EF Core migration
8. Build solution to verify

## Entity Template

```csharp
using FH.ToDo.Core.Entities.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FH.ToDo.Core.Entities.{Domain};

[Table("{TableName}")]
public class {EntityName} : BaseEntity
{
    [Required]
    [MaxLength({Length})]
    public string {PropertyName} { get; set; } = string.Empty;

    // Additional properties...
}
```

## Configuration Template

```csharp
using FH.ToDo.Core.Entities.{Domain};
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FH.ToDo.Core.EF.Configurations;

public class {EntityName}Configuration : IEntityTypeConfiguration<{EntityName}>
{
    public void Configure(EntityTypeBuilder<{EntityName}> builder)
    {
        // Indexes
        builder.HasIndex(e => e.{PropertyName});

        // Query Filter (soft delete)
        builder.HasQueryFilter(e => !e.IsDeleted);
    }
}
```

## Property Types

| Type | Validation | Notes |
|------|-----------|-------|
| `string` | `[Required]`, `[MaxLength(n)]` | Always set max length |
| `string?` | `[MaxLength(n)]` | Optional string |
| `int` | `[Required]` | |
| `DateTime?` | - | Optional date |
| `Guid` | `[Required]` | For foreign keys |
| `bool` | `[Required]` | Set SQL default in config |
| Enum | `[Required]` | From FH.ToDo.Core.Shared |

## Validation Attributes

- `[Required]` - Not null
- `[MaxLength(n)]` - String length (use constants!)
- `[EmailAddress]` - Email format
- `[Phone]` - Phone format
- `[Range(min, max)]` - Numeric range
- `[RegularExpression]` - Pattern matching

## Next Steps

After entity creation:
1. Run `/add-migration Add{EntityName}Entity`
2. Run `/apply-migration`
3. Run `/create-mapping` to generate DTOs and AutoMapper profile
4. Optionally run `/generate-crud` for complete service + controller

## Example

```
User: /create-entity Task in Tasks

Agent: I'll create a Task entity. What properties do you need?

User: Title (string, required), Description (string, optional), DueDate (DateTime, optional), UserId (Guid, required), IsCompleted (bool)

Agent: Creating entity with the following structure:
- Title: string, required, max 200
- Description: string?, optional, max 2000
- DueDate: DateTime?, optional
- UserId: Guid, required (FK to Users)
- IsCompleted: bool, required, default false

[Creates files and migration]

Done! Next steps:
1. Apply migration: /apply-migration
2. Create mapping: /create-mapping Task
```
