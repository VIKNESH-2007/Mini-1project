using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gamiweb.Models;

public enum EnrollmentStatus
{
    InProgress,
    Completed
}

[Table("Courses")]
public class Course
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Subject { get; set; } = "General";

    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(10)]
    public string Language { get; set; } = "en";

    [MaxLength(50)]
    public string DifficultyLevel { get; set; } = "Beginner";

    [MaxLength(80)]
    public string Grade { get; set; } = "Class 6-8";

    [MaxLength(500)]
    public string ThumbnailUrl { get; set; } = string.Empty;

    [MaxLength(500)]
    public string VideoUrl { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Instructor { get; set; } = string.Empty;

    public double DownloadableSizeMb { get; set; } = 15.0;

    public double Rating { get; set; } = 4.8;

    public int StudentsCount { get; set; } = 0;

    [MaxLength(4000)]
    public string AiSummaryText { get; set; } = string.Empty;

    [MaxLength(4000)]
    public string AiKeyPointsJson { get; set; } = "[]";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public virtual ICollection<CourseModule> Modules { get; set; } = new List<CourseModule>();
    public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}

[Table("CourseModules")]
public class CourseModule
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string CourseId { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public int SequenceOrder { get; set; } = 1;

    [MaxLength(500)]
    public string VideoUrl { get; set; } = string.Empty;

    [MaxLength(30)]
    public string DurationMinutes { get; set; } = "10:00";

    [MaxLength(500)]
    public string CaptionsUrl { get; set; } = string.Empty;

    [MaxLength(500)]
    public string SignLanguageVideoUrl { get; set; } = string.Empty;

    [ForeignKey("CourseId")]
    public virtual Course? Course { get; set; }
}

[Table("Enrollments")]
public class Enrollment
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string StudentId { get; set; } = string.Empty;

    [Required]
    public string CourseId { get; set; } = string.Empty;

    public int ProgressPercent { get; set; } = 0;

    public EnrollmentStatus Status { get; set; } = EnrollmentStatus.InProgress;

    public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;

    public DateTime? CompletedAt { get; set; }

    [ForeignKey("CourseId")]
    public virtual Course? Course { get; set; }
}

[Table("DownloadedContents")]
public class DownloadedContent
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string StudentId { get; set; } = string.Empty;

    [Required]
    public string CourseId { get; set; } = string.Empty;

    public DateTime DownloadedAt { get; set; } = DateTime.UtcNow;

    [MaxLength(50)]
    public string SyncStatus { get; set; } = "CachedOffline";
}
