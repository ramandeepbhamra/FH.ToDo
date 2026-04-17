# Entity Creation Standards

## File Naming

- **Entity**: `{EntityName}.cs` (e.g., `ToDoTask.cs`)
- **Configuration**: `{EntityName}Configuration.cs`
- **Location**: Domain-organized folders

## Entity Template

```csharp
using FH.ToDo.Core.Entities.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Table;

namespace FH.ToDo.Core.Entities.{Domain};

[Table("{TableName}")]
public class {EntityName} : BaseEntity
{
    // Constants for max lengths
    public const int Max{Property}Length = {Value};

    // Properties with validation
    [Required]
    [MaxLength(Max{Property}Length)]
    public string {Property} { get; set; } = string.Empty;
}
```

## Required Elements

1. **Inherit BaseEntity** - Provides Id, audit fields, soft delete
2. **Table attribute** - `[Table("TableName")]` with plural name
3. **Constants** - Define max lengths as constants
4. **Validation** - Use Data Annotations
5. **Defaults** - Initialize strings to `string.Empty`

## Validation Attributes

| Attribute | Use Case |
|-----------|----------|
| `[Required]` | Not null fields |
| `[MaxLength(n)]` | String length limit |
| `[EmailAddress]` | Email validation |
| `[Phone]` | Phone validation |
| `[Range(min, max)]` | Numeric range |

## Example

```csharp
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

    public bool IsCompleted { get; set; } = false;

    // Navigation
    public virtual User User { get; set; } = null!;
}
```
