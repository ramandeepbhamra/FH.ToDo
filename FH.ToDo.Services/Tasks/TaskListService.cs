using FH.ToDo.Core.Entities.Tasks;
using FH.ToDo.Core.Repositories;
using FH.ToDo.Services.Core.Tasks;
using FH.ToDo.Services.Core.Tasks.Dto;
using FH.ToDo.Services.Mapping;
using Microsoft.EntityFrameworkCore;

namespace FH.ToDo.Services.Tasks;

public class TaskListService : ITaskListService
{
    private readonly IRepository<TaskList, Guid> _listRepository;
    private readonly IRepository<TodoTask, Guid> _taskRepository;
    private readonly IRepository<SubTask, Guid> _subTaskRepository;
    private readonly TaskMapper _mapper;

    public TaskListService(
        IRepository<TaskList, Guid> listRepository,
        IRepository<TodoTask, Guid> taskRepository,
        IRepository<SubTask, Guid> subTaskRepository,
        TaskMapper mapper)
    {
        _listRepository = listRepository;
        _taskRepository = taskRepository;
        _subTaskRepository = subTaskRepository;
        _mapper = mapper;
    }

    public async Task<List<TaskListDto>> GetUserListsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var lists = await _listRepository
            .GetAll()
            .Where(tl => tl.UserId == userId)
            .OrderBy(tl => tl.Order)
            .ToListAsync(cancellationToken);

        return _mapper.TaskListsToDtos(lists);
    }

    public async Task<TaskListDto> CreateAsync(CreateTaskListDto input, Guid userId, CancellationToken cancellationToken = default)
    {
        var order = await _listRepository
            .GetAll()
            .Where(tl => tl.UserId == userId)
            .CountAsync(cancellationToken) + 1;

        var list = new TaskList
        {
            Id = Guid.NewGuid(),
            Title = input.Title,
            UserId = userId,
            Order = order
        };

        var created = await _listRepository.InsertAsync(list, cancellationToken);
        return _mapper.TaskListToDto(created);
    }

    public async Task<TaskListDto> UpdateAsync(Guid listId, UpdateTaskListDto input, Guid userId, CancellationToken cancellationToken = default)
    {
        var list = await _listRepository
            .GetAll()
            .FirstOrDefaultAsync(tl => tl.Id == listId, cancellationToken)
            ?? throw new KeyNotFoundException($"Task list {listId} not found.");

        if (list.UserId != userId)
            throw new UnauthorizedAccessException("You do not have access to this list.");

        list.Title = input.Title;
        var updated = await _listRepository.UpdateAsync(list, cancellationToken);
        return _mapper.TaskListToDto(updated);
    }

    public async Task DeleteAsync(Guid listId, Guid userId, CancellationToken cancellationToken = default)
    {
        var list = await _listRepository
            .GetAll()
            .Include(tl => tl.Tasks)
                .ThenInclude(t => t.SubTasks)
            .FirstOrDefaultAsync(tl => tl.Id == listId, cancellationToken)
            ?? throw new KeyNotFoundException($"Task list {listId} not found.");

        if (list.UserId != userId)
            throw new UnauthorizedAccessException("You do not have access to this list.");

        foreach (var task in list.Tasks)
        {
            foreach (var subTask in task.SubTasks)
                await _subTaskRepository.DeleteAsync(subTask.Id, cancellationToken);

            await _taskRepository.DeleteAsync(task.Id, cancellationToken);
        }

        await _listRepository.DeleteAsync(listId, cancellationToken);
    }

    public Task CreateDefaultListAsync(Guid userId, CancellationToken cancellationToken = default)
        => CreateAsync(new CreateTaskListDto { Title = "My Tasks" }, userId, cancellationToken);
}
