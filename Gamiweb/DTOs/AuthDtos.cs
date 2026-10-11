using System.ComponentModel.DataAnnotations;
using Gamiweb.Models;

namespace Gamiweb.DTOs;

public class RegisterRequest
{
    [Required, MaxLength(120)]
    public string Name { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    public UserRole Role { get; set; } = UserRole.Student;

    public string PreferredLanguage { get; set; } = "en";

    public string Grade { get; set; } = "Class 8";
    public string SchoolName { get; set; } = "Rural High School";
    public string District { get; set; } = "Village Cluster";
}

public class LoginRequest
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    public UserRole? PreferredRole { get; set; }
}

public class UserDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string PreferredLanguage { get; set; } = "en";
    public string AvatarUrl { get; set; } = string.Empty;
    public string? Grade { get; set; }
    public string? SchoolName { get; set; }
    public string? District { get; set; }
    public int XpPoints { get; set; }
    public int Level { get; set; }
    public int StreakCount { get; set; }
}

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public UserDto User { get; set; } = new();
}
