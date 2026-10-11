using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gamiweb.Models;

public enum NotificationType
{
    Milestone,
    Report,
    Message,
    Sync
}

[Table("TimetableSessions")]
public class TimetableSession
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string StudentId { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Subject { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Topic { get; set; } = string.Empty;

    [MaxLength(30)]
    public string DayOfWeek { get; set; } = "Monday";

    [MaxLength(50)]
    public string StartTime { get; set; } = "09:00 AM";

    [MaxLength(50)]
    public string EndTime { get; set; } = "09:45 AM";

    [MaxLength(100)]
    public string RoomOrLink { get; set; } = "Home Study / Offline Tab";

    public bool ReminderEnabled { get; set; } = true;

    public bool IsCompleted { get; set; } = false;
}

[Table("AiTutorConversations")]
public class AiTutorConversation
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string StudentId { get; set; } = string.Empty;

    [Required]
    [MaxLength(2000)]
    public string QuestionText { get; set; } = string.Empty;

    [MaxLength(4000)]
    public string AiResponseText { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string StepsJson { get; set; } = "[]";

    [MaxLength(10)]
    public string Language { get; set; } = "en";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

[Table("ProgressReports")]
public class ProgressReport
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string StudentId { get; set; } = string.Empty;

    public DateTime WeekStartDate { get; set; } = DateTime.UtcNow;

    public double StudyHours { get; set; } = 0.0;

    public int QuizzesCompleted { get; set; } = 0;

    public double AvgAccuracy { get; set; } = 0.0;

    [MaxLength(4000)]
    public string SubjectBreakdownJson { get; set; } = "{}";

    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
}

[Table("Notifications")]
public class Notification
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string UserId { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Message { get; set; } = string.Empty;

    public NotificationType Type { get; set; } = NotificationType.Milestone;

    public bool ReadStatus { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey("UserId")]
    public virtual User? User { get; set; }
}

[Table("TeacherMessages")]
public class TeacherMessage
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string SenderId { get; set; } = string.Empty;

    [Required]
    public string ReceiverId { get; set; } = string.Empty;

    public string? StudentId { get; set; }

    [Required]
    [MaxLength(2000)]
    public string MessageText { get; set; } = string.Empty;

    public DateTime SentAt { get; set; } = DateTime.UtcNow;

    [ForeignKey("SenderId")]
    public virtual User? Sender { get; set; }

    [ForeignKey("ReceiverId")]
    public virtual User? Receiver { get; set; }
}
