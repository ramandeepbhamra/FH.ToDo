using FH.ToDo.Core.EF.Context;
using FH.ToDo.Core.Repositories;
using FH.ToDo.Core.EF.Repositories;
using FH.ToDo.Services.Authentication;
using FH.ToDo.Services.Core.Authentication;
using FH.ToDo.Services.Core.Users;
using FH.ToDo.Services.Mapping;
using FH.ToDo.Services.Users;
using FH.ToDo.Web.Core.Extensions;
using Microsoft.EntityFrameworkCore;
using NSwag;
using Scalar.AspNetCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container
builder.Services.AddControllers();

// Database
builder.Services.AddDbContext<ToDoDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositories
builder.Services.AddScoped(typeof(IRepository<,>), typeof(Repository<,>));

// Services
builder.Services.AddScoped<IUserService, UserServices>();
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
builder.Services.AddScoped<IRefreshTokenService, RefreshTokenService>();

// Mappers
builder.Services.AddScoped<UserMapper>();

// Web.Core Infrastructure
builder.Services.AddWebCoreServices(builder.Configuration);
builder.Services.AddJwtAuthentication(builder.Configuration);

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        var origins = builder.Configuration["Cors:Origins"]?.Split(',') ?? Array.Empty<string>();
        policy.WithOrigins(origins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// OpenAPI / Scalar (Modern .NET 10 API Documentation)
builder.Services.AddOpenApi();

// NSwag / Swagger (Alternative API Documentation)
builder.Services.AddOpenApiDocument(options =>
{
    options.Title = "FH.ToDo API";
    options.Version = "v1";
    options.Description = "FH.ToDo RESTful API with JWT Authentication";

    // Add JWT authentication to Swagger
    options.AddSecurity("Bearer", new NSwag.OpenApiSecurityScheme
    {
        Type = NSwag.OpenApiSecuritySchemeType.ApiKey,
        Name = "Authorization",
        In = NSwag.OpenApiSecurityApiKeyLocation.Header,
        Description = "Enter 'Bearer' [space] and then your JWT token",
        Scheme = "Bearer"
    });

    options.OperationProcessors.Add(new NSwag.Generation.Processors.Security.AspNetCoreOperationSecurityScopeProcessor("Bearer"));
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    // Scalar UI (Modern)
    app.MapOpenApi();
    app.MapScalarApiReference();  // Available at: /scalar/v1

    // NSwag / Swagger UI (Traditional)
    app.UseOpenApi();             // OpenAPI spec at: /swagger/v1/swagger.json
    app.UseSwaggerUi();            // Swagger UI at: /swagger
}

// Global exception handling
app.UseGlobalExceptionHandler();

app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
