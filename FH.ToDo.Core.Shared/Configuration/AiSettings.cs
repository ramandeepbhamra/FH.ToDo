namespace FH.ToDo.Core.Shared.Configuration;

/// <summary>
/// Root AI configuration bound from the <c>Ai</c> section of appsettings.json.
/// <para>
/// <c>Provider</c> names the active entry in <c>Providers</c>. Adding a new LLM requires
/// only a new key in the <c>Ai:Providers</c> dictionary — no code changes needed.
/// </para>
/// </summary>
public class AiSettings
{
    /// <summary>
    /// The key of the active provider in <see cref="Providers"/>.
    /// Must match one of the dictionary keys exactly e.g. <c>GitHub</c>, <c>Anthropic</c>, <c>OpenAi</c>.
    /// </summary>
    public string Provider { get; set; } = "GitHub";

    /// <summary>
    /// Named provider configurations keyed by provider name.
    /// Each entry maps to an <see cref="AiProviderSettings"/> instance bound from config.
    /// </summary>
    public Dictionary<string, AiProviderSettings> Providers { get; set; } = new();

    /// <summary>
    /// Returns the <see cref="IAiProviderSettings"/> for the currently active provider.
    /// Throws <see cref="InvalidOperationException"/> when <see cref="Provider"/> does not
    /// match any key in <see cref="Providers"/>.
    /// </summary>
    public IAiProviderSettings GetActiveProvider() =>
        Providers.TryGetValue(Provider, out var settings)
            ? settings
            : throw new InvalidOperationException(
                $"AI provider '{Provider}' is not configured. Add it to Ai:Providers in appsettings.json.");
}
