namespace Gamiweb.DTOs;

public class AiTutorAskDto
{
    public string StudentId { get; set; } = string.Empty;
    public string Question { get; set; } = string.Empty;
    public string Language { get; set; } = "en";
}

public class AiTutorResponseDto
{
    public string ConversationId { get; set; } = Guid.NewGuid().ToString();
    public string Answer { get; set; } = string.Empty;
    public List<string> Steps { get; set; } = new();
    public string? Tip { get; set; }
    public int XpAwarded { get; set; } = 15;
    public bool IsCachedOfflineAnswer { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

public class ProgressSummaryDto
{
    public string StudentId { get; set; } = string.Empty;
    public double WeeklyStudyHours { get; set; } = 7.2;
    public int TotalXp { get; set; }
    public int CurrentStreak { get; set; }
    public double AverageAccuracy { get; set; }
    public int QuizzesCompleted { get; set; }
    public List<SubjectMasteryDto> SubjectBreakdown { get; set; } = new();
    public List<DailyStudyMinutesDto> DailyStudyTrend { get; set; } = new();
}

public class SubjectMasteryDto
{
    public string Subject { get; set; } = string.Empty;
    public int AccuracyPercent { get; set; }
    public string Status { get; set; } = "Proficient";
}

public class DailyStudyMinutesDto
{
    public string Day { get; set; } = string.Empty;
    public int Minutes { get; set; }
    public int TargetMinutes { get; set; } = 45;
}

public class RiskPredictionResultDto
{
    public string StudentId { get; set; } = string.Empty;
    public bool IsAtRisk { get; set; }
    public double RiskProbability { get; set; }
    public string RiskLevel { get; set; } = "Low";
    public List<string> RiskFactors { get; set; } = new();
    public List<string> RecommendedInterventions { get; set; } = new();
}

public class ParentChildDto
{
    public string StudentId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Grade { get; set; } = string.Empty;
    public string SchoolName { get; set; } = string.Empty;
    public int XpPoints { get; set; }
    public int Level { get; set; }
    public int StreakCount { get; set; }
    public double AttendanceRate { get; set; } = 100.0;
    public int DailyStudyMinutes { get; set; } = 62;
    public List<string> RecentMilestones { get; set; } = new();
}

public class SendTeacherMessageDto
{
    public string ParentId { get; set; } = string.Empty;
    public string TeacherId { get; set; } = string.Empty;
    public string? StudentId { get; set; }
    public string MessageText { get; set; } = string.Empty;
}

public class TimetableSessionDto
{
    public string Id { get; set; } = string.Empty;
    public string DayOfWeek { get; set; } = "Monday";
    public string Subject { get; set; } = string.Empty;
    public string Topic { get; set; } = string.Empty;
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
    public string Time => $"{StartTime} - {EndTime}";
    public string Room { get; set; } = "Home Study / Offline Tab";
    public string Status { get; set; } = "upcoming";
    public string Color { get; set; } = "bg-blue-500";
    public string BadgeColor { get; set; } = "bg-blue-100 text-blue-800";
    public bool OfflineReady { get; set; } = true;
}

public class CreateTimetableSessionDto
{
    public string StudentId { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Topic { get; set; } = string.Empty;
    public string DayOfWeek { get; set; } = "Monday";
    public string StartTime { get; set; } = "09:00 AM";
    public string EndTime { get; set; } = "09:45 AM";
    public bool OfflineReady { get; set; } = true;
}

public class SyncBatchDto
{
    public string StudentId { get; set; } = string.Empty;
    public List<QuizSubmitDto> OfflineQuizAttempts { get; set; } = new();
    public List<string> DownloadedCourseIds { get; set; } = new();
}

public class SyncResultDto
{
    public int SyncedQuizzesCount { get; set; }
    public int TotalXpAwarded { get; set; }
    public int NewTotalXp { get; set; }
    public int NewLevel { get; set; }
    public string SyncTimestamp { get; set; } = DateTime.UtcNow.ToString("o");
}
