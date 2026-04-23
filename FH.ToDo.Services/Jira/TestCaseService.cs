using Azure;
using Azure.AI.Inference;
using FH.ToDo.Core.Shared.Configuration;
using FH.ToDo.Services.Core.Jira;
using FH.ToDo.Services.Core.Jira.Dto;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace FH.ToDo.Services.Jira;

public class TestCaseService : ITestCaseService
{
    private readonly AiSettings _settings;
    private readonly ILogger<TestCaseService> _logger;

    public TestCaseService(IOptions<AiSettings> options, ILogger<TestCaseService> logger)
    {
        _settings = options.Value;
        _logger = logger;
    }

    public async Task<string> GenerateAsync(JiraTicketDto ticket, string outputFormat, CancellationToken cancellationToken = default)
    {
        var provider = _settings.GetActiveProvider();

        _logger.LogInformation(
            "Generating test cases for {Key} using provider {Provider} with model {Model}",
            ticket.Key, _settings.Provider, provider.Model);

        return _settings.Provider switch
        {
            var p when p.Equals("Anthropic", StringComparison.OrdinalIgnoreCase)
                => await GenerateWithAnthropicAsync(provider, ticket, outputFormat, cancellationToken),
            _   => await GenerateWithGitHubModelsAsync(provider, ticket, outputFormat, cancellationToken)
        };
    }

    private static async Task<string> GenerateWithGitHubModelsAsync(
        IAiProviderSettings provider,
        JiraTicketDto ticket,
        string outputFormat,
        CancellationToken cancellationToken)
    {
        var client = new ChatCompletionsClient(
            new Uri(provider.Endpoint),
            new AzureKeyCredential(provider.ApiKey));

        var options = new ChatCompletionsOptions
        {
            Model = provider.Model,
            MaxTokens = provider.MaxTokens,
            Messages =
            {
                new ChatRequestSystemMessage("You are a senior QA engineer who writes thorough, precise test cases."),
                new ChatRequestUserMessage(BuildPrompt(ticket, outputFormat))
            }
        };

        var response = await client.CompleteAsync(options, cancellationToken);
        return response.Value.Content ?? string.Empty;
    }

    private static async Task<string> GenerateWithAnthropicAsync(
        IAiProviderSettings provider,
        JiraTicketDto ticket,
        string outputFormat,
        CancellationToken cancellationToken)
    {
        using var http = new System.Net.Http.HttpClient();
        http.DefaultRequestHeaders.Add("x-api-key", provider.ApiKey);
        http.DefaultRequestHeaders.Add("anthropic-version", "2023-06-01");

        var body = new
        {
            model = provider.Model,
            max_tokens = provider.MaxTokens,
            messages = new[]
            {
                new { role = "user", content = BuildPrompt(ticket, outputFormat) }
            }
        };

        var json = System.Text.Json.JsonSerializer.Serialize(body);
        var content = new System.Net.Http.StringContent(json, System.Text.Encoding.UTF8, "application/json");
        var response = await http.PostAsync($"{provider.Endpoint}/v1/messages", content, cancellationToken);

        response.EnsureSuccessStatusCode();

        var responseJson = System.Text.Json.JsonDocument.Parse(
            await response.Content.ReadAsStringAsync(cancellationToken));

        return responseJson.RootElement
            .GetProperty("content")[0]
            .GetProperty("text")
            .GetString() ?? string.Empty;
    }

    private static string BuildPrompt(JiraTicketDto ticket, string outputFormat)
    {
        var formatInstruction = outputFormat switch
        {
            "BDD"        => "Write all test cases in Gherkin BDD format using Given / When / Then / And syntax.",
            "StepByStep" => "Write each test case as a numbered step-by-step script with an 'Expected Result' at the end.",
            _            => "Write test cases in a markdown table with columns: Test Case ID | Title | Steps | Expected Result | Priority."
        };

        return $"""
            You are a senior QA engineer. Based on the Jira ticket below, generate a comprehensive set of test cases.

            Ticket Key : {ticket.Key}
            Issue Type : {ticket.IssueType}
            Summary    : {ticket.Summary}

            Description:
            {ticket.Description}

            Instructions:
            1. Cover happy path, edge cases, boundary values, and negative/error scenarios.
            2. {formatInstruction}
            3. Generate at least 8 test cases.
            4. Be specific — include sample inputs and exact expected outputs where relevant.
            5. Group test cases under headings: Functional, Edge Cases, Negative Scenarios.
            """;
    }
}
