using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Gamiweb.Data;
using Gamiweb.DTOs;
using Gamiweb.Models;
using Gamiweb.Services;
using System.Text.Json;

namespace Gamiweb.Controllers;

[ApiController]
[Route("api/v1/quizzes")]
public class QuizzesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IXpService _xpService;
    private readonly IBadgeService _badgeService;

    public QuizzesController(AppDbContext context, IXpService xpService, IBadgeService badgeService)
    {
        _context = context;
        _xpService = xpService;
        _badgeService = badgeService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<QuizDto>>>> GetQuizzes([FromQuery] string? subject)
    {
        var query = _context.Quizzes.Include(q => q.Questions).AsQueryable();

        if (!string.IsNullOrEmpty(subject))
        {
            query = query.Where(q => q.Subject == subject);
        }

        var quizzes = await query.ToListAsync();

        var dtos = quizzes.Select(q => new QuizDto
        {
            Id = q.Id,
            CourseId = q.CourseId,
            Title = q.Title,
            Difficulty = q.Difficulty,
            Subject = q.Subject,
            TimeLimitSeconds = q.TimeLimitSeconds,
            TotalXp = q.TotalXp,
            TotalQuestions = q.Questions.Count
        }).ToList();

        return Ok(ApiResponse<List<QuizDto>>.Ok(dtos));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<QuizDto>>> GetQuizById(string id)
    {
        var quiz = await _context.Quizzes
            .Include(q => q.Questions)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (quiz == null)
        {
            return NotFound(ApiResponse<QuizDto>.Fail("Quiz not found."));
        }

        var questionDtos = quiz.Questions.Select(q => new QuizQuestionDto
        {
            Id = q.Id,
            QuestionText = q.QuestionText,
            Options = JsonSerializer.Deserialize<List<string>>(q.OptionsJson) ?? new(),
            HintText = q.HintText,
            XpValue = q.XpValue
            // CorrectOption and ExplanationText are purposely null during question delivery
        }).ToList();

        var dto = new QuizDto
        {
            Id = quiz.Id,
            CourseId = quiz.CourseId,
            Title = quiz.Title,
            Difficulty = quiz.Difficulty,
            Subject = quiz.Subject,
            TimeLimitSeconds = quiz.TimeLimitSeconds,
            TotalXp = quiz.TotalXp,
            TotalQuestions = quiz.Questions.Count,
            Questions = questionDtos
        };

        return Ok(ApiResponse<QuizDto>.Ok(dto));
    }

    [HttpPost("{id}/submit")]
    public async Task<ActionResult<ApiResponse<QuizResultDto>>> SubmitQuiz(string id, [FromBody] QuizSubmitDto submission)
    {
        var quiz = await _context.Quizzes
            .Include(q => q.Questions)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (quiz == null)
        {
            return NotFound(ApiResponse<QuizResultDto>.Fail("Quiz not found."));
        }

        int score = 0;
        int totalXpEarned = 0;
        var details = new List<QuestionResultDetail>();

        var attempt = new QuizAttempt
        {
            StudentId = submission.StudentId,
            QuizId = id,
            TotalQuestions = quiz.Questions.Count,
            IsOfflineSynced = submission.IsOfflineSynced,
            AttemptedAt = DateTime.UtcNow
        };

        foreach (var q in quiz.Questions)
        {
            var userAns = submission.Answers.FirstOrDefault(a => a.QuestionId == q.Id);
            int selected = userAns?.SelectedOption ?? -1;
            bool isCorrect = selected == q.CorrectOption;

            if (isCorrect)
            {
                score++;
                totalXpEarned += q.XpValue;
            }

            attempt.Answers.Add(new QuizAnswer
            {
                QuestionId = q.Id,
                SelectedOption = selected,
                IsCorrect = isCorrect
            });

            details.Add(new QuestionResultDetail
            {
                QuestionId = q.Id,
                QuestionText = q.QuestionText,
                SelectedOption = selected,
                CorrectOption = q.CorrectOption,
                IsCorrect = isCorrect,
                Explanation = q.ExplanationText,
                XpAwarded = isCorrect ? q.XpValue : 0
            });
        }

        attempt.Score = score;
        attempt.AccuracyPercent = quiz.Questions.Count > 0 ? (score / (double)quiz.Questions.Count) * 100 : 0;
        attempt.XpEarned = totalXpEarned;

        _context.QuizAttempts.Add(attempt);
        await _context.SaveChangesAsync();

        // Award XP and check for level-ups/badges
        var (newXp, newLevel, _) = await _xpService.AwardXpAsync(submission.StudentId, totalXpEarned, quiz.Title);
        int streak = await _xpService.UpdateStreakAsync(submission.StudentId);
        await _badgeService.CheckAndAwardBadgesAsync(submission.StudentId);

        var result = new QuizResultDto
        {
            AttemptId = attempt.Id,
            Score = score,
            TotalQuestions = quiz.Questions.Count,
            AccuracyPercent = Math.Round(attempt.AccuracyPercent, 1),
            XpEarned = totalXpEarned,
            CurrentTotalXp = newXp,
            CurrentLevel = newLevel,
            CurrentStreak = streak,
            Details = details
        };

        return Ok(ApiResponse<QuizResultDto>.Ok(result, "Quiz evaluated successfully"));
    }

    [HttpGet("attempts/{studentId}")]
    public async Task<ActionResult<ApiResponse<List<object>>>> GetStudentAttempts(string studentId)
    {
        var attempts = await _context.QuizAttempts
            .Include(qa => qa.Quiz)
            .Where(qa => qa.StudentId == studentId)
            .OrderByDescending(qa => qa.AttemptedAt)
            .Select(qa => new
            {
                qa.Id,
                QuizTitle = qa.Quiz != null ? qa.Quiz.Title : "Daily Quiz",
                qa.Score,
                qa.TotalQuestions,
                qa.AccuracyPercent,
                qa.XpEarned,
                qa.IsOfflineSynced,
                qa.AttemptedAt
            })
            .ToListAsync();

        return Ok(ApiResponse<List<object>>.Ok(attempts.Cast<object>().ToList()));
    }
}
