using System.Text;
using System.Text.Json;
using FH.ToDo.Core.Shared.Configuration;
using FH.ToDo.Services.Core.Jira;
using FH.ToDo.Services.Core.Jira.Dto;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RestSharp;
using RestSharp.Authenticators;

namespace FH.ToDo.Services.Jira;

public class JiraService : IJiraService
{
    private readonly RestClient _client;
    private readonly ILogger<JiraService> _logger;

    public JiraService(IOptions<JiraSettings> options, ILogger<JiraService> logger)
    {
        _logger = logger;

        var settings = options.Value;
        var clientOptions = new RestClientOptions(settings.BaseUrl)
        {
            Authenticator = new HttpBasicAuthenticator(settings.Email, settings.ApiToken)
        };

        _client = new RestClient(clientOptions);
    }

    public async Task<JiraTicketDto> GetTicketAsync(string ticketKey, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Fetching Jira ticket {Key}", ticketKey);

        var request = new RestRequest($"/rest/api/3/issue/{ticketKey}");
        var response = await _client.GetAsync(request, cancellationToken);

        if (!response.IsSuccessful)
        {
            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                throw new KeyNotFoundException($"Jira ticket '{ticketKey}' was not found.");

            throw new InvalidOperationException(
                $"Jira API returned {(int)response.StatusCode}: {response.ErrorMessage}");
        }

        var json = JsonDocument.Parse(response.Content!);
        var fields = json.RootElement.GetProperty("fields");

        var description = fields.TryGetProperty("description", out var descNode)
            ? ExtractAdfText(descNode)
            : string.Empty;

        return new JiraTicketDto
        {
            Key = ticketKey,
            Summary = fields.GetProperty("summary").GetString() ?? string.Empty,
            Description = description,
            IssueType = fields.GetProperty("issuetype").GetProperty("name").GetString() ?? "Story"
        };
    }

    /// <summary>
    /// Recursively flattens Atlassian Document Format (ADF) JSON into plain text.
    /// Jira Cloud stores descriptions as a structured JSON tree — this extracts only the readable content.
    /// </summary>
    private static string ExtractAdfText(JsonElement node)
    {
        var sb = new StringBuilder();

        if (node.ValueKind != JsonValueKind.Object)
            return string.Empty;

        if (node.TryGetProperty("text", out var text))
            sb.Append(text.GetString());

        if (node.TryGetProperty("content", out var content))
        {
            foreach (var child in content.EnumerateArray())
            {
                var childText = ExtractAdfText(child);
                if (!string.IsNullOrWhiteSpace(childText))
                    sb.AppendLine(childText);
            }
        }

        return sb.ToString().Trim();
    }
}
