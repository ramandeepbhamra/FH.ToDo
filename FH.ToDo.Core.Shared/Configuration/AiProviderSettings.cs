namespace FH.ToDo.Core.Shared.Configuration;

/// <summary>
/// Concrete settings for a single AI provider entry in the <c>Ai:Providers</c> dictionary.
/// Every provider — GitHub Models, Anthropic, OpenAI, or any future LLM — binds into
/// this same shape. The <c>Provider</c> key in <see cref="AiSettings"/> selects the active one.
/// </summary>
public class AiProviderSettings : IAiProviderSettings
{
    /// <inheritdoc/>
    public string Endpoint { get; set; } = string.Empty;

    /// <inheritdoc/>
    public string ApiKey { get; set; } = string.Empty;

    /// <inheritdoc/>
    public string Model { get; set; } = string.Empty;

    /// <inheritdoc/>
    public int MaxTokens { get; set; } = 2048;
}
