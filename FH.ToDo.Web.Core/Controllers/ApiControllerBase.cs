using FH.ToDo.Web.Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace FH.ToDo.Web.Core.Controllers;

/// <summary>
/// Base controller for all API controllers
/// Provides common functionality and standardized responses
/// </summary>
[ApiController]
[Route("api/[controller]")]
public abstract class ApiControllerBase : ControllerBase
{
    /// <summary>
    /// Returns a success response with data
    /// </summary>
    protected IActionResult Success<T>(T data, string? message = null)
    {
        return Ok(ApiResponse<T>.SuccessResponse(data, message));
    }

    /// <summary>
    /// Returns a success response without data
    /// </summary>
    protected IActionResult Success(string? message = null)
    {
        return Ok(ApiResponse.SuccessResponse(message));
    }

    /// <summary>
    /// Returns a created response (HTTP 201)
    /// </summary>
    protected IActionResult Created<T>(T data, string? message = null)
    {
        return StatusCode(201, ApiResponse<T>.SuccessResponse(data, message));
    }

    /// <summary>
    /// Returns a bad request response (HTTP 400)
    /// </summary>
    protected IActionResult BadRequest(string message)
    {
        return StatusCode(400, ApiResponse.ErrorResponse(message));
    }

    /// <summary>
    /// Returns a not found response (HTTP 404)
    /// </summary>
    protected IActionResult NotFound(string message)
    {
        return StatusCode(404, ApiResponse.ErrorResponse(message));
    }

    /// <summary>
    /// Returns an unauthorized response (HTTP 401)
    /// </summary>
    protected new IActionResult Unauthorized(string message)
    {
        return StatusCode(401, ApiResponse.ErrorResponse(message));
    }
}
