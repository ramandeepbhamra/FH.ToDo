namespace FH.ToDo.Core.Shared.Constants;

/// <summary>
/// Application-wide constants
/// </summary>
public static class AppConstants
{
    /// <summary>
    /// Application name
    /// </summary>
    public const string ApplicationName = "FH.ToDo";

    /// <summary>
    /// Default page size for paginated results
    /// </summary>
    public const int DefaultPageSize = 10;

    /// <summary>
    /// Maximum page size for paginated results
    /// </summary>
    public const int MaxPageSize = 100;

    /// <summary>
    /// API routes
    /// </summary>
    public static class Routes
    {
        public const string ApiPrefix = "api";
        public const string Auth = $"{ApiPrefix}/auth";
        public const string Users = $"{ApiPrefix}/users";
    }

    /// <summary>
    /// JWT configuration keys
    /// </summary>
    public static class JwtClaimTypes
    {
        public const string UserId = "uid";
        public const string Email = "email";
        public const string FullName = "name";
        public const string Role = "role";
    }
}
