using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gamiweb.Models;

public enum LeaderboardPeriod
{
    Weekly,
    Monthly,
    AllTime
}

[Table("Badges")]
public class Badge
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Category { get; set; } = "General";

    [MaxLength(20)]
    public string IconEmoji { get; set; } = "🏆";

    [MaxLength(50)]
    public string Rarity { get; set; } = "Common";

    public int XpReward { get; set; } = 100;

    [MaxLength(100)]
    public string RequirementType { get; set; } = "Streak";

    public int RequirementValue { get; set; } = 7;
}

[Table("StudentBadges")]
public class StudentBadge
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string StudentId { get; set; } = string.Empty;

    [Required]
    public string BadgeId { get; set; } = string.Empty;

    public DateTime EarnedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey("BadgeId")]
    public virtual Badge? Badge { get; set; }
}

[Table("LeaderboardSnapshots")]
public class LeaderboardSnapshot
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string StudentId { get; set; } = string.Empty;

    [MaxLength(120)]
    public string StudentName { get; set; } = string.Empty;

    [MaxLength(160)]
    public string SchoolName { get; set; } = string.Empty;

    [MaxLength(120)]
    public string District { get; set; } = string.Empty;

    public int XpPoints { get; set; } = 0;

    public int Rank { get; set; } = 0;

    public int Streak { get; set; } = 0;

    public int Level { get; set; } = 1;

    [MaxLength(500)]
    public string AvatarUrl { get; set; } = string.Empty;

    public LeaderboardPeriod Period { get; set; } = LeaderboardPeriod.Weekly;

    public DateTime SnapshotDate { get; set; } = DateTime.UtcNow;
}
