---
name: fh-automapper-patterns
description: "Mapperly 4.x source-generated mapping for FH.ToDo — mapper classes, ignore patterns, and DTO mapping conventions"
---

# FH.ToDo Mapperly Mapping Patterns

> ⚠️ This project uses **Mapperly 4.3.1** (`Riok.Mapperly`), NOT AutoMapper.
> Do not use `CreateMap<>()`, `Profile`, or any AutoMapper API.

## Package

```xml
<PackageReference Include="Riok.Mapperly" Version="4.3.1" />
```

## Mapper Location

`FH.ToDo.Services/Mapping/{Domain}Mapper.cs`

**Examples**:
- `FH.ToDo.Services/Mapping/UserMapper.cs`
- `FH.ToDo.Services/Mapping/TaskMapper.cs`

## Mapper Class Template

```csharp
using FH.ToDo.Core.Entities.{Domain};
using FH.ToDo.Services.Core.{Domain}.Dto;
using Riok.Mapperly.Abstractions;

namespace FH.ToDo.Services.Mapping;

/// <summary>
/// Navigation properties and non-DTO fields are silently skipped via RequiredMappingStrategy.Target.
/// Sensitive infrastructure fields are explicitly excluded below so accidental DTO additions cause a compile error.
/// </summary>
[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class {Domain}Mapper
{
    // Entity → DTO (source sensitive fields explicitly ignored)
    [MapperIgnoreSource(nameof({Entity}.IsDeleted))]
    [MapperIgnoreSource(nameof({Entity}.DeletedDate))]
    [MapperIgnoreSource(nameof({Entity}.DeletedBy))]
    [MapperIgnoreSource(nameof({Entity}.CreatedBy))]
    [MapperIgnoreSource(nameof({Entity}.ModifiedDate))]
    [MapperIgnoreSource(nameof({Entity}.ModifiedBy))]
    public partial {Entity}Dto {Entity}ToDto({Entity} entity);

    public partial List<{Entity}Dto> {Entity}sToDto(List<{Entity}> entities);

    // DTO → Entity (target infrastructure fields ignored — never overwrite audit/delete)
    [MapperIgnoreTarget(nameof({Entity}.Id))]
    [MapperIgnoreTarget(nameof({Entity}.CreatedDate))]
    [MapperIgnoreTarget(nameof({Entity}.CreatedBy))]
    [MapperIgnoreTarget(nameof({Entity}.IsDeleted))]
    [MapperIgnoreTarget(nameof({Entity}.DeletedDate))]
    [MapperIgnoreTarget(nameof({Entity}.DeletedBy))]
    public partial void Update{Entity}DtoTo{Entity}(Update{Entity}Dto dto, {Entity} entity);
}
```

## RequiredMappingStrategy — Two Layers of Protection

### Layer 1: `RequiredMappingStrategy.Target`
All **target** (DTO) members must be mapped — compile error if a DTO property has no source.  
All **source** (entity) extras (navigation props, FK IDs) are silently skipped — no noise.

```csharp
// ✅ Class-level: navigation props, FK IDs silently skipped
[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
```

### Layer 2: `[MapperIgnoreSource]` for sensitive fields
Explicitly block infrastructure fields from ever reaching any DTO.  
If someone accidentally adds `IsDeleted` to a DTO, this causes a **compile error**.

```csharp
// ✅ Per-method: sensitive fields explicitly blocked
[MapperIgnoreSource(nameof(TaskList.IsDeleted))]
[MapperIgnoreSource(nameof(TaskList.DeletedDate))]
[MapperIgnoreSource(nameof(TaskList.DeletedBy))]
[MapperIgnoreSource(nameof(TaskList.CreatedBy))]
[MapperIgnoreSource(nameof(TaskList.ModifiedDate))]
[MapperIgnoreSource(nameof(TaskList.ModifiedBy))]
public partial TaskListDto TaskListToDto(TaskList taskList);
```

## PasswordHash — Mandatory Guard

`PasswordHash` must have an explicit `[MapperIgnoreSource]` on **every** User→DTO method.  
This is a security contract — accidental exposure causes a compile error, not a silent data leak.

```csharp
[MapperIgnoreSource(nameof(User.PasswordHash))]
public partial UserListDto UserToUserListDto(User user);

[MapperIgnoreSource(nameof(User.PasswordHash))]
[MapProperty(nameof(User.FullName), nameof(UserDto.FullName))]
public partial UserDto UserToUserDto(User user);
```

## Custom Property Mapping

Use `[MapProperty]` when names differ between source and target:

```csharp
// Maps User.FullName → UserDto.FullName (explicit when name differs or needs clarification)
[MapProperty(nameof(User.FullName), nameof(UserDto.FullName))]
public partial UserDto UserToUserDto(User user);
```

## DTO → Entity (update patterns)

Use `void` with two parameters for update operations (modifies existing entity):

```csharp
[MapperIgnoreTarget(nameof(User.Id))]
[MapperIgnoreTarget(nameof(User.PasswordHash))]
[MapperIgnoreTarget(nameof(User.CreatedDate))]
[MapperIgnoreTarget(nameof(User.CreatedBy))]
[MapperIgnoreTarget(nameof(User.IsDeleted))]
[MapperIgnoreTarget(nameof(User.DeletedDate))]
[MapperIgnoreTarget(nameof(User.DeletedBy))]
public partial void UpdateUserDtoToUser(UpdateUserDto dto, User user);
```

## Create DTO → Entity

For create operations, return a new entity instance:

```csharp
[MapProperty(nameof(CreateUserDto.Password), nameof(User.PasswordHash))]
public partial User CreateUserDtoToUser(CreateUserDto dto);
```

## DI Registration

Mapper classes are stateless — register as **singleton**:

```csharp
builder.Services.AddSingleton<UserMapper>();
builder.Services.AddSingleton<TaskMapper>();
```

## What Mapperly Does NOT Support

- Runtime configuration (everything is compile-time)
- `Ignore()` as a fluent chain — use `[MapperIgnoreSource]` / `[MapperIgnoreTarget]` attributes
- `CreateMap<>()` — that is AutoMapper syntax, not Mapperly

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
