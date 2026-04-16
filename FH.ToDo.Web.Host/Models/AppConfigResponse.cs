namespace FH.ToDo.Web.Host.Models;

/// <summary>
/// Public app configuration served to the Angular client
/// </summary>
public class AppConfigResponse
{
    public int IdleTimeoutMinutes { get; set; }
    public int WarningCountdownSeconds { get; set; }
}
