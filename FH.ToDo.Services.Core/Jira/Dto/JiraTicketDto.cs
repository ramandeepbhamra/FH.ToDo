namespace FH.ToDo.Services.Core.Jira.Dto;

/// <summary>
/// Represents the Jira ticket data fetched from the Jira REST API.
/// This is not an EF entity — it is a transient data carrier used by the service pipeline.
/// </summary>
public class JiraTicketDto
{
    public string Key { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string IssueType { get; set; } = string.Empty;
}
