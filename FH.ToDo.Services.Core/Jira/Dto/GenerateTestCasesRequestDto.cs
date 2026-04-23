namespace FH.ToDo.Services.Core.Jira.Dto;

/// <summary>Request payload for generating test cases from a Jira ticket.</summary>
public class GenerateTestCasesRequestDto
{
    /// <summary>The Jira ticket key e.g. PROJ-123.</summary>
    public string JiraTicketNumber { get; set; } = string.Empty;

    /// <summary>Output format: BDD, StepByStep, or Markdown.</summary>
    public string OutputFormat { get; set; } = "BDD";
}
