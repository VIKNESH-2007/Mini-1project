namespace Gamiweb.DTOs;

public class StudentTaskDto
{
    public string Id { get; set; } = string.Empty;
    public string StudentId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public int EstimatedMinutes { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool ReminderEnabled { get; set; }
}

public class CreateStudentTaskDto
{
    public string StudentId { get; set; } = "usr-student-01";
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Subject { get; set; } = "Computer Science";
    public string Category { get; set; } = "Coding Lab";
    public string Priority { get; set; } = "Medium";
    public DateTime? DueDate { get; set; }
    public int EstimatedMinutes { get; set; } = 45;
    public bool ReminderEnabled { get; set; } = true;
}

public class UpdateStudentTaskDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Subject { get; set; }
    public string? Category { get; set; }
    public string? Priority { get; set; }
    public DateTime? DueDate { get; set; }
    public int? EstimatedMinutes { get; set; }
    public bool? IsCompleted { get; set; }
    public bool? ReminderEnabled { get; set; }
}

public class TaskProgressSummaryDto
{
    public int TotalTasks { get; set; }
    public int CompletedTasks { get; set; }
    public int PendingTasks { get; set; }
    public int OverdueTasks { get; set; }
    public double CompletionRatePercent { get; set; }
    public int TotalEstimatedMinutes { get; set; }
    public int CompletedMinutes { get; set; }
    public List<SubjectTaskProgressDto> SubjectProgress { get; set; } = new();
    public List<CategoryTaskCountDto> CategoryCounts { get; set; } = new();
}

public class SubjectTaskProgressDto
{
    public string Subject { get; set; } = string.Empty;
    public int Total { get; set; }
    public int Completed { get; set; }
    public double ProgressPercent { get; set; }
}

public class CategoryTaskCountDto
{
    public string Category { get; set; } = string.Empty;
    public int Count { get; set; }
}
