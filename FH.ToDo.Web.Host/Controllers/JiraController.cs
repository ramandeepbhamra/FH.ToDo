using FH.ToDo.Core.Shared.Enums;
using FH.ToDo.Services.Core.Jira;
using FH.ToDo.Services.Core.Jira.Dto;
using FH.ToDo.Web.Core.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FH.ToDo.Web.Host.Controllers;

/// <summary>
/// Generates AI-powered test cases from a Jira ticket.
/// Restricted to Premium role only — enforced server-side independently of the frontend guard.
/// </summary>
[Authorize(Roles = nameof(UserRole.Premium))]
public class JiraController : ApiControllerBase
{
    private readonly IJiraService _jiraService;
    private readonly ITestCaseService _testCaseService;

    public JiraController(IJiraService jiraService, ITestCaseService testCaseService)
    {
        _jiraService = jiraService;
        _testCaseService = testCaseService;
    }

    /// <summary>
    /// Fetches a Jira ticket and generates test cases using the configured AI provider.
    /// </summary>
    /// <param name="request">The Jira ticket number and desired output format.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Ticket metadata and the AI-generated test case text.</returns>
    /// <response code="200">Test cases generated successfully.</response>
    /// <response code="400">Invalid request or Jira/AI API error.</response>
    /// <response code="404">Jira ticket not found.</response>
    [HttpPost("testcases")]
    public async Task<IActionResult> GenerateTestCases(
        [FromBody] GenerateTestCasesRequestDto request,
        CancellationToken cancellationToken)
    {
        var ticket = await _jiraService.GetTicketAsync(
            request.JiraTicketNumber.Trim().ToUpperInvariant(), cancellationToken);

        var testCases = await _testCaseService.GenerateAsync(ticket, request.OutputFormat, cancellationToken);

        return Success(new GenerateTestCasesResponseDto
        {
            TicketKey = ticket.Key,
            Summary = ticket.Summary,
            IssueType = ticket.IssueType,
            TestCases = testCases
        });
    }
}
