namespace FH.ToDo.Web.Host.Models;

/// <summary>
/// Public app configuration served to the Angular client.
/// Contains session management settings loaded from appsettings.json.
/// </summary>
public class AppConfigResponse
{
    /// <summary>
    /// Gets or sets the idle timeout duration in minutes before showing the warning dialog.
    /// Default value is 15 minutes if not configured in appsettings.json.
    /// </summary>
    public int IdleTimeoutMinutes { get; set; }

    /// <summary>
    /// Gets or sets the countdown duration in seconds shown in the warning dialog before automatic logout.
    /// Default value is 30 seconds if not configured in appsettings.json.
    /// </summary>
    public int WarningCountdownSeconds { get; set; }
}
