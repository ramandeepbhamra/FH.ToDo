using FH.ToDo.Services.Core.Users;
using FH.ToDo.Services.Core.Users.Dto;
using FH.ToDo.Web.Core.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FH.ToDo.Web.Host.Controllers;

/// <summary>
/// Profile controller — allows any authenticated user to manage their own profile
/// </summary>
[Authorize]
public class ProfileController : ApiControllerBase
{
    private readonly IUserService _userService;

    public ProfileController(IUserService userService)
    {
        _userService = userService;
    }

    /// <summary>
    /// Get the current user's profile
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        var user = await _userService.GetUserByIdAsync(CurrentUserId);
        return Success(user);
    }

    /// <summary>
    /// Update the current user's own profile (FirstName, LastName, Phone only)
    /// </summary>
    [HttpPut]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto input)
    {
        var user = await _userService.UpdateProfileAsync(CurrentUserId, input);
        return Success(user, "Profile updated successfully");
    }
}
