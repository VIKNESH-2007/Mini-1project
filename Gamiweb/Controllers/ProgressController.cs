using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Gamiweb.Data;
using Gamiweb.DTOs;
using Gamiweb.Services;
using System.Text;

namespace Gamiweb.Controllers;

[ApiController]
public class ProgressController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMlPredictionService _mlService;

    public ProgressController(AppDbContext context, IMlPredictionService mlService)
    {
        _context = context;
        _mlService = mlService;
    }

    [HttpGet("api/v1/progress/{studentId}")]
    public async Task<ActionResult<ApiResponse<ProgressSummaryDto>>> GetProgress(string studentId)
    {
        var profile = await _context.StudentProfiles.FirstOrDefaultAsync(sp => sp.UserId == studentId);
        var attempts = await _context.QuizAttempts.Where(qa => qa.StudentId == studentId).ToListAsync();

        double avgAccuracy = attempts.Any() ? Math.Round(attempts.Average(a => a.AccuracyPercent), 1) : 86.4;

        var breakdown = new List<SubjectMasteryDto>
        {
            new() { Subject = "Computer Science (C++)", AccuracyPercent = 92, Status = "Mastery" },
            new() { Subject = "Software Engineering (Java)", AccuracyPercent = 88, Status = "Proficient" },
            new() { Subject = "Systems Programming (C)", AccuracyPercent = 84, Status = "Proficient" },
            new() { Subject = "Web & API Engineering (C#)", AccuracyPercent = 90, Status = "Mastery" },
            new() { Subject = "Developer Tools (Git & GitHub)", AccuracyPercent = 95, Status = "Mastery" },
            new() { Subject = "Cloud & DevOps (Docker)", AccuracyPercent = 86, Status = "Proficient" }
        };

        var dailyTrend = new List<DailyStudyMinutesDto>
        {
            new() { Day = "Mon", Minutes = 55, TargetMinutes = 45 },
            new() { Day = "Tue", Minutes = 40, TargetMinutes = 45 },
            new() { Day = "Wed", Minutes = 65, TargetMinutes = 45 },
            new() { Day = "Thu", Minutes = 50, TargetMinutes = 45 },
            new() { Day = "Fri", Minutes = 75, TargetMinutes = 45 },
            new() { Day = "Sat", Minutes = 90, TargetMinutes = 45 },
            new() { Day = "Sun", Minutes = 60, TargetMinutes = 45 }
        };

        var summary = new ProgressSummaryDto
        {
            StudentId = studentId,
            WeeklyStudyHours = 7.2,
            TotalXp = profile?.XpPoints ?? 1820,
            CurrentStreak = profile?.StreakCount ?? 12,
            AverageAccuracy = avgAccuracy,
            QuizzesCompleted = attempts.Count > 0 ? attempts.Count : 18,
            SubjectBreakdown = breakdown,
            DailyStudyTrend = dailyTrend
        };

        return Ok(ApiResponse<ProgressSummaryDto>.Ok(summary));
    }

    [HttpGet("api/v1/progress/{studentId}/predict-risk")]
    public async Task<ActionResult<ApiResponse<RiskPredictionResultDto>>> PredictRisk(string studentId)
    {
        var prediction = await _mlService.PredictStudentRiskAsync(studentId);
        return Ok(ApiResponse<RiskPredictionResultDto>.Ok(prediction));
    }

    [HttpGet("api/v1/reports/{studentId}/download")]
    public async Task<IActionResult> DownloadReport(string studentId)
    {
        var user = await _context.Users
            .Include(u => u.StudentProfile)
            .FirstOrDefaultAsync(u => u.Id == studentId);

        var name = user?.Name ?? "Student";
        var school = user?.StudentProfile?.SchoolName ?? "Rural School";
        var xp = user?.StudentProfile?.XpPoints ?? 0;
        var streak = user?.StudentProfile?.StreakCount ?? 0;

        var sb = new StringBuilder();
        sb.AppendLine("=============================================================");
        sb.AppendLine("         GAMIFIED LEARNING PLATFORM - PROGRESS REPORT        ");
        sb.AppendLine("=============================================================");
        sb.AppendLine($"Student Name: {name}");
        sb.AppendLine($"School:       {school}");
        sb.AppendLine($"Report Date:  {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC");
        sb.AppendLine($"Total XP:     {xp}");
        sb.AppendLine($"Streak:       {streak} Days");
        sb.AppendLine("-------------------------------------------------------------");
        sb.AppendLine("SUBJECT MASTERY:");
        sb.AppendLine("  - Mathematics:            88% (Grade A)");
        sb.AppendLine("  - Science & Ecosystems:   82% (Grade A-)");
        sb.AppendLine("  - Sustainable Agriculture: 94% (Grade A+)");
        sb.AppendLine("  - Rural Digital Skills:   90% (Grade A+)");
        sb.AppendLine("  - English Communication:  74% (Grade B)");
        sb.AppendLine("=============================================================");

        var bytes = Encoding.UTF8.GetBytes(sb.ToString());
        return File(bytes, "text/plain", $"{name.Replace(" ", "_")}_ReportCard.txt");
    }
}
