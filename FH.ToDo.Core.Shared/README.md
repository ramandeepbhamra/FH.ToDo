# FH.ToDo.Core.Shared - Shared Library

## 📋 Overview
This is a **shared class library** containing common constants, enums, and helper classes that can be referenced by all other projects in the solution. It helps avoid code duplication and maintains consistency across the application.

---

## 🏗️ Architecture

### Purpose
```
FH.ToDo.Core.Shared
    ↑ referenced by
    ├── FH.ToDo.Core
    ├── FH.ToDo.Core.EF
    ├── FH.ToDo.Web.Host
    └── Any future projects
```

**Key Principle**: Contains only truly shared items with no dependencies on other projects.

---

## 🎯 What Goes Here

### ✅ Should Include:
- **Enums** - Status codes, priority levels, user roles, etc.
- **Constants** - Configuration keys, error codes, common values
- **Helper Classes** - String utilities, date formatters, validators
- **Extension Methods** - Reusable utility extensions
- **Shared DTOs** - Common data structures (if needed)

### ❌ Should NOT Include:
- Business logic (belongs in Core)
- Entity classes (belongs in Core)
- Database configurations (belongs in Core.EF)
- API-specific code (belongs in Web.Host)

---

## 📂 Proposed Structure

```
FH.ToDo.Core.Shared/
├── Constants/
│   ├── ConfigurationKeys.cs   # App configuration keys
│   ├── ErrorCodes.cs          # Standard error codes
│   └── ValidationMessages.cs  # Validation error messages
├── Enums/
│   ├── Priority.cs            # Task priority levels
│   ├── TaskStatus.cs          # Task status values
│   └── UserRole.cs            # User roles
├── Extensions/
│   ├── StringExtensions.cs    # String utility methods
│   └── DateTimeExtensions.cs  # Date utility methods
├── Helpers/
│   └── PasswordHelper.cs      # Password hashing utilities
└── README.md
```

---

## 💡 Example Content

### Enums
```csharp
namespace FH.ToDo.Core.Shared.Enums;

public enum Priority
{
    Low = 1,
    Medium = 2,
    High = 3,
    Critical = 4
}

public enum TaskStatus
{
    Pending = 1,
    InProgress = 2,
    Completed = 3,
    Cancelled = 4,
    OnHold = 5
}

public enum UserRole
{
    User = 1,
    Admin = 2,
    Manager = 3
}
```

### Constants
```csharp
namespace FH.ToDo.Core.Shared.Constants;

public static class ValidationMessages
{
    public const string EmailRequired = "Email address is required";
    public const string EmailInvalid = "Invalid email format";
    public const string PasswordTooShort = "Password must be at least 8 characters";
}

public static class ConfigurationKeys
{
    public const string JwtSecret = "Jwt:Secret";
    public const string JwtIssuer = "Jwt:Issuer";
    public const string ConnectionString = "ConnectionStrings:DefaultConnection";
}

public static class ErrorCodes
{
    public const string UserNotFound = "USER_NOT_FOUND";
    public const string InvalidCredentials = "INVALID_CREDENTIALS";
    public const string DuplicateEmail = "DUPLICATE_EMAIL";
}
```

### Extension Methods
```csharp
namespace FH.ToDo.Core.Shared.Extensions;

public static class StringExtensions
{
    public static bool IsValidEmail(this string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return false;

        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }

    public static string ToTitleCase(this string str)
    {
        if (string.IsNullOrWhiteSpace(str))
            return str;

        return System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(str.ToLower());
    }
}

public static class DateTimeExtensions
{
    public static bool IsToday(this DateTime date)
    {
        return date.Date == DateTime.Today;
    }

    public static bool IsOverdue(this DateTime? dueDate)
    {
        return dueDate.HasValue && dueDate.Value < DateTime.Now;
    }
}
```

---

## 📦 Dependencies

**NuGet Packages**: NONE (intentionally)

**Project References**: NONE (intentionally)

This library should remain **dependency-free** to:
- ✅ Be reusable across multiple projects
- ✅ Avoid coupling
- ✅ Keep it lightweight

---

## 🚀 Usage Examples

### Using Enums
```csharp
// In FH.ToDo.Core
using FH.ToDo.Core.Shared.Enums;

public class ToDoTask : BaseEntity
{
    public Priority Priority { get; set; } = Priority.Medium;
    public TaskStatus Status { get; set; } = TaskStatus.Pending;
}
```

### Using Constants
```csharp
// In FH.ToDo.Web.Host
using FH.ToDo.Core.Shared.Constants;

if (!user.Email.IsValidEmail())
{
    return BadRequest(ValidationMessages.EmailInvalid);
}
```

### Using Extensions
```csharp
// Anywhere in the solution
using FH.ToDo.Core.Shared.Extensions;

string name = "john doe".ToTitleCase(); // "John Doe"
bool overdue = task.DueDate.IsOverdue();
```

---

## 🎓 Best Practices

### 1. Keep It Simple
Only add truly shared items. Don't let this become a dumping ground.

### 2. No Business Logic
```csharp
// ❌ Bad: Business logic doesn't belong here
public static class TaskHelper
{
    public static void AssignTask(Task task, User user) { ... }
}

// ✅ Good: Simple utility
public static class DateHelper
{
    public static bool IsWeekend(DateTime date) { ... }
}
```

### 3. Use Descriptive Names
```csharp
// ❌ Bad
public const string Msg1 = "Error";

// ✅ Good
public const string UserNotFoundMessage = "User with specified ID was not found";
```

### 4. Document Public APIs
```csharp
/// <summary>
/// Determines whether the specified email is valid.
/// </summary>
/// <param name="email">The email address to validate.</param>
/// <returns>true if valid; otherwise, false.</returns>
public static bool IsValidEmail(this string email)
```

---

## 🔄 When to Add Items

### Add to Shared When:
- ✅ Used by 2+ projects
- ✅ Has no project-specific dependencies
- ✅ Truly generic/reusable
- ✅ Doesn't contain business logic

### Keep in Original Project When:
- ❌ Only used in one project
- ❌ Has dependencies on other projects
- ❌ Contains business logic
- ❌ Specific to one layer

---

## ✅ Summary

This project provides:
- ✅ Shared enums and constants
- ✅ Reusable utility methods
- ✅ No dependencies (maximum portability)
- ✅ Single source of truth for common values
- ✅ Avoids code duplication

**Version**: 1.0  
**Target Framework**: .NET 10  
**Purpose**: Shared utilities and constants
