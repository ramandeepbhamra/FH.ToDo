using FH.ToDo.Core.Shared.Enums;
using FH.ToDo.Services.Core.Logging;
using FH.ToDo.Services.Core.Logging.Dto;
using FH.ToDo.Web.Core.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FH.ToDo.Web.Host.Controllers;

/// <summary>
/// API log viewer — Admin and Dev only
/// </summary>
[Authorize(Roles = nameof(UserRole.Admin) + "," + nameof(UserRole.Dev))]
public class LogsController : ApiControllerBase
{
    private readonly IApiLogService _apiLogService;

    public LogsController(IApiLogService apiLogService)
    {
        _apiLogService = apiLogService;
    }

    /// <summary>
    /// Get paginated API log entries
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetLogs([FromQuery] GetApiLogsInputDto input)
    {
        var result = await _apiLogService.GetLogsAsync(input);
        return Success(result);
    }
}
