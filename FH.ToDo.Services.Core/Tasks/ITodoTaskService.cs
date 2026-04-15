using FH.ToDo.Core.Shared.Enums;
using FH.ToDo.Services.Core.Tasks.Dto;

namespace FH.ToDo.Services.Core.Tasks;

public interface ITodoTaskService
{
    Task<List<TodoTaskDto>> GetByListAsync(Guid listId, Guid userId, CancellationToken cancellationToken = default);

    Task<List<TodoTaskDto>> GetFavouritesAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<TodoTaskDto> CreateAsync(CreateTodoTaskDto input, Guid userId, UserRole userRole, CancellationToken cancellationToken = default);

    Task<TodoTaskDto> UpdateAsync(Guid taskId, UpdateTodoTaskDto input, Guid userId, CancellationToken cancellationToken = default);

    Task DeleteAsync(Guid taskId, Guid userId, CancellationToken cancellationToken = default);

    Task<TodoTaskDto> ToggleCompleteAsync(Guid taskId, Guid userId, UserRole userRole, CancellationToken cancellationToken = default);

    Task<TodoTaskDto> ToggleFavouriteAsync(Guid taskId, Guid userId, CancellationToken cancellationToken = default);

    Task<SubTaskDto> AddSubTaskAsync(Guid taskId, CreateSubTaskDto input, Guid userId, CancellationToken cancellationToken = default);

    Task<SubTaskDto> ToggleSubTaskCompleteAsync(Guid subTaskId, Guid userId, CancellationToken cancellationToken = default);

    Task DeleteSubTaskAsync(Guid subTaskId, Guid userId, CancellationToken cancellationToken = default);
}
