using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gamiweb.Models;

[Table("Quizzes")]
public class Quiz
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public string? CourseId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Difficulty { get; set; } = "Medium";

    [MaxLength(100)]
    public string Subject { get; set; } = "General";

    public int TimeLimitSeconds { get; set; } = 60;

    public int TotalXp { get; set; } = 100;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public virtual ICollection<QuizQuestion> Questions { get; set; } = new List<QuizQuestion>();
    public virtual ICollection<QuizAttempt> Attempts { get; set; } = new List<QuizAttempt>();
}

[Table("QuizQuestions")]
public class QuizQuestion
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string QuizId { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string QuestionText { get; set; } = string.Empty;

    [Required]
    [MaxLength(2000)]
    public string OptionsJson { get; set; } = "[]";

    public int CorrectOption { get; set; } = 0;

    [MaxLength(1000)]
    public string ExplanationText { get; set; } = string.Empty;

    [MaxLength(500)]
    public string HintText { get; set; } = string.Empty;

    public int XpValue { get; set; } = 25;

    [MaxLength(10)]
    public string Language { get; set; } = "en";

    [ForeignKey("QuizId")]
    public virtual Quiz? Quiz { get; set; }
}

[Table("QuizAttempts")]
public class QuizAttempt
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string StudentId { get; set; } = string.Empty;

    [Required]
    public string QuizId { get; set; } = string.Empty;

    public int Score { get; set; } = 0;

    public int TotalQuestions { get; set; } = 0;

    public double AccuracyPercent { get; set; } = 0.0;

    public int XpEarned { get; set; } = 0;

    public bool IsOfflineSynced { get; set; } = false;

    public DateTime AttemptedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey("QuizId")]
    public virtual Quiz? Quiz { get; set; }
    public virtual ICollection<QuizAnswer> Answers { get; set; } = new List<QuizAnswer>();
}

[Table("QuizAnswers")]
public class QuizAnswer
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string AttemptId { get; set; } = string.Empty;

    [Required]
    public string QuestionId { get; set; } = string.Empty;

    public int SelectedOption { get; set; }

    public bool IsCorrect { get; set; }

    [ForeignKey("AttemptId")]
    public virtual QuizAttempt? Attempt { get; set; }

    [ForeignKey("QuestionId")]
    public virtual QuizQuestion? Question { get; set; }
}
