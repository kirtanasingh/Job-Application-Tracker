using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using JobTrack.Data;
using JobTrack.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "JobTrack API",
        Version = "v1",
        Description = "Job Application Tracker RESTful Web API with Auth & Fast Persistence"
    });
});

// Register Authentication Service
builder.Services.AddScoped<IAuthService, AuthService>();

// Configure EF Core DbContext (Instant SQLite file DB by default, or SQL Server if enabled)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
bool useSqlServer = builder.Configuration.GetValue<bool>("UseSqlServer", false);

if (useSqlServer)
{
    try
    {
        using var testConn = new SqlConnection(connectionString);
        testConn.Open();
    }
    catch
    {
        useSqlServer = false;
    }
}

builder.Services.AddDbContext<JobDbContext>(options =>
{
    if (useSqlServer)
    {
        options.UseSqlServer(connectionString);
    }
    else
    {
        options.UseSqlite("Data Source=JobTrack.db");
    }
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://localhost:4201", "https://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Enable Swagger UI
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "JobTrack API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowAngularApp");
app.UseAuthorization();
app.MapControllers();

// Ensure Database is created instantly on startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    try
    {
        var context = services.GetRequiredService<JobDbContext>();
        context.Database.EnsureCreated();
        logger.LogInformation("Database initialized successfully. Provider SQL Server: {UseSqlServer}", useSqlServer);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Error initializing database.");
    }
}

app.Run();
