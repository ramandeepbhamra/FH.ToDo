---
description: "Scaffold a new domain entity with Fluent API configuration, DbSet registration, and EF Core migration"
allowed-tools: Read, Write, Edit, Bash
argument-hint: "$ENTITY_NAME - Entity name in PascalCase (e.g., Task)"
---

# Generate Entity

## Usage

`/generate:entity $ARGUMENTS`

## What It Does

1. Creates entity in `FH.ToDo.Core/Entities/{Domain}/{Entity}.cs`
2. Creates configuration in `FH.ToDo.Core.EF/Configurations/{Entity}Configuration.cs`
3. Adds DbSet to `ToDoDbContext`
4. Generates migration
5. Builds to verify

## Workflow

1. Parse entity name and domain from arguments
2. Ask for properties (name:type pairs)
3. Create entity inheriting `BaseEntity` with validation attributes
4. Create Fluent API configuration with indexes/query filters
5. Add DbSet to DbContext
6. Generate migration: `dotnet ef migrations add Add{Entity}Entity`
7. Build: `dotnet build FH.ToDo.sln`

## Options

- `{EntityName}` - Required, PascalCase (e.g., Task, Category)
- `in {Domain}` - Domain folder (e.g., Tasks, Categories)
- `--properties "Name:string,Active:bool"` - Inline properties

## Property Types

| Shorthand | C# Type | Validation |
|-----------|---------|------------|
| `string` | `string` | `[Required]`, `[MaxLength]` |
| `string?` | `string?` | `[MaxLength]` |
| `int` | `int` | `[Required]` |
| `decimal` | `decimal` | `[Required]` |
| `bool` | `bool` | `[Required]` |
| `DateTime?` | `DateTime?` | Optional |
| `Guid` | `Guid` | `[Required]` - for FKs |

## Example

```
/generate:entity Task in Tasks

Agent: What properties?

User: Title (string, 200), Description (string, optional, 2000), DueDate (DateTime, optional), UserId (Guid), IsCompleted (bool)

Agent: Creating Task entity...
✅ Entity created with validation
✅ Configuration with indexes
✅ DbSet added
✅ Migration generated
```

## Next Steps

After entity creation:
1. `/generate:migration` to review migration SQL
2. `/generate:mapping` to create DTOs and AutoMapper
3. `/generate:crud` for full service + controller
