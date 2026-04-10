# FH.ToDo.Core.EF - Entity Framework Core Infrastructure

## 📋 Overview
This is the **Infrastructure Layer** for Entity Framework Core. It contains DbContext, entity configurations (Fluent API), and database migrations. This project serves as the **single source of truth** for database schema.

> **Key Principle**: Infrastructure depends on Domain, never the reverse. This project references `FH.ToDo.Core` but Core does NOT reference this.

---

## 🏗️ Architecture

### Clean Architecture Position
```
FH.ToDo.Web.Host (Presentation)
    ↓ references
FH.ToDo.Core (Domain) ← Pure, no dependencies
    ↑ referenced by
FH.ToDo.Core.EF (Infrastructure - YOU ARE HERE)
```

### Project Structure
```
FH.ToDo.Core.EF/
├── Configurations/
│   └── UserConfiguration.cs       # Fluent API for User entity
├── Context/
│   └── ToDoDbContext.cs          # Main DbContext
├── Factories/
│   └── ToDoDbContextFactory.cs   # Design-time factory for migrations
├── Migrations/
│   ├── 20260410013210_AddingUserEntity.cs
│   ├── 20260410013210_AddingUserEntity.Designer.cs
│   └── ToDoDbContextModelSnapshot.cs
├── appsettings.json              # Connection strings for migrations
├── appsettings.Development.json
├── FH.ToDo.Core.EF.csproj
└── README.md
```

---

## 🎯 Key Components

### 1. ToDoDbContext
**Location**: `Context/ToDoDbContext.cs`

Main database context with:
- ✅ **DbSets** for all entities
- ✅ **Automatic audit tracking** via SaveChanges override
- ✅ **Automatic soft delete** handling
- ✅ **Configuration discovery** via assembly scanning

**Features**:
```csharp
// Automatically sets CreatedDate, ModifiedDate
public override async Task<int> SaveChangesAsync(...)
{
    SetAuditFields();
    return await base.SaveChangesAsync(...);
}

// Converts DELETE into UPDATE (soft delete)
// Sets IsDeleted = true, DeletedDate = now
```

---

### 2. Entity Configurations (Fluent API)

**Purpose**: Define database-specific features that annotations can't handle.

**What's Configured**:
- ✅ **Indexes** (unique, composite)
- ✅ **SQL defaults** (`GETUTCDATE()`)
- ✅ **Query filters** (soft delete)
- ✅ **Relationships** (foreign keys)

---

## 🗄️ Database Schema

### Users Table

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| **Id** | UNIQUEIDENTIFIER | PRIMARY KEY | NewGuid() |
| **Email** | NVARCHAR(256) | NOT NULL, UNIQUE | - |
| FirstName | NVARCHAR(100) | NOT NULL | - |
| LastName | NVARCHAR(100) | NOT NULL | - |
| PhoneNumber | NVARCHAR(20) | NULL | - |
| IsActive | BIT | NOT NULL | 1 |
| **CreatedDate** | DATETIME2 | NOT NULL | GETUTCDATE() |
| CreatedBy | NVARCHAR(256) | NULL | - |
| ModifiedDate | DATETIME2 | NULL | - |
| ModifiedBy | NVARCHAR(256) | NULL | - |
| **IsDeleted** | BIT | NOT NULL | 0 |
| DeletedDate | DATETIME2 | NULL | - |
| DeletedBy | NVARCHAR(256) | NULL | - |

### Indexes
- `IX_Users_Email` (UNIQUE) - Fast email lookups
- `IX_Users_FullName` (FirstName, LastName) - Fast name searches
- `IX_Users_IsDeleted` - Optimizes soft delete queries

---

## 🚀 Working with Migrations

### Create a Migration

**Using dotnet CLI** (Recommended):
```powershell
cd C:\Projects\FunctionHealth\FH.ToDo\FH.ToDo.Core.EF
dotnet ef migrations add <MigrationName>
```

**Using Package Manager Console**:
```powershell
# Set Default project: FH.ToDo.Core.EF
# Set Startup project: FH.ToDo.Web.Host
Add-Migration <MigrationName>
```

### Apply Migration to Database

```powershell
dotnet ef database update
```

### Rollback Migration
```powershell
dotnet ef database update <PreviousMigrationName>
```

### Remove Last Migration
```powershell
dotnet ef migrations remove
```

### List All Migrations
```powershell
dotnet ef migrations list
```

---

## 📦 Dependencies

### NuGet Packages
- Microsoft.EntityFrameworkCore (10.0.5)
- Microsoft.EntityFrameworkCore.SqlServer (10.0.5)
- Microsoft.EntityFrameworkCore.Design (10.0.5)
- Microsoft.EntityFrameworkCore.Tools (10.0.5)

### Project References
- FH.ToDo.Core

---

## 🛡️ Production Features

### Connection Resiliency
- Automatic retry on transient failures
- Configurable retry count and delay

### Audit Tracking
- `CreatedDate` set on insert
- `ModifiedDate` set on update
- Automatic via SaveChanges override

### Soft Delete
- DELETE converted to UPDATE
- `IsDeleted = true`
- Query filter excludes soft-deleted records

---

## 🔄 Adding a New Entity

1. **Create entity** in `FH.ToDo.Core`
2. **Create configuration** in `Configurations/`
3. **Add DbSet** to `ToDoDbContext`
4. **Create migration**: `dotnet ef migrations add AddNewEntity`
5. **Apply migration**: `dotnet ef database update`

---

## ✅ Summary

This project provides:
- ✅ Production-grade EF Core infrastructure
- ✅ Clean separation from domain layer
- ✅ Automatic audit tracking and soft delete
- ✅ Full database control via Fluent API
- ✅ DBA-grade design with proper indexes

**Version**: 1.0  
**Target Framework**: .NET 10  
**Database**: SQL Server
