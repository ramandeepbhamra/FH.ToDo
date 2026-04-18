using FH.ToDo.Services.Core.Tasks;
using FH.ToDo.Services.Core.Tasks.Dto;
using FH.ToDo.Web.Core.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FH.ToDo.Web.Host.Controllers;

[Authorize]
[Route("api/tasks")]
public class TodoTasksController : ApiControllerBase
{
    private readonly ITodoTaskService _todoTaskService;

    public TodoTasksController(ITodoTaskService todoTaskService)
    {
        _todoTaskService = todoTaskService;
    }

    [HttpGet]
    public async Task<IActionResult> GetByList([FromQuery] Guid listId, CancellationToken cancellationToken)
    {
        var tasks = await _todoTaskService.GetByListAsync(listId, CurrentUserId, cancellationToken);
        return Success(tasks);
    }

    [HttpGet("favourites")]
    public async Task<IActionResult> GetFavourites(CancellationToken cancellationToken)
    {
        var tasks = await _todoTaskService.GetFavouritesAsync(CurrentUserId, cancellationToken);
        return Success(tasks);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTodoTaskDto input, CancellationToken cancellationToken)
    {
        var task = await _todoTaskService.CreateAsync(input, CurrentUserId, CurrentUserRole, cancellationToken);
        return Created(task, "Task created");
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTodoTaskDto input, CancellationToken cancellationToken)
    {
        var task = await _todoTaskService.UpdateAsync(id, input, CurrentUserId, cancellationToken);
        return Success(task, "Task updated");
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _todoTaskService.DeleteAsync(id, CurrentUserId, cancellationToken);
        return Success("Task deleted");
    }

    [HttpPatch("{id:guid}/complete")]
    public async Task<IActionResult> ToggleComplete(Guid id, CancellationToken cancellationToken)
    {
        var task = await _todoTaskService.ToggleCompleteAsync(id, CurrentUserId, CurrentUserRole, cancellationToken);
        return Success(task);
    }

    [HttpPatch("{id:guid}/favourite")]
    public async Task<IActionResult> ToggleFavourite(Guid id, CancellationToken cancellationToken)
    {
        var task = await _todoTaskService.ToggleFavouriteAsync(id, CurrentUserId, cancellationToken);
        return Success(task);
    }

    [HttpPost("{id:guid}/subtasks")]
    public async Task<IActionResult> AddSubTask(Guid id, [FromBody] CreateSubTaskDto input, CancellationToken cancellationToken)
    {
        var subTask = await _todoTaskService.AddSubTaskAsync(id, input, CurrentUserId, cancellationToken);
        return Created(subTask, "Subtask added");
    }

    [HttpPut("{taskId:guid}/subtasks/{subTaskId:guid}")]
    public async Task<IActionResult> UpdateSubTask(Guid taskId, Guid subTaskId, [FromBody] CreateSubTaskDto input, CancellationToken cancellationToken)
    {
        var subTask = await _todoTaskService.UpdateSubTaskAsync(subTaskId, input, CurrentUserId, cancellationToken);
        return Success(subTask, "Subtask updated");
    }

    [HttpPatch("{taskId:guid}/subtasks/{subTaskId:guid}/complete")]
    public async Task<IActionResult> ToggleSubTaskComplete(Guid taskId, Guid subTaskId, CancellationToken cancellationToken)
    {
        var subTask = await _todoTaskService.ToggleSubTaskCompleteAsync(subTaskId, CurrentUserId, cancellationToken);
        return Success(subTask);
    }

    [HttpDelete("{taskId:guid}/subtasks/{subTaskId:guid}")]
    public async Task<IActionResult> DeleteSubTask(Guid taskId, Guid subTaskId, CancellationToken cancellationToken)
    {
        await _todoTaskService.DeleteSubTaskAsync(subTaskId, CurrentUserId, cancellationToken);
        return Success("Subtask deleted");
    }

    [HttpPut("update-order")]
    public async Task<IActionResult> UpdateOrder([FromBody] BulkUpdateTaskOrderDto input, CancellationToken cancellationToken)
    {
        await _todoTaskService.UpdateOrderAsync(input, CurrentUserId, cancellationToken);
        return Success("Task order updated");
    }
}
