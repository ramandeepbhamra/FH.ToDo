# FH.ToDo.Core.EF - Entity Framework Core Class Library

## 📋 Overview
This **class library** serves as the **single source of truth** for database schema management in the FH.ToDo application. It is designed to be referenced by other projects (Web API, Console apps, etc.) and follows clean architecture principles with Entity Framework Core best practices.

> ⚠️ **Note**: This is a **class library**, not an executable. It's consumed by other projects like `FH.ToDo.Web.Host`.

## 🏗️ Architecture

### Project Structure
```
FH.ToDo.Core.EF/  (Class Library)
├── Entities/              # Domain entities
│   ├── Base/             # Base classes and interfaces
│   └── User.cs           # User entity
├── Configurations/        # Fluent API configurations
│   └── UserConfiguration.cs
├── Context/              # DbContext
│   └── ToDoDbContext.cs
├── Factories/            # Design-time factories
│   └── ToDoDbContextFactory.cs
├── Migrations/           # EF Core migrations (generated)
├── appsettings.json      # Configuration files (for migrations)
└── README.md
```

## 🎯 Domain Model

### Current Entities
- **User**: Represents system users with email, name, phone, and active status

### Key Features
✅ **Soft Delete**: All entities support soft delete via `ISoftDeletable`  
✅ **Audit Tracking**: Automatic tracking of Created/Modified dates and users  
✅ **Query Filters**: Global query filters exclude soft-deleted records  
✅ **Optimized Indexes**: Strategic indexes for common query patterns  
✅ **Scalable Base**: Ready to add more entities (ToDo items, categories, tags, etc.)  

## 🚀 Getting Started

### Prerequisites
- .NET 10 SDK
- SQL Server or SQL Server LocalDB
- Entity Framework Core Tools

### Install EF Core Tools
```bash
dotnet tool install --global dotnet-ef
# or update if already installed
dotnet tool update --global dotnet-ef
```

### Initial Setup

1. **Configure Connection String**
   - Update `appsettings.json` with your SQL Server connection string
   - For development, you can use LocalDB (default configuration)

2. **Create Initial Migration**
   ```bash
   dotnet ef migrations add InitialCreate
   ```

3. **Create/Update Database**
   ```bash
   dotnet ef database update
   ```

## 📝 Migration Commands

> 💡 All `dotnet ef` commands should be run from the **FH.ToDo.Core.EF** directory or use `--project` parameter

### Create a New Migration
```bash
dotnet ef migrations add <MigrationName>
```
Example:
```bash
dotnet ef migrations add AddToDoItemPriority
```

### Apply Migrations to Database
```bash
# Update to latest migration
dotnet ef database update

# Update to specific migration
dotnet ef database update <MigrationName>

# Rollback all migrations
dotnet ef database update 0
```

### Remove Last Migration
```bash
# Remove migration that hasn't been applied
dotnet ef migrations remove
```

### List All Migrations
```bash
dotnet ef migrations list
```

### Generate SQL Script
```bash
# Generate script for all migrations
dotnet ef migrations script

# Generate script from specific migration
dotnet ef migrations script <FromMigration> <ToMigration>

# Generate idempotent script (safe to run multiple times)
dotnet ef migrations script --idempotent
```

## 🔧 Configuration

### Connection Strings
- **Development**: `appsettings.Development.json` → Database: `FHToDoDb_Dev`
- **Production**: `appsettings.json` → Database: `FHToDoDb`

### Environment Variables
Set `ASPNETCORE_ENVIRONMENT` to control which configuration file is used:
```bash
# Windows (PowerShell)
$env:ASPNETCORE_ENVIRONMENT = "Development"

# Linux/Mac
export ASPNETCORE_ENVIRONMENT=Development
```

## 🎨 Design Principles

### 1. Separation of Concerns
- Entities define domain models
- Configurations define database mappings (Fluent API)
- Migrations track schema changes

### 2. Convention over Configuration
- Properties follow naming conventions
- Navigation properties use `virtual` for lazy loading
- Primary keys named `Id` (auto-detected by EF Core)

### 3. Explicit Configuration
- All relationships explicitly configured
- Delete behaviors specified
- Indexes created for performance
- String lengths defined

### 4. Audit Trail
- `IAuditableEntity` interface for tracking
- Automatic population via `SaveChanges` override
- User context should be set by application layer

### 5. Soft Delete
- `ISoftDeletable` interface implementation
- Global query filters prevent accidental queries
- Preserves data for auditing/recovery

## 📊 Database Schema Highlights

### Current Schema: Users Table
The database currently contains a single `Users` table with the following features:

### Indexes Strategy
- **Unique Index**: Email (ensures no duplicate emails)
- **Composite Index**: FirstName + LastName (for name searches)
- **Filter Index**: IsDeleted (for soft delete queries)

### Data Integrity
- Required fields enforced (Email, FirstName, LastName)
- String length limits (Email: 256, Names: 100, Phone: 20)
- Default values (IsActive: true, IsDeleted: false, CreatedDate: GETUTCDATE())
- Unique constraint on Email

### Audit & Soft Delete
- **CreatedDate**: Automatically set when record is created
- **CreatedBy**: User who created the record (set by application)
- **ModifiedDate**: Automatically updated when record changes
- **ModifiedBy**: User who modified the record (set by application)
- **IsDeleted**: Soft delete flag (with query filter)
- **DeletedDate/DeletedBy**: Tracks deletion information

## 🔒 Best Practices Implemented

✅ Use Fluent API for complex configurations  
✅ Separate configuration classes (`IEntityTypeConfiguration`)  
✅ Query filters for soft delete  
✅ Automatic audit field population  
✅ Connection resiliency (retry on failure)  
✅ Command timeout configuration  
✅ Design-time factory for migrations  
✅ Environment-specific configurations  
✅ Proper navigation property conventions  
✅ Strategic index placement  

## 🚨 Common Issues & Solutions

### Issue: "Build failed" during migration
**Solution**: Ensure project builds successfully before running EF commands:
```bash
dotnet build
dotnet ef migrations add <MigrationName>
```

### Issue: "No DbContext found"
**Solution**: Ensure `ToDoDbContextFactory` is properly configured and `appsettings.json` exists.

### Issue: Connection string not found
**Solution**: Verify `appsettings.json` contains `ConnectionStrings:DefaultConnection`.

### Issue: Migration already applied
**Solution**: Use `dotnet ef migrations remove` to remove unapplied migration, or create a new migration.

## 🔄 Integration with Other Projects

This is a **class library** meant to be referenced by other projects. Here's how to use it:

### In FH.ToDo.Web.Host (or other projects):

1. **Add Project Reference**:
   ```xml
   <ItemGroup>
     <ProjectReference Include="..\FH.ToDo.Core.EF\FH.ToDo.Core.EF.csproj" />
   </ItemGroup>
   ```

2. **Register DbContext in DI Container** (in `Program.cs` or `Startup.cs`):
   ```csharp
   builder.Services.AddDbContext<ToDoDbContext>(options =>
       options.UseSqlServer(
           builder.Configuration.GetConnectionString("DefaultConnection"),
           sqlOptions =>
           {
               sqlOptions.EnableRetryOnFailure(
                   maxRetryCount: 5,
                   maxRetryDelay: TimeSpan.FromSeconds(30),
                   errorNumbersToAdd: null);
               sqlOptions.CommandTimeout(60);
           }));
   ```

3. **Add Connection String to appsettings.json**:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=FHToDoDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
     }
   }
   ```

4. **Inject in Controllers/Services**:
   ```csharp
   public class UserController : ControllerBase
   {
       private readonly ToDoDbContext _context;

       public UserController(ToDoDbContext context)
       {
           _context = context;
       }

       [HttpGet]
       public async Task<ActionResult<List<User>>> GetUsers()
       {
           return await _context.Users.ToListAsync();
       }
   }
   ```

### Running Migrations from Web.Host

If you want to run migrations from your Web API project:

```bash
# From solution root
dotnet ef database update --project FH.ToDo.Core.EF --startup-project FH.ToDo.Web.Host

# Create migration
dotnet ef migrations add MigrationName --project FH.ToDo.Core.EF --startup-project FH.ToDo.Web.Host
```

## 📚 Additional Resources

- [EF Core Documentation](https://docs.microsoft.com/ef/core/)
- [EF Core Migrations](https://docs.microsoft.com/ef/core/managing-schemas/migrations/)
- [Fluent API](https://docs.microsoft.com/ef/core/modeling/)

## 🤝 Contributing

When adding new entities or modifying schema:
1. Create/modify entity class in `Entities/`
2. Create/modify configuration in `Configurations/`
3. Add DbSet to `ToDoDbContext` for new entities
4. Create migration: `dotnet ef migrations add <Description>`
5. Review generated migration for correctness
6. Test migration: `dotnet ef database update`
7. Update this README if needed

### Next Steps: Expanding the Domain
When you're ready to add more entities (e.g., ToDoItem, Category, Tag):
1. Define entity in `Entities/` folder
2. Create configuration in `Configurations/` folder
3. Add DbSet to `ToDoDbContext`
4. Configure relationships in entity configurations
5. Create and apply migration

---

**Maintained by**: FunctionHealth Team  
**Technology**: Entity Framework Core 10, SQL Server  
**Architecture**: Code-First, Clean Architecture  
