---
name: fh-entity-patterns
description: "Entity creation patterns for FH.ToDo Clean Architecture with BaseEntity, validation attributes, and domain organization"
---

# FH.ToDo Entity Patterns

## Entity Location

`FH.ToDo.Core/Entities/{Domain}/{EntityName}.cs`

**Examples**:
- `FH.ToDo.Core/Entities/Users/User.cs`
- `FH.ToDo.Core/Entities/Tasks/ToDoTask.cs`
- `FH.ToDo.Core/Entities/Categories/Category.cs`

## Base Entity

**ALL entities MUST inherit from BaseEntity**:

```csharp
using FH.ToDo.Core.Entities.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FH.ToDo.Core.Entities.{Domain};

[Table("{TableName}")]
public class {EntityName} : BaseEntity
{
    // Properties with validation attributes
}
```

## BaseEntity Provides

```csharp
public abstract class BaseEntity
{
    public Guid Id { get; set; }
    public DateTime CreatedDate { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? ModifiedDate { get; set; }
    public string? ModifiedBy { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedDate { get; set; }
    public string? DeletedBy { get; set; }
}
```

**Benefits**:
- ✅ Automatic audit tracking
- ✅ Soft delete built-in
- ✅ Consistent primary key (Guid)
- ✅ No need to define these properties in every entity

## Validation Attributes

### Required Fields
```csharp
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
