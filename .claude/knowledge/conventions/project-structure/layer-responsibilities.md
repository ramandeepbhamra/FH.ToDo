# FH.ToDo Project Structure

## Solution Organization

```
FH.ToDo.sln
├── FH.ToDo.Core/              # Domain layer
│   ├── Entities/
│   │   ├── Base/              # BaseEntity, interfaces
│   │   ├── Users/             # User domain
│   │   └── Tasks/             # Task domain (to be added)
│   └── FH.ToDo.Core.csproj
│
├── FH.ToDo.Core.EF/           # Infrastructure layer
│   ├── Configurations/        # Fluent API configurations
│   ├── Context/              # ToDoDbContext
│   ├── Factories/            # Design-time factory
│   ├── Migrations/           # EF Core migrations
│   └── FH.ToDo.Core.EF.csproj
│
├── FH.ToDo.Services.Core/     # Service contracts
│   └── {Domain}/
│       ├── I{Entity}Service.cs
│       └── Dto/
│           ├── Create{Entity}Dto.cs
│           ├── Update{Entity}Dto.cs
│           └── {Entity}ListDto.cs
│
├── FH.ToDo.Services/          # Service implementations
│   ├── {Domain}/
│   │   └── {Entity}Service.cs
│   ├── Mappers/
│   │   └── {Entity}MappingProfile.cs
│   └── FH.ToDo.Services.csproj
│
└── FH.ToDo.Web.Host/          # API presentation
    ├── Controllers/
    │   └── {Entity}Controller.cs
    ├── Program.cs
    └── FH.ToDo.Web.Host.csproj
```

## Layer Responsibilities

| Layer | Responsibility | Can Access |
|-------|---------------|------------|
| Core | Domain entities | Core.Shared |
| Core.EF | Database, EF Core | Core |
| Services.Core | DTOs, interfaces | Core |
| Services | Business logic | Core, Core.EF, Services.Core |
| Web.Host | API endpoints | All |

## Key Conventions

- **Entities**: `FH.ToDo.Core/Entities/{Domain}/`
- **Configurations**: `FH.ToDo.Core.EF/Configurations/`
- **DTOs**: `FH.ToDo.Services.Core/{Domain}/Dto/`
- **Services**: `FH.ToDo.Services/{Domain}/`
- **Controllers**: `FH.ToDo.Web.Host/Controllers/`
