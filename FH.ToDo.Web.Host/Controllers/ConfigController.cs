using FH.ToDo.Web.Core.Controllers;
using FH.ToDo.Web.Host.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FH.ToDo.Web.Host.Controllers;

/// <summary>
/// Returns public app configuration to the Angular client.
/// This endpoint is accessible without authentication.
/// </summary>
[AllowAnonymous]
public class ConfigController : ApiControllerBase
{
    private readonly IConfiguration _configuration;

    /// <summary>
    /// Initializes a new instance of the <see cref="ConfigController"/> class.
    /// </summary>
    /// <param name="configuration">The application configuration.</param>
    public ConfigController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    /// <summary>
    /// Gets the public application configuration including session timeout settings.
    /// </summary>
    /// <returns>An <see cref="AppConfigResponse"/> containing idle timeout and warning countdown settings.</returns>
    /// <response code="200">Returns the configuration successfully.</response>
    [HttpGet]
    public IActionResult GetConfig()
    {
        var config = new AppConfigResponse
        {
            IdleTimeoutMinutes       = _configuration.GetValue<int>("Session:IdleTimeoutMinutes", 15),
            WarningCountdownSeconds  = _configuration.GetValue<int>("Session:WarningCountdownSeconds", 30),
        };
        return Success(config);
    }
}
