using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Gamiweb.Models;
using Microsoft.IdentityModel.Tokens;

namespace Gamiweb.Services;

public interface IJwtService
{
    (string Token, DateTime ExpiresAt) GenerateToken(User user);
}

public class JwtService : IJwtService
{
    private readonly IConfiguration _configuration;

    public JwtService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public (string Token, DateTime ExpiresAt) GenerateToken(User user)
    {
        var secretKey = _configuration["Jwt:Key"] ?? "RuralGamiLearnSuperSecretKey2026!MustBeVeryLong32Chars";
        var issuer = _configuration["Jwt:Issuer"] ?? "GamiwebApi";
        var audience = _configuration["Jwt:Audience"] ?? "GamiwebApp";
        var expiryHours = int.TryParse(_configuration["Jwt:ExpiryHours"], out var h) ? h : 72;

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expiresAt = DateTime.UtcNow.AddHours(expiryHours);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new(ClaimTypes.Name, user.Name),
            new(ClaimTypes.Role, user.Role.ToString()),
            new("preferred_language", user.PreferredLanguage)
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = expiresAt,
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = credentials
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return (tokenHandler.WriteToken(token), expiresAt);
    }
}
