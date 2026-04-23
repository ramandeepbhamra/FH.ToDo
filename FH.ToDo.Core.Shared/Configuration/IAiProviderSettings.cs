namespace FH.ToDo.Core.Shared.Configuration;

/// <summary>
/// Common settings shape shared by every AI provider (GitHub Models, Anthropic, OpenAI, etc.).
/// Consume this interface in services so provider-specific config details stay in configuration,
/// not in code.
/// </summary>
public interface IAiProviderSettings
{
    /// <summary>The base endpoint URL for the provider's inference API.</summary>
    string Endpoint { get; }

    /// <summary>The API key or token used to authenticate with the provider.</summary>
    string ApiKey { get; }

    /// <summary>The model identifier e.g. gpt-4o, claude-3-5-sonnet-20241022.</summary>
    string Model { get; }

    /// <summary>Maximum number of tokens the AI response may use.</summary>
    int MaxTokens { get; }
}
