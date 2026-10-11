using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Gamiweb.Data;
using Gamiweb.DTOs;
using Gamiweb.Models;
using Gamiweb.Services;
using System.Security.Claims;

namespace Gamiweb.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IJwtService _jwtService;

    public AuthController(AppDbContext context, IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Register([FromBody] RegisterRequest request)
    {
        if (await _context.Users.AnyAsync(u => u.Email.ToLower() == request.Email.ToLower()))
        {
            return BadRequest(ApiResponse<LoginResponse>.Fail("Email is already registered."));
        }

        var user = new User
        {
            Name = request.Name,
            Email = request.Email.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role,
            PreferredLanguage = request.PreferredLanguage,
            AvatarUrl = $"https://api.dicebear.com/7.x/bottts/svg?seed={Uri.EscapeDataString(request.Name)}"
        };

        _context.Users.Add(user);

        if (request.Role == UserRole.Student)
        {
            _context.StudentProfiles.Add(new StudentProfile
            {
                UserId = user.Id,
                Grade = request.Grade,
                SchoolName = request.SchoolName,
                District = request.District,
                XpPoints = 0,
                Level = 1,
                StreakCount = 1
            });
        }

        await _context.SaveChangesAsync();

        var (token, expiresAt) = _jwtService.GenerateToken(user);

        return Ok(ApiResponse<LoginResponse>.Ok(new LoginResponse
        {
            Token = token,
            ExpiresAt = expiresAt,
            User = new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role.ToString(),
                PreferredLanguage = user.PreferredLanguage,
                AvatarUrl = user.AvatarUrl,
                Grade = request.Grade,
                SchoolName = request.SchoolName,
                District = request.District,
                XpPoints = 0,
                Level = 1,
                StreakCount = 1
            }
        }, "Registration successful"));
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Login([FromBody] LoginRequest request)
    {
        var user = await _context.Users
            .Include(u => u.StudentProfile)
            .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized(ApiResponse<LoginResponse>.Fail("Invalid email or password."));
        }

        var (token, expiresAt) = _jwtService.GenerateToken(user);

        return Ok(ApiResponse<LoginResponse>.Ok(new LoginResponse
        {
            Token = token,
            ExpiresAt = expiresAt,
            User = new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role.ToString(),
                PreferredLanguage = user.PreferredLanguage,
                AvatarUrl = user.AvatarUrl,
                Grade = user.StudentProfile?.Grade,
                SchoolName = user.StudentProfile?.SchoolName,
                District = user.StudentProfile?.District,
                XpPoints = user.StudentProfile?.XpPoints ?? 0,
                Level = user.StudentProfile?.Level ?? 1,
                StreakCount = user.StudentProfile?.StreakCount ?? 0
            }
        }, "Login successful"));
    }

    [HttpPost("logout")]
    public ActionResult<ApiResponse<string>> Logout()
    {
        return Ok(ApiResponse<string>.Ok("Logged out successfully"));
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<ApiResponse<UserDto>>> GetMe()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(ApiResponse<UserDto>.Fail("User identity not found in token."));
        }

        var user = await _context.Users
            .Include(u => u.StudentProfile)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return NotFound(ApiResponse<UserDto>.Fail("User not found."));
        }

        return Ok(ApiResponse<UserDto>.Ok(new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role.ToString(),
            PreferredLanguage = user.PreferredLanguage,
            AvatarUrl = user.AvatarUrl,
            Grade = user.StudentProfile?.Grade,
            SchoolName = user.StudentProfile?.SchoolName,
            District = user.StudentProfile?.District,
            XpPoints = user.StudentProfile?.XpPoints ?? 0,
            Level = user.StudentProfile?.Level ?? 1,
            StreakCount = user.StudentProfile?.StreakCount ?? 0
        }));
    }
}
