---
name: fh-entity-patterns
description: "Entity creation patterns for FH.ToDo Clean Architecture with BaseEntity<T>, validation attributes, and domain organization"
---

# FH.ToDo Entity Patterns

## Entity Location

`FH.ToDo.Core/Entities/{Domain}/{EntityName}.cs`

**Examples**:
- `FH.ToDo.Core/Entities/Users/User.cs`
- `FH.ToDo.Core/Entities/Tasks/TodoTask.cs`

## Base Entity

**ALL entities MUST inherit from `BaseEntity<Guid>`**:

```csharp
using FH.ToDo.Core.Entities.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FH.ToDo.Core.Entities.{Domain};

[Table("{TableName}")]
public class {EntityName} : BaseEntity<Guid>
{
    // Scalar properties with validation attributes
    // Navigation properties with virtual keyword
}
```

## BaseEntity\<T\> Provides

```csharp
public abstract class BaseEntity<T>
{
    public T Id { get; set; }

    // Audit fields
    public DateTime CreatedDate { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? ModifiedDate { get; set; }
    public string? ModifiedBy { get; set; }

    // Soft delete
    public bool IsDeleted { get; set; }
    public DateTime? DeletedDate { get; set; }
    public string? DeletedBy { get; set; }
}
```

Concrete entities use `BaseEntity<Guid>` unless a different key type is explicitly required.

## `virtual` Rule — Navigation Properties ONLY

`virtual` enables EF Core lazy loading proxies. It must be used on navigation properties and **never** on scalar properties.

```csharp
// ✅ Correct — navigation property
public virtual User User { get; set; } = null!;
public virtual ICollection<SubTask> SubTasks { get; set; } = [];

// ❌ Wrong — scalars are never virtual
public virtual string Title { get; set; } = string.Empty;
public virtual bool IsCompleted { get; set; }
public virtual DateTime? DueDate { get; set; }
public virtual Guid UserId { get; set; }  // FK scalar — never virtual
```

## Validation Attributes

Use data annotations for all schema-affecting constraints. EF Core reads these automatically — **do not repeat them in Fluent API**.

### Required scalar
```csharp
[Required]
[MaxLength(200)]
public string Title { get; set; } = string.Empty;
```

### Optional scalar
```csharp
[MaxLength(20)]
[Phone]
public string? PhoneNumber { get; set; }
```

### Email
```csharp
[Required]
[MaxLength(256)]
[EmailAddress]
public string Email { get; set; } = string.Empty;
```

### FK column (scalar — NOT virtual)
```csharp
public Guid UserId { get; set; }          // FK — scalar, not virtual
public virtual User User { get; set; } = null!;  // navigation — virtual ✅
```

## Full Entity Example

```csharp
[Table("TodoTasks")]
public class TodoTask : BaseEntity<Guid>
{
    [Required]
    [MaxLength(500)]
    public string Title { get; set; } = string.Empty;

    public bool IsCompleted { get; set; }
    public bool IsFavourite { get; set; }
    public DateTime? DueDate { get; set; }
    public int Order { get; set; }

    // FK scalar — not virtual
    public Guid ListId { get; set; }
    public Guid UserId { get; set; }

    // Navigation — virtual ✅
    public virtual TaskList List { get; set; } = null!;
    public virtual User User { get; set; } = null!;
    public virtual ICollection<SubTask> SubTasks { get; set; } = [];
}
```

## One Type Per File

Every entity, interface, enum, and DTO lives in its own `.cs` file. No nested types unless using C# `partial` classes.
[Required]
public string Title { get; set; } = string.Empty;
```

### String Length
```csharp
public const int MaxTitleLength = 200;

[Required]
[MaxLength(MaxTitleLength)]
public string Title { get; set; } = string.Empty;
```

### Optional Fields
```csharp
[MaxLength(2000)]
public string? Description { get; set; }
```

### Email
```csharp
[Required]
[MaxLength(256)]
[EmailAddress]
public string Email { get; set; } = string.Empty;
```

### Phone
```csharp
[MaxLength(20)]
[Phone]
public string? PhoneNumber { get; set; }
```

### Numeric Ranges
```csharp
[Range(0, 100)]
public int Priority { get; set; }
```

## Table Naming

```csharp
[Table("Users")]    // Plural
public class User : BaseEntity
```

Table names should be **plural** (Users, Tasks, Categories).

## Navigation Properties

### Many-to-One
```csharp
[Required]
public Guid UserId { get; set; }

public virtual User User { get; set; } = null!;
```

### One-to-Many
```csharp
public virtual ICollection<ToDoTask> Tasks { get; set; } = new List<ToDoTask>();
```

### Many-to-Many
```csharp
public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();
```

## Complete Example

```csharp
using FH.ToDo.Core.Entities.Base;
using FH.ToDo.Core.Entities.Users;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FH.ToDo.Core.Entities.Tasks;

[Table("Tasks")]
public class ToDoTask : BaseEntity
{
    public const int MaxTitleLength = 200;
    public const int MaxDescriptionLength = 2000;

    [Required]
    [MaxLength(MaxTitleLength)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(MaxDescriptionLength)]
    public string? Description { get; set; }

    public DateTime? DueDate { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [Required]
    public bool IsCompleted { get; set; } = false;

    // Navigation properties
    public virtual User User { get; set; } = null!;
}
```

## Don'ts

❌ **Don't** add database configuration in entity:
```csharp
// BAD - Don't do this
[Index(nameof(Email), IsUnique = true)]
public class User : BaseEntity
```

❌ **Don't** put business logic in entities:
```csharp
// BAD - Keep entities anemic
public void CompleteTask()
{
    this.IsCompleted = true;
    this.CompletedDate = DateTime.Now;
}
```

❌ **Don't** use primitive types for IDs:
```csharp
// BAD - BaseEntity already provides Guid Id
public int UserId { get; set; }
```

## Next Steps

After creating entity:
1. Create Fluent API configuration
2. Add DbSet to ToDoDbContext
3. Generate migration
4. Create DTOs and AutoMapper profile
