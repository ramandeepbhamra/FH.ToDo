using FH.ToDo.Web.Core.Controllers;
using FH.ToDo.Web.Host.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FH.ToDo.Web.Host.Controllers;

/// <summary>
/// Returns public app configuration to the Angular client
/// </summary>
[AllowAnonymous]
public class ConfigController : ApiControllerBase
{
    private readonly IConfiguration _configuration;

    public ConfigController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

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
