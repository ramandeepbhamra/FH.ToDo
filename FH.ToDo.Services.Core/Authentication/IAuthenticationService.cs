using FH.ToDo.Services.Core.Authentication.Dto;

namespace FH.ToDo.Services.Core.Authentication;

/// <summary>
/// Authentication service interface
/// </summary>
public interface IAuthenticationService
{
    /// <summary>
    /// Authenticates a user and returns JWT token
    /// </summary>
    Task<LoginResponseDto> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Validates a password against a stored hash
    /// </summary>
    bool VerifyPassword(string password, string passwordHash);

    /// <summary>
    /// Hashes a plain text password
    /// </summary>
    string HashPassword(string password);
}
