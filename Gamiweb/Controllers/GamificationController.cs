using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Gamiweb.Data;
using Gamiweb.DTOs;
using Gamiweb.Models;
using Gamiweb.Services;

namespace Gamiweb.Controllers;

[ApiController]
public class GamificationController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IXpService _xpService;
    private readonly IBadgeService _badgeService;

    public GamificationController(AppDbContext context, IXpService xpService, IBadgeService badgeService)
    {
        _context = context;
        _xpService = xpService;
        _badgeService = badgeService;
    }

    [HttpPost("api/v1/gamification/award-xp")]
    public async Task<ActionResult<ApiResponse<object>>> AwardXp([FromBody] AwardXpDto request)
    {
        var (newXp, newLevel, leveledUp) = await _xpService.AwardXpAsync(request.StudentId, request.Points, request.Reason);
        await _badgeService.CheckAndAwardBadgesAsync(request.StudentId);

        return Ok(ApiResponse<object>.Ok(new
        {
            studentId = request.StudentId,
            xpAdded = request.Points,
            totalXp = newXp,
            level = newLevel,
            leveledUp
        }, "XP awarded successfully"));
    }

    [HttpGet("api/v1/gamification/badges/{studentId}")]
    public async Task<ActionResult<ApiResponse<List<BadgeDto>>>> GetBadges(string studentId)
    {
        var badges = await _badgeService.GetBadgesForStudentAsync(studentId);
        return Ok(ApiResponse<List<BadgeDto>>.Ok(badges));
    }

    [HttpGet("api/v1/leaderboard")]
    public async Task<ActionResult<ApiResponse<List<LeaderboardEntryDto>>>> GetLeaderboard(
        [FromQuery] string period = "weekly",
        [FromQuery] string? currentStudentId = null)
    {
        var periodEnum = period.ToLower() switch
        {
            "monthly" => LeaderboardPeriod.Monthly,
            "all_time" or "alltime" => LeaderboardPeriod.AllTime,
            _ => LeaderboardPeriod.Weekly
        };

        var snapshots = await _context.LeaderboardSnapshots
            .Where(ls => ls.Period == periodEnum)
            .OrderBy(ls => ls.Rank)
            .Take(20)
            .ToListAsync();

        var result = snapshots.Select(s => new LeaderboardEntryDto
        {
            Rank = s.Rank,
            StudentId = s.StudentId,
            Name = s.StudentName,
            School = s.SchoolName,
            Village = s.District,
            Xp = s.XpPoints,
            Streak = s.Streak,
            Level = s.Level,
            Avatar = s.AvatarUrl,
            Badge = s.Rank == 1 ? "Village Scholar" : s.Rank == 2 ? "Science Champion" : s.Rank == 3 ? "Quiz Wizard" : "Rising Star",
            IsCurrentUser = !string.IsNullOrEmpty(currentStudentId) && s.StudentId == currentStudentId
        }).ToList();

        return Ok(ApiResponse<List<LeaderboardEntryDto>>.Ok(result));
    }
}
