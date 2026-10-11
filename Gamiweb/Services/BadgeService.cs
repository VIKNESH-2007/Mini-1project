using Microsoft.EntityFrameworkCore;
using Gamiweb.Data;
using Gamiweb.DTOs;
using Gamiweb.Models;

namespace Gamiweb.Services;

public interface IBadgeService
{
    Task<List<BadgeDto>> GetBadgesForStudentAsync(string studentId);
    Task CheckAndAwardBadgesAsync(string studentId);
}

public class BadgeService : IBadgeService
{
    private readonly AppDbContext _context;

    public BadgeService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<BadgeDto>> GetBadgesForStudentAsync(string studentId)
    {
        var allBadges = await _context.Badges.ToListAsync();
        var earnedBadges = await _context.StudentBadges
            .Where(sb => sb.StudentId == studentId)
            .ToDictionaryAsync(sb => sb.BadgeId, sb => sb.EarnedAt);

        var profile = await _context.StudentProfiles.FirstOrDefaultAsync(sp => sp.UserId == studentId);

        return allBadges.Select(b =>
        {
            bool isUnlocked = earnedBadges.ContainsKey(b.Id);
            string? earnedDate = isUnlocked ? earnedBadges[b.Id].ToString("MMM dd, yyyy") : null;
            string? progress = null;

            if (!isUnlocked && profile != null)
            {
                if (b.RequirementType == "Streak")
                    progress = $"{profile.StreakCount}/{b.RequirementValue} days";
                else if (b.RequirementType == "XP")
                    progress = $"{profile.XpPoints}/{b.RequirementValue} XP";
            }

            return new BadgeDto
            {
                Id = b.Id,
                Title = b.Name,
                Description = b.Description,
                Category = b.Category,
                Icon = b.IconEmoji,
                Rarity = b.Rarity,
                XpReward = b.XpReward,
                Unlocked = isUnlocked,
                UnlockedDate = earnedDate,
                Progress = progress
            };
        }).ToList();
    }

    public async Task CheckAndAwardBadgesAsync(string studentId)
    {
        var profile = await _context.StudentProfiles.FirstOrDefaultAsync(sp => sp.UserId == studentId);
        if (profile == null) return;

        var earnedBadgeIds = await _context.StudentBadges
            .Where(sb => sb.StudentId == studentId)
            .Select(sb => sb.BadgeId)
            .ToListAsync();

        var unearnedBadges = await _context.Badges
            .Where(b => !earnedBadgeIds.Contains(b.Id))
            .ToListAsync();

        foreach (var badge in unearnedBadges)
        {
            bool shouldAward = false;

            if (badge.RequirementType == "Streak" && profile.StreakCount >= badge.RequirementValue)
                shouldAward = true;
            else if (badge.RequirementType == "XP" && profile.XpPoints >= badge.RequirementValue)
                shouldAward = true;

            if (shouldAward)
            {
                _context.StudentBadges.Add(new StudentBadge
                {
                    StudentId = studentId,
                    BadgeId = badge.Id,
                    EarnedAt = DateTime.UtcNow
                });

                _context.Notifications.Add(new Notification
                {
                    UserId = studentId,
                    Title = $"New Badge Unlocked: {badge.Name}!",
                    Message = badge.Description,
                    Type = NotificationType.Milestone
                });
            }
        }

        await _context.SaveChangesAsync();
    }
}
