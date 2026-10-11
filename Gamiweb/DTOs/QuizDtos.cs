namespace Gamiweb.DTOs;

public class QuizDto
{
    public string Id { get; set; } = string.Empty;
    public string? CourseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Difficulty { get; set; } = "Medium";
    public string Subject { get; set; } = "General";
    public int TimeLimitSeconds { get; set; }
    public int TotalXp { get; set; }
    public int TotalQuestions { get; set; }
    public List<QuizQuestionDto> Questions { get; set; } = new();
}

public class QuizQuestionDto
{
    public string Id { get; set; } = string.Empty;
    public string QuestionText { get; set; } = string.Empty;
    public List<string> Options { get; set; } = new();
    public string HintText { get; set; } = string.Empty;
    public int XpValue { get; set; }
    // Note: CorrectOption and ExplanationText are excluded during active quiz attempt
    public string? ExplanationText { get; set; }
    public int? CorrectOption { get; set; }
}

public class QuizAnswerSubmission
{
    public string QuestionId { get; set; } = string.Empty;
    public int SelectedOption { get; set; }
}

public class QuizSubmitDto
{
    public string StudentId { get; set; } = string.Empty;
    public List<QuizAnswerSubmission> Answers { get; set; } = new();
    public bool IsOfflineSynced { get; set; } = false;
}

public class QuestionResultDetail
{
    public string QuestionId { get; set; } = string.Empty;
    public string QuestionText { get; set; } = string.Empty;
    public int SelectedOption { get; set; }
    public int CorrectOption { get; set; }
    public bool IsCorrect { get; set; }
    public string Explanation { get; set; } = string.Empty;
    public int XpAwarded { get; set; }
}

public class QuizResultDto
{
    public string AttemptId { get; set; } = Guid.NewGuid().ToString();
    public int Score { get; set; }
    public int TotalQuestions { get; set; }
    public double AccuracyPercent { get; set; }
    public int XpEarned { get; set; }
    public int CurrentTotalXp { get; set; }
    public int CurrentLevel { get; set; }
    public int CurrentStreak { get; set; }
    public List<QuestionResultDetail> Details { get; set; } = new();
}

public class AwardXpDto
{
    public string StudentId { get; set; } = string.Empty;
    public int Points { get; set; }
    public string Reason { get; set; } = string.Empty;
}

public class BadgeDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Icon { get; set; } = "🏆";
    public string Rarity { get; set; } = "Common";
    public int XpReward { get; set; }
    public bool Unlocked { get; set; }
    public string? UnlockedDate { get; set; }
    public string? Progress { get; set; }
}

public class LeaderboardEntryDto
{
    public int Rank { get; set; }
    public string StudentId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string School { get; set; } = string.Empty;
    public string Village { get; set; } = string.Empty;
    public int Xp { get; set; }
    public int Streak { get; set; }
    public int Level { get; set; }
    public string Avatar { get; set; } = string.Empty;
    public string Badge { get; set; } = "Scholar";
    public bool IsCurrentUser { get; set; }
}
