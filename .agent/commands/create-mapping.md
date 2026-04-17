# Create Mapping

Create AutoMapper profile and DTOs for an entity.

## Usage

`/create-mapping {EntityName}`

## What It Does

1. Creates DTOs in `FH.ToDo.Services.Core/{Domain}/Dto/`:
   - `Create{Entity}Dto.cs` - For POST requests
   - `Update{Entity}Dto.cs` - For PUT requests
   - `{Entity}ListDto.cs` - For GET list responses
   - `{Entity}DetailDto.cs` - For GET single responses (optional)

2. Creates AutoMapper profile in `FH.ToDo.Services/Mappers/{Entity}MappingProfile.cs`

3. Registers profile in DI (if not auto-scanned)

## DTO Patterns

### CreateDto (Input)
```csharp
public record CreateTaskDto(
    string Title,
    string? Description,
    DateTime? DueDate,
    Guid UserId
);
```

### UpdateDto (Input)
```csharp
public record UpdateTaskDto(
    string Title,
    string? Description,
    DateTime? DueDate,
    bool IsCompleted
);
```

### ListDto (Output)
```csharp
public class TaskListDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public DateTime? DueDate { get; set; }
    public bool IsCompleted { get; set; }
}
```

## AutoMapper Profile

```csharp
public class TaskMappingProfile : Profile
{
    public TaskMappingProfile()
    {
        // Entity → ListDto
        CreateMap<ToDoTask, TaskListDto>();

        // Entity → DetailDto
        CreateMap<ToDoTask, TaskDetailDto>();

        // CreateDto → Entity
        CreateMap<CreateTaskDto, ToDoTask>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedDate, opt => opt.Ignore())
            // ... ignore all audit fields

        // UpdateDto → Entity
        CreateMap<UpdateTaskDto, ToDoTask>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            // ... ignore all audit fields
    }
}
```

## Rules

- ✅ **Always** ignore audit fields (CreatedDate, CreatedBy, etc.) when mapping from DTO
- ✅ **Always** use records for input DTOs (immutable)
- ✅ **Always** use classes for output DTOs (serializable)
- ✅ **Never** expose entity directly in API

## Next Steps

After creating mappings:
1. Update service layer to use DTOs
2. Update controller to use DTOs
3. Test mappings with unit tests
