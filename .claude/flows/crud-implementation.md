# CRUD Implementation Flow

Complete workflow for implementing a new entity with full CRUD operations in FH.ToDo.

## Steps

### 1. Create Entity
**Location**: `FH.ToDo.Core/Entities/{Domain}/{Entity}.cs`
- Inherit from `BaseEntity`
- Add Data Annotations for validation
- Use constants for string lengths

### 2. Create Configuration
**Location**: `FH.ToDo.Core.EF/Configurations/{Entity}Configuration.cs`
- Implement `IEntityTypeConfiguration<>`
- Define indexes
- Configure relationships
- Add SQL defaults
- Add query filter for soft delete

### 3. Add DbSet
**Location**: `FH.ToDo.Core.EF/Context/ToDoDbContext.cs`
```csharp
public DbSet<{Entity}> {Entities} => Set<{Entity}>();
```

### 4. Generate Migration
```bash
cd FH.ToDo.Core.EF
dotnet ef migrations add Add{Entity}Entity
```

### 5. Apply Migration
```bash
dotnet ef database update
```

### 6. Create DTOs
**Location**: `FH.ToDo.Services.Core/{Domain}/Dto/`
- `Create{Entity}Dto` (record)
- `Update{Entity}Dto` (record)
- `{Entity}ListDto` (class)
- `{Entity}DetailDto` (class)

### 7. Create AutoMapper Profile
**Location**: `FH.ToDo.Services/Mappers/{Entity}MappingProfile.cs`
- Map entity to output DTOs
- Map input DTOs to entity (ignore audit fields)

### 8. Create Service Interface
**Location**: `FH.ToDo.Services.Core/{Domain}/I{Entity}Service.cs`
- Define CRUD methods

### 9. Create Service Implementation
**Location**: `FH.ToDo.Services/{Domain}/{Entity}Service.cs`
- Implement interface
- Use DbContext and IMapper
- Handle business logic

### 10. Create Controller
**Location**: `FH.ToDo.Web.Host/Controllers/{Entity}Controller.cs`
- Inherit from `ApiControllerBase`
- Add `[Authorize]`
- Implement CRUD endpoints
- Return Success/Created/BadRequest

### 11. Register Service
**Location**: `FH.ToDo.Web.Host/Program.cs`
```csharp
builder.Services.AddScoped<I{Entity}Service, {Entity}Service>();
```

### 12. Build & Test
```bash
dotnet build
# Test via Swagger
```

## Result

Complete CRUD API:
- `GET /api/{entities}` - List with paging
- `GET /api/{entities}/{id}` - Get single
- `POST /api/{entities}` - Create
- `PUT /api/{entities}/{id}` - Update
- `DELETE /api/{entities}/{id}` - Soft delete
