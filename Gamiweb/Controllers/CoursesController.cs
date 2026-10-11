using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Gamiweb.Data;
using Gamiweb.DTOs;
using Gamiweb.Models;
using Gamiweb.Services;
using System.Text.Json;

namespace Gamiweb.Controllers;

[ApiController]
[Route("api/v1/courses")]
public class CoursesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IAiSummarizerService _summarizerService;

    public CoursesController(AppDbContext context, IAiSummarizerService summarizerService)
    {
        _context = context;
        _summarizerService = summarizerService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResponse<CourseDto>>> GetCourses(
        [FromQuery] string? subject,
        [FromQuery] string? language,
        [FromQuery] string? difficulty,
        [FromQuery] string? studentId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = _context.Courses.Include(c => c.Modules).AsQueryable();

        if (!string.IsNullOrEmpty(subject) && subject != "All")
        {
            query = query.Where(c => c.Subject == subject);
        }

        if (!string.IsNullOrEmpty(language) && language != "All")
        {
            query = query.Where(c => c.Language == language);
        }

        if (!string.IsNullOrEmpty(difficulty) && difficulty != "All")
        {
            query = query.Where(c => c.DifficultyLevel.ToLower().Contains(difficulty.ToLower()));
        }

        int totalCount = await query.CountAsync();

        var courses = await query
            .OrderByDescending(c => c.Rating)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        // Get enrollments and downloads for student if provided
        var enrollments = new Dictionary<string, int>();
        var downloads = new HashSet<string>();

        if (!string.IsNullOrEmpty(studentId))
        {
            enrollments = await _context.Enrollments
                .Where(e => e.StudentId == studentId)
                .ToDictionaryAsync(e => e.CourseId, e => e.ProgressPercent);

            var downloadedList = await _context.DownloadedContents
                .Where(dc => dc.StudentId == studentId)
                .Select(dc => dc.CourseId)
                .ToListAsync();

            downloads = new HashSet<string>(downloadedList);
        }

        var courseDtos = courses.Select(c => new CourseDto
        {
            Id = c.Id,
            Title = c.Title,
            Subject = c.Subject,
            Description = c.Description,
            Language = c.Language,
            DifficultyLevel = c.DifficultyLevel,
            Grade = c.Grade,
            ThumbnailUrl = c.ThumbnailUrl,
            VideoUrl = c.VideoUrl,
            Instructor = c.Instructor,
            DownloadableSizeMb = c.DownloadableSizeMb,
            Rating = c.Rating,
            StudentsCount = c.StudentsCount,
            ProgressPercent = enrollments.ContainsKey(c.Id) ? enrollments[c.Id] : 0,
            IsDownloaded = downloads.Contains(c.Id),
            TotalLessons = c.Modules.Count,
            AiSummaryText = c.AiSummaryText
        });

        return Ok(PagedResponse<CourseDto>.Create(courseDtos, totalCount, page, pageSize));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<CourseDto>>> GetCourseById(string id, [FromQuery] string? studentId)
    {
        var course = await _context.Courses
            .Include(c => c.Modules)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (course == null)
        {
            return NotFound(ApiResponse<CourseDto>.Fail("Course not found."));
        }

        int progress = 0;
        bool isDownloaded = false;

        if (!string.IsNullOrEmpty(studentId))
        {
            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.StudentId == studentId && e.CourseId == id);
            if (enrollment != null) progress = enrollment.ProgressPercent;

            isDownloaded = await _context.DownloadedContents
                .AnyAsync(dc => dc.StudentId == studentId && dc.CourseId == id);
        }

        var keyPoints = JsonSerializer.Deserialize<List<string>>(course.AiKeyPointsJson) ?? new();

        var dto = new CourseDto
        {
            Id = course.Id,
            Title = course.Title,
            Subject = course.Subject,
            Description = course.Description,
            Language = course.Language,
            DifficultyLevel = course.DifficultyLevel,
            Grade = course.Grade,
            ThumbnailUrl = course.ThumbnailUrl,
            VideoUrl = course.VideoUrl,
            Instructor = course.Instructor,
            DownloadableSizeMb = course.DownloadableSizeMb,
            Rating = course.Rating,
            StudentsCount = course.StudentsCount,
            ProgressPercent = progress,
            IsDownloaded = isDownloaded,
            TotalLessons = course.Modules.Count,
            AiSummaryText = course.AiSummaryText,
            AiKeyPoints = keyPoints,
            Modules = course.Modules.OrderBy(m => m.SequenceOrder).Select(m => new CourseModuleDto
            {
                Id = m.Id,
                Title = m.Title,
                SequenceOrder = m.SequenceOrder,
                VideoUrl = m.VideoUrl,
                DurationMinutes = m.DurationMinutes,
                CaptionsUrl = m.CaptionsUrl,
                SignLanguageVideoUrl = m.SignLanguageVideoUrl
            }).ToList()
        };

        return Ok(ApiResponse<CourseDto>.Ok(dto));
    }

    [HttpPost("{id}/enroll")]
    public async Task<ActionResult<ApiResponse<string>>> Enroll(string id, [FromBody] string studentId)
    {
        var existing = await _context.Enrollments
            .FirstOrDefaultAsync(e => e.StudentId == studentId && e.CourseId == id);

        if (existing == null)
        {
            _context.Enrollments.Add(new Enrollment
            {
                StudentId = studentId,
                CourseId = id,
                ProgressPercent = 0,
                Status = EnrollmentStatus.InProgress,
                EnrolledAt = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();
        }

        return Ok(ApiResponse<string>.Ok("Enrolled successfully"));
    }

    [HttpPatch("{id}/progress")]
    public async Task<ActionResult<ApiResponse<string>>> UpdateProgress(string id, [FromQuery] string studentId, [FromBody] CourseProgressUpdateDto update)
    {
        var enrollment = await _context.Enrollments
            .FirstOrDefaultAsync(e => e.StudentId == studentId && e.CourseId == id);

        if (enrollment == null)
        {
            enrollment = new Enrollment
            {
                StudentId = studentId,
                CourseId = id,
                ProgressPercent = update.ProgressPercent,
                Status = update.ProgressPercent >= 100 ? EnrollmentStatus.Completed : EnrollmentStatus.InProgress,
                EnrolledAt = DateTime.UtcNow,
                CompletedAt = update.ProgressPercent >= 100 ? DateTime.UtcNow : null
            };
            _context.Enrollments.Add(enrollment);
        }
        else
        {
            enrollment.ProgressPercent = Math.Max(enrollment.ProgressPercent, update.ProgressPercent);
            if (enrollment.ProgressPercent >= 100)
            {
                enrollment.Status = EnrollmentStatus.Completed;
                enrollment.CompletedAt = DateTime.UtcNow;
            }
        }

        await _context.SaveChangesAsync();
        return Ok(ApiResponse<string>.Ok($"Progress updated to {enrollment.ProgressPercent}%"));
    }

    [HttpPost("{id}/download")]
    public async Task<ActionResult<ApiResponse<string>>> DownloadForOffline(string id, [FromQuery] string studentId)
    {
        var existing = await _context.DownloadedContents
            .FirstOrDefaultAsync(dc => dc.StudentId == studentId && dc.CourseId == id);

        if (existing == null)
        {
            _context.DownloadedContents.Add(new DownloadedContent
            {
                StudentId = studentId,
                CourseId = id,
                DownloadedAt = DateTime.UtcNow,
                SyncStatus = "CachedOffline"
            });
            await _context.SaveChangesAsync();
        }

        return Ok(ApiResponse<string>.Ok("Marked as downloaded for offline learning"));
    }

    [HttpGet("{id}/ai-summary")]
    public async Task<ActionResult<ApiResponse<object>>> GetAiSummary(string id)
    {
        var (summary, keyPoints) = await _summarizerService.SummarizeCourseContentAsync(id);
        return Ok(ApiResponse<object>.Ok(new { summary, keyPoints }));
    }
}
