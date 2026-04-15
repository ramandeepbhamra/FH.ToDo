using FH.ToDo.Core.Entities.Users;
using FH.ToDo.Core.Shared.Enums;
using FH.ToDo.Services.Core.Authentication;
using FH.ToDo.Services.Core.Authentication.Dto;
using FH.ToDo.Services.Core.Tasks;
using FH.ToDo.Services.Core.Users;
using FH.ToDo.Services.Core.Users.Dto;
using FH.ToDo.Web.Core.Authentication;
using FH.ToDo.Web.Core.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FH.ToDo.Web.Host.Controllers;

/// <summary>
/// Authentication controller — login, self-registration, token refresh, and revocation
/// </summary>
public class AuthController : ApiControllerBase
{
    private readonly IAuthenticationService _authenticationService;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IUserService _userService;
    private readonly IRefreshTokenService _refreshTokenService;
    private readonly ITaskListService _taskListService;

    public AuthController(
        IAuthenticationService authenticationService,
        IJwtTokenService jwtTokenService,
        IUserService userService,
        IRefreshTokenService refreshTokenService,
        ITaskListService taskListService)
    {
        _authenticationService = authenticationService;
        _jwtTokenService = jwtTokenService;
        _userService = userService;
        _refreshTokenService = refreshTokenService;
        _taskListService = taskListService;
    }

    /// <summary>Login with email and password</summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request, CancellationToken cancellationToken)
    {
        var user = await _authenticationService.AuthenticateAsync(request, cancellationToken);
        var token = await BuildFullTokenAsync(user, cancellationToken);

        return Success(BuildLoginResponse(user, token), "Login successful");
    }

    /// <summary>Register a new account — creates the user then auto-authenticates</summary>
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] CreateUserDto request, CancellationToken cancellationToken)
    {
        await _userService.CreateUserAsync(request, cancellationToken);

        var loginRequest = new LoginRequestDto { Email = request.Email, Password = request.Password };
        var user = await _authenticationService.AuthenticateAsync(loginRequest, cancellationToken);

        if (user.Role != UserRole.Admin)
            await _taskListService.CreateDefaultListAsync(user.Id, cancellationToken);

        var token = await BuildFullTokenAsync(user, cancellationToken);

        return Created(BuildLoginResponse(user, token), "Registration successful");
    }

    /// <summary>Exchange a valid refresh token for a new access token + rotated refresh token</summary>
    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequestDto request, CancellationToken cancellationToken)
    {
        var existing = await _refreshTokenService.GetValidTokenAsync(request.RefreshToken, cancellationToken);
        if (existing is null)
            return Unauthorized("Refresh token is invalid or has expired.");

        var user = await _authenticationService.GetUserByIdAsync(existing.UserId, cancellationToken);
        if (user is null || !user.IsActive)
            return Unauthorized("User account is inactive or does not exist.");

        await _refreshTokenService.RevokeAsync(request.RefreshToken, cancellationToken);
        var token = await BuildFullTokenAsync(user, cancellationToken);

        return Success(BuildLoginResponse(user, token), "Token refreshed");
    }

    /// <summary>Revoke a refresh token — logs out the current device</summary>
    [HttpPost("revoke")]
    [Authorize]
    public async Task<IActionResult> Revoke([FromBody] RefreshTokenRequestDto request, CancellationToken cancellationToken)
    {
        await _refreshTokenService.RevokeAsync(request.RefreshToken, cancellationToken);
        return Success("Logged out successfully");
    }

    private async Task<TokenResponseDto> BuildFullTokenAsync(User user, CancellationToken cancellationToken)
    {
        var accessToken = _jwtTokenService.GenerateToken(user);
        var refreshToken = await _refreshTokenService.CreateAsync(user.Id, cancellationToken);
        accessToken.RefreshToken = refreshToken.Token;
        accessToken.RefreshTokenExpiresAt = refreshToken.ExpiresAt;
        return accessToken;
    }

    private static LoginResponseDto BuildLoginResponse(User user, TokenResponseDto token) =>
        new()
        {
            Token = token,
            User = new UserInfoDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role.ToString()
            }
        };
}
