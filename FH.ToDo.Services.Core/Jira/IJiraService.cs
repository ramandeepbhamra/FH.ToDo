using FH.ToDo.Services.Core.Jira.Dto;

namespace FH.ToDo.Services.Core.Jira;

/// <summary>Fetches and parses ticket data from the Jira REST API.</summary>
public interface IJiraService
{
    /// <summary>
    /// Retrieves a Jira ticket by its key.
    /// Throws <see cref="KeyNotFoundException"/> when the ticket does not exist.
    /// </summary>
    /// <param name="ticketKey">The Jira issue key e.g. PROJ-123.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task<JiraTicketDto> GetTicketAsync(string ticketKey, CancellationToken cancellationToken = default);
}
