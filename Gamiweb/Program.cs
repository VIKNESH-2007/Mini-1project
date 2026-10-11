using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Gamiweb.Data;
using Gamiweb.Middleware;
using Gamiweb.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Database Configuration (MySQL with In-Memory fallback for agile development)
var useInMemory = builder.Configuration.GetValue<bool>("UseInMemoryDb", false);
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (useInMemory || string.IsNullOrEmpty(connectionString))
    {
        options.UseInMemoryDatabase("GamiwebDb");
    }
    else
    {
        try
        {
            var serverVersion = new MySqlServerVersion(new Version(8, 0, 36));
            options.UseMySql(connectionString, serverVersion, mySqlOptions =>
            {
                mySqlOptions.EnableRetryOnFailure(
                    maxRetryCount: 3,
                    maxRetryDelay: TimeSpan.FromSeconds(5),
                    errorNumbersToAdd: null);
            });
        }
        catch
        {
            // Resilient fallback to InMemory database if MySQL server is not locally running
            options.UseInMemoryDatabase("GamiwebDb");
        }
    }
});

// 2. Add Business Logic Services & Typed HttpClients
builder.Services.AddHttpClient();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IXpService, XpService>();
builder.Services.AddScoped<IBadgeService, BadgeService>();
builder.Services.AddScoped<IMlPredictionService, MlPredictionService>();
builder.Services.AddScoped<IAiTutorService, AiTutorService>();
builder.Services.AddScoped<IAiSummarizerService, AiSummarizerService>();
builder.Services.AddScoped<IRecommendationService, RecommendationService>();

// 3. Configure JWT Authentication & Roles
var jwtKey = builder.Configuration["Jwt:Key"] ?? "RuralGamiLearnSuperSecretKey2026!MustBeVeryLong32Chars!";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "GamiwebApi";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "GamiwebApp";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("StudentOnly", policy => policy.RequireRole("Student"));
    options.AddPolicy("ParentOnly", policy => policy.RequireRole("Parent"));
    options.AddPolicy("TeacherOnly", policy => policy.RequireRole("Teacher"));
});

// 4. Configure CORS for React JS frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",
                "http://localhost:5173",
                "http://127.0.0.1:3000"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// 5. Add Controllers & Swagger OpenAPI with JWT Bearer UI
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "GamiLearn Rural Platform API",
        Version = "v1",
        Description = "ASP.NET Core Web API for gamified, offline-capable, multilingual rural education with AI tutoring and ML performance prediction."
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and your token.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// 6. Seed Database on Startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await SeedData.InitializeAsync(context);
}

// 7. Configure Middleware Pipeline
app.UseMiddleware<GlobalExceptionMiddleware>();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "GamiLearn API v1");
    c.RoutePrefix = "swagger";
    c.DefaultModelsExpandDepth(-1); // Completely hides schemas section from pre-rendering
    c.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None); // Collapses all endpoints initially
    c.EnableValidator(null); // Disables external network call to validator.swagger.io (fixes offline/slow internet freeze)
    c.DisplayRequestDuration();
});

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
