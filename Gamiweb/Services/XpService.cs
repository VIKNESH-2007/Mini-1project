using Microsoft.EntityFrameworkCore;
using Gamiweb.Data;
using Gamiweb.Models;

namespace Gamiweb.Services;

public interface IXpService
{
    Task<(int NewXp, int NewLevel, bool LeveledUp)> AwardXpAsync(string studentId, int points, string reason);
    Task<int> UpdateStreakAsync(string studentId);
}

public class XpService : IXpService
{
    private readonly AppDbContext _context;

    public XpService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<(int NewXp, int NewLevel, bool LeveledUp)> AwardXpAsync(string studentId, int points, string reason)
    {
        var profile = await _context.StudentProfiles.FirstOrDefaultAsync(sp => sp.UserId == studentId);
        if (profile == null)
        {
            // If profile doesn't exist, create default
            profile = new StudentProfile
            {
                UserId = studentId,
                XpPoints = 0,
                Level = 1,
                StreakCount = 1,
                LastActiveDate = DateTime.UtcNow
            };
            _context.StudentProfiles.Add(profile);
        }

        int previousLevel = profile.Level;
        profile.XpPoints += points;
        
        // Level threshold is 150 XP per level
        profile.Level = (profile.XpPoints / 150) + 1;
        profile.LastActiveDate = DateTime.UtcNow;

        bool leveledUp = profile.Level > previousLevel;

        if (leveledUp)
        {
            _context.Notifications.Add(new Notification
            {
                UserId = studentId,
                Title = $"Level Up! Reached Level {profile.Level}! 🏆",
                Message = $"Great work! You reached Level {profile.Level} by mastering {reason}.",
                Type = NotificationType.Milestone
            });
        }

        await _context.SaveChangesAsync();
        return (profile.XpPoints, profile.Level, leveledUp);
    }

    public async Task<int> UpdateStreakAsync(string studentId)
    {
        var profile = await _context.StudentProfiles.FirstOrDefaultAsync(sp => sp.UserId == studentId);
        if (profile == null) return 1;

        var now = DateTime.UtcNow;
        var diffDays = (now.Date - profile.LastActiveDate.Date).Days;

        if (diffDays == 1)
        {
            profile.StreakCount += 1;
        }
        else if (diffDays > 1)
        {
            profile.StreakCount = 1;
        }

        profile.LastActiveDate = now;
        await _context.SaveChangesAsync();
        return profile.StreakCount;
    }
}
