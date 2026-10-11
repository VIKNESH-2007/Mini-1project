using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Gamiweb.Data;
using Gamiweb.DTOs;
using Gamiweb.Services;

namespace Gamiweb.Controllers;

[ApiController]
[Route("api/v1/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IBadgeService _badgeService;
    private readonly IRecommendationService _recommendationService;

    public DashboardController(AppDbContext context, IBadgeService badgeService, IRecommendationService recommendationService)
    {
        _context = context;
        _badgeService = badgeService;
        _recommendationService = recommendationService;
    }

    [HttpGet("student/{id}")]
    public async Task<ActionResult<ApiResponse<StudentDashboardDto>>> GetStudentDashboard(string id)
    {
        var user = await _context.Users
            .Include(u => u.StudentProfile)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
        {
            return NotFound(ApiResponse<StudentDashboardDto>.Fail("Student profile not found."));
        }

        var profile = user.StudentProfile;
        int xp = profile?.XpPoints ?? 0;
        int level = profile?.Level ?? 1;
        int levelProgress = (int)Math.Min(100, Math.Round(((xp % 150) / 150.0) * 100));

        // Get in-progress course
        var activeEnrollment = await _context.Enrollments
            .Include(e => e.Course)
            .ThenInclude(c => c!.Modules)
            .Where(e => e.StudentId == id && e.Status == Models.EnrollmentStatus.InProgress)
            .OrderByDescending(e => e.EnrolledAt)
            .FirstOrDefaultAsync();

        CourseDto? continueCourse = null;
        if (activeEnrollment?.Course != null)
        {
            var c = activeEnrollment.Course;
            continueCourse = new CourseDto
            {
                Id = c.Id,
                Title = c.Title,
                Subject = c.Subject,
                Description = c.Description,
                Grade = c.Grade,
                Instructor = c.Instructor,
                ThumbnailUrl = c.ThumbnailUrl,
                ProgressPercent = activeEnrollment.ProgressPercent,
                TotalLessons = c.Modules.Count
            };
        }

        // Today timetable
        string todayDay = DateTime.UtcNow.DayOfWeek.ToString();
        var timetable = await _context.TimetableSessions
            .Where(t => t.StudentId == id && (t.DayOfWeek == todayDay || t.DayOfWeek == "Monday"))
            .Take(3)
            .Select(t => new TimetableSessionDto
            {
                Id = t.Id,
                DayOfWeek = t.DayOfWeek,
                Subject = t.Subject,
                Topic = t.Topic,
                StartTime = t.StartTime,
                EndTime = t.EndTime,
                Room = t.RoomOrLink,
                Status = t.IsCompleted ? "completed" : "in-progress",
                OfflineReady = t.ReminderEnabled
            })
            .ToListAsync();

        // Downloaded courses count
        var downloadedCount = await _context.DownloadedContents
            .Where(dc => dc.StudentId == id)
            .Select(dc => dc.CourseId)
            .Distinct()
            .CountAsync();

        // Badges
        var badges = await _badgeService.GetBadgesForStudentAsync(id);
        var recentBadges = badges.Where(b => b.Unlocked).Take(3).ToList();

        // Recommended courses
        var recommended = await _recommendationService.GetRecommendedCoursesAsync(id, 3);

        var dashboard = new StudentDashboardDto
        {
            StudentId = user.Id,
            Name = user.Name,
            SchoolName = profile?.SchoolName ?? "Rural High School",
            Grade = profile?.Grade ?? "Class 8",
            AvatarUrl = user.AvatarUrl,
            XpPoints = xp,
            Level = level,
            LevelProgressPercent = levelProgress,
            StreakCount = profile?.StreakCount ?? 0,
            DownloadedCoursesCount = downloadedCount,
            ContinueCourse = continueCourse,
            TodayTimetable = timetable,
            RecentBadges = recentBadges,
            RecommendedCourses = recommended
        };

        return Ok(ApiResponse<StudentDashboardDto>.Ok(dashboard));
    }
}
