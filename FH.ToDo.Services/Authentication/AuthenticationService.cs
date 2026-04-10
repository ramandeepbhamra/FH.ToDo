using FH.ToDo.Core.Entities.Users;
using FH.ToDo.Core.Repositories;
using FH.ToDo.Services.Core.Authentication;
using FH.ToDo.Services.Core.Authentication.Dto;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace FH.ToDo.Services.Authentication;

/// <summary>
/// Authentication service implementation
/// Handles user authentication and password hashing
/// NOTE: JWT token generation will be added when Web.Core infrastructure is implemented
/// </summary>
public class AuthenticationService : IAuthenticationService
{
    private readonly IRepository<User, Guid> _userRepository;

    public AuthenticationService(IRepository<User, Guid> userRepository)
    {
        _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
    }

    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default)
    {
        // Find user by email using generic repository
        var user = await _userRepository
            .GetAll()
            .FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);

        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        // Check if user is active
        if (!user.IsActive)
        {
            throw new UnauthorizedAccessException("User account is inactive.");
        }

        // Verify password
        if (!VerifyPassword(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        // TODO: Generate JWT token (will be implemented in Web.Core)
        // For now, return a placeholder response
        return new LoginResponseDto
        {
            Token = new TokenResponseDto
            {
                AccessToken = "TOKEN_GENERATION_PENDING",
                ExpiresAt = DateTime.UtcNow.AddHours(1),
                ExpiresInSeconds = 3600
            },
            User = new UserInfoDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName
            }
        };
    }

    public bool VerifyPassword(string password, string passwordHash)
    {
        return BCrypt.Net.BCrypt.Verify(password, passwordHash);
    }

    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12);
    }
}
