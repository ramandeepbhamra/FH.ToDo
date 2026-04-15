using FH.ToDo.Services.Core.Tasks.Dto;

namespace FH.ToDo.Services.Core.Tasks;

public interface ITaskListService
{
    Task<List<TaskListDto>> GetUserListsAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<TaskListDto> CreateAsync(CreateTaskListDto input, Guid userId, CancellationToken cancellationToken = default);

    Task<TaskListDto> UpdateAsync(Guid listId, UpdateTaskListDto input, Guid userId, CancellationToken cancellationToken = default);

    Task DeleteAsync(Guid listId, Guid userId, CancellationToken cancellationToken = default);

    Task CreateDefaultListAsync(Guid userId, CancellationToken cancellationToken = default);
}
