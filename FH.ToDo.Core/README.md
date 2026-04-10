# FH.ToDo.Core - Domain Layer

## 📋 Overview
This is the **Core Domain Layer** of the FH.ToDo application. It contains domain entities, business logic, and core interfaces following **Clean Architecture** principles.

> **Key Principle**: This layer has **no dependencies** on infrastructure or external frameworks. It represents the heart of the application's business logic.

---

## 🏗️ Architecture

### Clean Architecture Layers
```
FH.ToDo.Core (Domain - YOU ARE HERE)
    ↑
    Dependencies flow INWARD only
    
External layers depend on Core, NOT vice versa
```

### Project Structure
```
FH.ToDo.Core/
├── Entities/
│   ├── Base/
│   │   ├── IEntity.cs                # Generic entity interface
│   │   ├── IAuditableEntity.cs       # Audit tracking interface
│   │   ├── ISoftDeletable.cs         # Soft delete interface
│   │   └── BaseEntity.cs             # Base entity with GUID + audit + soft delete
│   └── Users/
│       └── User.cs                   # User domain entity
└── README.md
```

---

## 🎯 Domain Entities

### BaseEntity
All domain entities inherit from `BaseEntity`, which provides:
- ✅ **Primary Key**: `Guid Id`
- ✅ **Audit Tracking**: CreatedDate, CreatedBy, ModifiedDate, ModifiedBy
- ✅ **Soft Delete**: IsDeleted, DeletedDate, DeletedBy

### User Entity
Represents a user in the system with validation attributes.

**Location**: `Entities/Users/User.cs`

**Properties**:
- `Email` - Required, max 256 chars, validated with `[EmailAddress]`
- `FirstName` - Required, max 100 chars
- `LastName` - Required, max 100 chars
- `PhoneNumber` - Optional, max 20 chars, validated with `[Phone]`
- `IsActive` - Boolean, default true
- Plus all BaseEntity properties (Id, audit fields, soft delete)

**Validation Attributes**:
```csharp
[Required]
[MaxLength(256)]
[EmailAddress]
public string Email { get; set; } = string.Empty;
```

---

## 🔧 Design Decisions

### Hybrid Approach: Annotations + Fluent API

**Why?**
- **Annotations** (in entities): Provide validation at application layer, work with DTOs via AutoMapper
- **Fluent API** (in FH.ToDo.Core.EF): Database-specific features (indexes, SQL defaults, relationships)

This separation keeps domain entities clean while allowing full database control.

### Table Mapping
```csharp
[Table("Users")]
public class User : BaseEntity
```

Table names defined via attributes, but can be overridden by Fluent API in infrastructure layer.

---

## 📦 Dependencies

**NuGet Packages**: NONE (intentionally)

**Project References**: NONE (intentionally)

This layer is **dependency-free** to ensure:
- ✅ Maximum portability
- ✅ Easy unit testing
- ✅ No coupling to infrastructure
- ✅ Framework-agnostic

**Only uses**:
- System.ComponentModel.DataAnnotations (part of .NET runtime)

---

## 🚀 Usage

### Creating a User Entity
```csharp
var user = new User
{
    Id = Guid.NewGuid(),
    Email = "john.doe@example.com",
    FirstName = "John",
    LastName = "Doe",
    PhoneNumber = "555-1234",
    IsActive = true
};
```

### Validation
Validation attributes are automatically enforced by:
- ASP.NET Core Model Validation
- AutoMapper (when mapping from DTOs)
- EF Core (when saving to database)

---

## 🎓 Best Practices Implemented

### 1. Domain-Driven Design (DDD)
- Entities represent real-world domain concepts
- Rich domain models with behavior (can be extended)
- Separation from infrastructure concerns

### 2. SOLID Principles
- **S**ingle Responsibility: Each entity has one clear purpose
- **O**pen/Closed: BaseEntity allows extension without modification
- **L**iskov Substitution: All entities can be used as BaseEntity
- **I**nterface Segregation: Separate interfaces for audit/soft delete
- **D**ependency Inversion: Core doesn't depend on infrastructure

### 3. Constants for Magic Numbers
```csharp
public const int MaxEmailAddressLength = 256;

[MaxLength(MaxEmailAddressLength)]
public string Email { get; set; }
```

Benefits:
- ✅ Single source of truth
- ✅ Easy to update
- ✅ Can be referenced by DTOs and validators

---

## 🔄 Extending the Domain

### Adding a New Entity

1. **Create entity class**:
```csharp
namespace FH.ToDo.Core.Entities.Tasks;

[Table("Tasks")]
public class ToDoTask : BaseEntity
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    public Guid UserId { get; set; }
}
```

2. **No other changes needed in Core!**
   - Configuration goes in `FH.ToDo.Core.EF`
   - DTOs go in separate project
   - Controllers use the entity

---

## 📚 Related Projects

- **FH.ToDo.Core.EF** - Infrastructure layer with EF Core configurations
- **FH.ToDo.Core.Shared** - Shared enums and constants
- **FH.ToDo.Web.Host** - Web API that uses these entities

---

## ✅ Key Features

- ✅ **Clean Architecture** - Pure domain layer
- ✅ **Validation Attributes** - Self-documenting, reusable
- ✅ **Base Entity** - Audit tracking + soft delete out of the box
- ✅ **No Dependencies** - Maximum flexibility and testability
- ✅ **Production-Ready** - Following Microsoft best practices

---

**Version**: 1.0  
**Target Framework**: .NET 10  
**Architecture**: Clean Architecture / DDD
