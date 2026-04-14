# Generate CRUD

Generate complete CRUD implementation for an entity (Entity → Service → Controller → DTOs → Mappings).

## Usage

`/generate-crud {EntityName}`

## What It Creates

### 1. Entity (if not exists)
`FH.ToDo.Core/Entities/{Domain}/{Entity}.cs`

### 2. Configuration
`FH.ToDo.Core.EF/Configurations/{Entity}Configuration.cs`

### 3. DTOs
- `FH.ToDo.Services.Core/{Domain}/Dto/Create{Entity}Dto.cs`
- `FH.ToDo.Services.Core/{Domain}/Dto/Update{Entity}Dto.cs`
- `FH.ToDo.Services.Core/{Domain}/Dto/{Entity}ListDto.cs`
- `FH.ToDo.Services.Core/{Domain}/Dto/Get{Entity}sInputDto.cs`

### 4. Service Interface
`FH.ToDo.Services.Core/{Domain}/I{Entity}Service.cs`

### 5. Service Implementation
`FH.ToDo.Services/{Domain}/{Entity}Service.cs`

### 6. AutoMapper Profile
`FH.ToDo.Services/Mappers/{Entity}MappingProfile.cs`

### 7. Controller
`FH.ToDo.Web.Host/Controllers/{Entity}Controller.cs`

### 8. Migration
`dotnet ef migrations add Add{Entity}Entity`

## Generated Service Methods

```csharp
public interface ITaskService
{
    Task<PagedResultDto<TaskListDto>> GetTasksAsync(GetTasksInputDto input);
    Task<TaskDetailDto> GetTaskByIdAsync(Guid id);
    Task<TaskDetailDto> CreateTaskAsync(CreateTaskDto input);
    Task<TaskDetailDto> UpdateTaskAsync(Guid id, UpdateTaskDto input);
    Task DeleteTaskAsync(Guid id);
}
```

## Generated Controller

```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController : ApiControllerBase
{
    private readonly ITaskService _taskService;

    [HttpGet]
    public async Task<IActionResult> GetTasks([FromQuery] GetTasksInputDto input)
    {
        var result = await _taskService.GetTasksAsync(input);
        return Success(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTask(Guid id)
    {
        var task = await _taskService.GetTaskByIdAsync(id);
        return Success(task);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto input)
    {
        var task = await _taskService.CreateTaskAsync(input);
        return Created(task, "Task created");
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(Guid id, [FromBody] UpdateTaskDto input)
    {
        var task = await _taskService.UpdateTaskAsync(id, input);
        return Success(task, "Task updated");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(Guid id)
    {
        await _taskService.DeleteTaskAsync(id);
        return Success("Task deleted");
    }
}
```

## Workflow

1. Ask for entity properties
2. Create entity and configuration
3. Add DbSet to ToDoDbContext
4. Generate migration
5. Create DTOs
6. Create AutoMapper profile
7. Create service interface
8. Create service implementation
9. Create controller
10. Register service in DI
11. Build and verify

## Next Steps

After generation:
1. Apply migration: `/apply-migration`
2. Register service in `Program.cs` DI
3. Test endpoints via Swagger
4. Add authorization policies if needed
5. Add validation if needed

## Example

```
User: /generate-crud Task

Agent: I'll create complete CRUD for Task entity. What properties?

User: Title (string), Description (string, optional), DueDate (DateTime, optional), UserId (Guid)

Agent: Creating CRUD implementation...

✅ Entity created: FH.ToDo.Core/Entities/Tasks/ToDoTask.cs
✅ Configuration: FH.ToDo.Core.EF/Configurations/ToDoTaskConfiguration.cs
✅ DbSet added to ToDoDbContext
✅ DTOs created (4 files)
✅ Service interface created
✅ Service implementation created
✅ AutoMapper profile created
✅ Controller created
✅ Migration generated: Add TaskEntity

Next steps:
1. Apply migration: /apply-migration
2. Register ITaskService in DI
3. Test API endpoints
```
