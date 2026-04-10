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

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();  // Modern API explorer at /scalar/v1
}

// Global exception handling
app.UseGlobalExceptionHandler();

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
