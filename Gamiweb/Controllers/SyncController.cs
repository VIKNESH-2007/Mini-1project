using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Gamiweb.Data;
using Gamiweb.DTOs;
using Gamiweb.Models;
using Gamiweb.Services;

namespace Gamiweb.Controllers;

[ApiController]
[Route("api/v1/sync")]
public class SyncController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IXpService _xpService;
    private readonly IBadgeService _badgeService;

    public SyncController(AppDbContext context, IXpService xpService, IBadgeService badgeService)
    {
        _context = context;
        _xpService = xpService;
        _badgeService = badgeService;
    }

    [HttpGet("pending/{studentId}")]
    public async Task<ActionResult<ApiResponse<object>>> GetPendingStatus(string studentId)
    {
        var unsyncedQuizzes = await _context.QuizAttempts
            .Where(qa => qa.StudentId == studentId && qa.IsOfflineSynced)
            .CountAsync();

        var downloadedPacks = await _context.DownloadedContents
            .Where(dc => dc.StudentId == studentId)
            .CountAsync();

        return Ok(ApiResponse<object>.Ok(new
        {
            studentId,
            offlineQuizzesSyncedCount = unsyncedQuizzes,
            downloadedPacksCount = downloadedPacks,
            lastSyncTimestamp = DateTime.UtcNow.ToString("o")
        }));
    }

    [HttpPost("upload")]
    public async Task<ActionResult<ApiResponse<SyncResultDto>>> UploadOfflineBatch([FromBody] SyncBatchDto batch)
    {
        int totalXpAwarded = 0;
        int syncedQuizzes = 0;

        foreach (var quizAttemptDto in batch.OfflineQuizAttempts)
        {
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                .FirstOrDefaultAsync(q => q.Id == quizAttemptDto.StudentId || q.Questions.Any());

            if (quiz != null)
            {
                int score = 0;
                int xpEarned = 0;

                var attempt = new QuizAttempt
                {
                    StudentId = batch.StudentId,
                    QuizId = quiz.Id,
                    TotalQuestions = quiz.Questions.Count,
                    IsOfflineSynced = true,
                    AttemptedAt = DateTime.UtcNow
                };

                foreach (var q in quiz.Questions)
                {
                    var userAns = quizAttemptDto.Answers.FirstOrDefault(a => a.QuestionId == q.Id);
                    int selected = userAns?.SelectedOption ?? -1;
                    bool isCorrect = selected == q.CorrectOption;
                    if (isCorrect)
                    {
                        score++;
                        xpEarned += q.XpValue;
                    }

                    attempt.Answers.Add(new QuizAnswer
                    {
                        QuestionId = q.Id,
                        SelectedOption = selected,
                        IsCorrect = isCorrect
                    });
                }

                attempt.Score = score;
                attempt.AccuracyPercent = quiz.Questions.Count > 0 ? (score / (double)quiz.Questions.Count) * 100 : 0;
                attempt.XpEarned = xpEarned;

                _context.QuizAttempts.Add(attempt);
                totalXpAwarded += xpEarned;
                syncedQuizzes++;
            }
        }

        // Cache any new downloaded course ids reported
        foreach (var courseId in batch.DownloadedCourseIds)
        {
            if (!await _context.DownloadedContents.AnyAsync(dc => dc.StudentId == batch.StudentId && dc.CourseId == courseId))
            {
                _context.DownloadedContents.Add(new DownloadedContent
                {
                    StudentId = batch.StudentId,
                    CourseId = courseId,
                    DownloadedAt = DateTime.UtcNow,
                    SyncStatus = "CachedOffline"
                });
            }
        }

        await _context.SaveChangesAsync();

        var (newXp, newLevel, _) = await _xpService.AwardXpAsync(batch.StudentId, totalXpAwarded, "Offline Synced Lessons");
        await _xpService.UpdateStreakAsync(batch.StudentId);
        await _badgeService.CheckAndAwardBadgesAsync(batch.StudentId);

        var result = new SyncResultDto
        {
            SyncedQuizzesCount = syncedQuizzes,
            TotalXpAwarded = totalXpAwarded,
            NewTotalXp = newXp,
            NewLevel = newLevel,
            SyncTimestamp = DateTime.UtcNow.ToString("o")
        };

        return Ok(ApiResponse<SyncResultDto>.Ok(result, "Offline data synced successfully with cloud server"));
    }
}
