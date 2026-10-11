namespace Gamiweb.DTOs;

public class CourseDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Language { get; set; } = "en";
    public string DifficultyLevel { get; set; } = "Beginner";
    public string Grade { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public string VideoUrl { get; set; } = string.Empty;
    public string Instructor { get; set; } = string.Empty;
    public double DownloadableSizeMb { get; set; }
    public double Rating { get; set; }
    public int StudentsCount { get; set; }
    public int ProgressPercent { get; set; }
    public bool IsDownloaded { get; set; }
    public int TotalLessons { get; set; }
    public string AiSummaryText { get; set; } = string.Empty;
    public List<string> AiKeyPoints { get; set; } = new();
    public List<CourseModuleDto> Modules { get; set; } = new();
}

public class CourseModuleDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public int SequenceOrder { get; set; }
    public string VideoUrl { get; set; } = string.Empty;
    public string DurationMinutes { get; set; } = string.Empty;
    public string CaptionsUrl { get; set; } = string.Empty;
    public string SignLanguageVideoUrl { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
}

public class CourseProgressUpdateDto
{
    public int ProgressPercent { get; set; }
    public string? CompletedModuleId { get; set; }
}

public class StudentDashboardDto
{
    public string StudentId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string SchoolName { get; set; } = string.Empty;
    public string Grade { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public int XpPoints { get; set; }
    public int Level { get; set; }
    public int LevelProgressPercent { get; set; }
    public int StreakCount { get; set; }
    public int DownloadedCoursesCount { get; set; }
    public CourseDto? ContinueCourse { get; set; }
    public List<TimetableSessionDto> TodayTimetable { get; set; } = new();
    public List<BadgeDto> RecentBadges { get; set; } = new();
    public List<CourseDto> RecommendedCourses { get; set; } = new();
}
