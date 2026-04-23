using FH.ToDo.Services.Core.Jira.Dto;

namespace FH.ToDo.Services.Core.Jira;

/// <summary>Builds the AI prompt and calls the configured AI provider to generate test cases.</summary>
public interface ITestCaseService
{
    /// <summary>
    /// Generates test cases for the supplied Jira ticket using the configured AI provider.
    /// </summary>
    /// <param name="ticket">Ticket data fetched from Jira.</param>
    /// <param name="outputFormat">BDD, StepByStep, or Markdown.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The raw AI-generated test case text.</returns>
    Task<string> GenerateAsync(JiraTicketDto ticket, string outputFormat, CancellationToken cancellationToken = default);
}
