namespace FH.ToDo.Core.Shared.Configuration;

/// <summary>
/// Jira REST API connection settings.
/// Populated from the <c>Jira</c> section of appsettings.json.
/// </summary>
public class JiraSettings
{
    /// <summary>Your Atlassian base URL e.g. https://yourcompany.atlassian.net</summary>
    public string BaseUrl { get; set; } = string.Empty;

    /// <summary>The Atlassian account email used to authenticate.</summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>Jira API token — generate at id.atlassian.com/manage-profile/security/api-tokens</summary>
    public string ApiToken { get; set; } = string.Empty;
}
