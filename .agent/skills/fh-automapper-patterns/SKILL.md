---
name: fh-automapper-patterns
description: "AutoMapper v14 configuration for FH.ToDo - profiles, DTO mappings, and best practices"
---

# FH.ToDo AutoMapper Patterns

## Package Version

AutoMapper v14.0.0 (no vulnerabilities)

## Profile Location

`FH.ToDo.Services/Mappers/{Entity}MappingProfile.cs`

## Profile Template

```csharp
using AutoMapper;
using FH.ToDo.Core.Entities.{Domain};
using FH.ToDo.Services.Core.{Domain}.Dto;

namespace FH.ToDo.Services.Mappers;

public class {Entity}MappingProfile : Profile
{
    public {Entity}MappingProfile()
    {
        // Entity → Output DTOs
        CreateMap<{Entity}, {Entity}ListDto>();
        CreateMap<{Entity}, {Entity}DetailDto>();

        // Input DTOs → Entity
        CreateMap<Create{Entity}Dto, {Entity}>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedDate, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedDate, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedDate, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedBy, opt => opt.Ignore());

        CreateMap<Update{Entity}Dto, {Entity}>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedDate, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedDate, opt => opt.Ignore())
            .ForMember(dest => dest.ModifiedBy, opt => opt.Ignore())
            .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedDate, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedBy, opt => opt.Ignore());
    }
}
```

## DTO Patterns

### CreateDto (Input - Record)
```csharp
public record CreateTaskDto(
    string Title,
    string? Description,
    DateTime? DueDate,
    Guid UserId
);
```

### UpdateDto (Input - Record)
```csharp
public record UpdateTaskDto(
    string Title,
    string? Description,
    DateTime? DueDate,
    bool IsCompleted
);
```

### ListDto (Output - Class)
```csharp
public class TaskListDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public DateTime? DueDate { get; set; }
    public bool IsCompleted { get; set; }
    public string UserName { get; set; }
}
```

### DetailDto (Output - Class)
```csharp
public class TaskDetailDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string? Description { get; set; }
    public DateTime? DueDate { get; set; }
    public bool IsCompleted { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; }
    public DateTime CreatedDate { get; set; }
}
```

## Advanced Mappings

### Custom Property Mapping
```csharp
CreateMap<User, UserListDto>()
    .ForMember(dest => dest.FullName, 
        opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"));
```

### Conditional Mapping
```csharp
CreateMap<User, UserListDto>()
    .ForMember(dest => dest.Email, 
        opt => opt.Condition(src => !string.IsNullOrEmpty(src.Email)));
```

### Nested Object Mapping
```csharp
CreateMap<Task, TaskDetailDto>()
    .ForMember(dest => dest.UserName, 
        opt => opt.MapFrom(src => src.User.FirstName + " " + src.User.LastName));
```

### Collection Mapping
```csharp
CreateMap<User, UserDetailDto>()
    .ForMember(dest => dest.Tasks, 
        opt => opt.MapFrom(src => src.Tasks));
```

## Registration

In `Program.cs`:

```csharp
builder.Services.AddAutoMapper(typeof(UserMappingProfile).Assembly);
```

## Usage in Services

### Inject IMapper
```csharp
public class TaskService : ITaskService
{
    private readonly ToDoDbContext _context;
    private readonly IMapper _mapper;

    public TaskService(ToDoDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<TaskListDto> GetTaskAsync(Guid id)
    {
        var task = await _context.Tasks.FindAsync(id);
        return _mapper.Map<TaskListDto>(task);
    }

    public async Task<List<TaskListDto>> GetTasksAsync()
    {
        var tasks = await _context.Tasks.ToListAsync();
        return _mapper.Map<List<TaskListDto>>(tasks);
    }

    public async Task<TaskDetailDto> CreateTaskAsync(CreateTaskDto dto)
    {
        var task = _mapper.Map<ToDoTask>(dto);
        task.Id = Guid.NewGuid();
        
        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();
        
        return _mapper.Map<TaskDetailDto>(task);
    }

    public async Task<TaskDetailDto> UpdateTaskAsync(Guid id, UpdateTaskDto dto)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) throw new NotFoundException();
        
        _mapper.Map(dto, task);  // Map DTO to existing entity
        await _context.SaveChangesAsync();
        
        return _mapper.Map<TaskDetailDto>(task);
    }
}
```

## Best Practices

✅ **DO**:
- Create one profile per domain aggregate
- Always ignore audit fields when mapping from DTO
- Use records for input DTOs (immutable)
- Use classes for output DTOs (serializable)
- Validate mappings in unit tests

❌ **DON'T**:
- Use ReverseMap() without reviewing what gets mapped
- Map Id from DTO to Entity (except for updates where needed)
- Forget to ignore audit fields
- Use AutoMapper for business logic
- Map entities directly to API responses

## Testing

```csharp
public class TaskMappingProfileTests
{
    private readonly IMapper _mapper;

    public TaskMappingProfileTests()
    {
        var config = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<TaskMappingProfile>();
        });
        _mapper = config.CreateMapper();
    }

    [Fact]
    public void Should_Map_Task_To_TaskListDto()
    {
        var task = new ToDoTask
        {
            Id = Guid.NewGuid(),
            Title = "Test",
            IsCompleted = false
        };

        var dto = _mapper.Map<TaskListDto>(task);

        Assert.Equal(task.Id, dto.Id);
        Assert.Equal(task.Title, dto.Title);
    }
}
```

## Troubleshooting

### Missing type map
- Ensure CreateMap is defined
- Ensure profile is registered

### Properties not mapping
- Check property names match
- Use ForMember for custom mappings
- Verify types are compatible
