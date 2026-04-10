using FH.ToDo.Core.Entities.Users;
using FH.ToDo.Services.Core.Authentication;
using FH.ToDo.Services.Core.Authentication.Dto;
using FH.ToDo.Web.Core.Authentication;
using FH.ToDo.Web.Core.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FH.ToDo.Web.Host.Controllers;

/// <summary>
/// Authentication controller
/// Handles user authentication and JWT token generation
/// </summary>
[AllowAnonymous]
public class AuthController : ApiControllerBase
{
    private readonly IAuthenticationService _authenticationService;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthController(
        IAuthenticationService authenticationService,
        IJwtTokenService jwtTokenService)
    {
        _authenticationService = authenticationService;
        _jwtTokenService = jwtTokenService;
    }

    /// <summary>
    /// Login with email and password
    /// </summary>
    /// <param name="request">Login credentials</param>
    /// <returns>JWT token and user information</returns>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        // 1. Authenticate user (verify credentials - Services layer)
        var user = await _authenticationService.AuthenticateAsync(request);

        // 2. Generate JWT token (web-specific concern - Web layer)
        var token = _jwtTokenService.GenerateToken(user);

        // 3. Build response
        var response = new LoginResponseDto
        {
            Token = token,
            User = new UserInfoDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName
            }
        };

        return Success(response, "Login successful");
    }
}
