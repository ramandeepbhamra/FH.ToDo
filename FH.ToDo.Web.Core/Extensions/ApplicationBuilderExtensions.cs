using FH.ToDo.Web.Core.Middleware;
using Microsoft.AspNetCore.Builder;

namespace FH.ToDo.Web.Core.Extensions;

/// <summary>
/// Extension methods for IApplicationBuilder to configure middleware pipeline
/// </summary>
public static class ApplicationBuilderExtensions
{
    /// <summary>
    /// Adds global exception handling middleware
    /// </summary>
    public static IApplicationBuilder UseGlobalExceptionHandler(this IApplicationBuilder app)
    {
        return app.UseMiddleware<ExceptionHandlingMiddleware>();
    }
}
