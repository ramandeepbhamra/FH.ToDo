using FH.ToDo.Services.Core.Tasks;
using FH.ToDo.Services.Core.Tasks.Dto;
using FH.ToDo.Web.Core.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FH.ToDo.Web.Host.Controllers;

[Authorize]
[Route("api/tasklists")]
public class TaskListsController : ApiControllerBase
{
    private readonly ITaskListService _taskListService;

    public TaskListsController(ITaskListService taskListService)
    {
        _taskListService = taskListService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var lists = await _taskListService.GetUserListsAsync(CurrentUserId, cancellationToken);
        return Success(lists);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTaskListDto input, CancellationToken cancellationToken)
    {
        var list = await _taskListService.CreateAsync(input, CurrentUserId, CurrentUserRole, cancellationToken);
        return Created(list, "List created");
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTaskListDto input, CancellationToken cancellationToken)
    {
        var list = await _taskListService.UpdateAsync(id, input, CurrentUserId, cancellationToken);
        return Success(list, "List updated");
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _taskListService.DeleteAsync(id, CurrentUserId, cancellationToken);
        return Success("List deleted");
    }
}
