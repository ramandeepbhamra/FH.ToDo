namespace FH.ToDo.Services.Core.Jira.Dto;

/// <summary>Response payload containing the generated test cases and the resolved ticket metadata.</summary>
public class GenerateTestCasesResponseDto
{
    public string TicketKey { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string IssueType { get; set; } = string.Empty;
    public string TestCases { get; set; } = string.Empty;
}
