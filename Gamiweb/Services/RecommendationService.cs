using Gamiweb.Data;
using Gamiweb.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Gamiweb.Services;

public interface IAiSummarizerService
{
    Task<(string Summary, List<string> KeyPoints)> SummarizeCourseContentAsync(string courseId);
}

public class AiSummarizerService : IAiSummarizerService
{
    private readonly AppDbContext _context;

    public AiSummarizerService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<(string Summary, List<string> KeyPoints)> SummarizeCourseContentAsync(string courseId)
    {
        var course = await _context.Courses.FindAsync(courseId);
        if (course == null) return ("Course not found.", new());

        if (!string.IsNullOrEmpty(course.AiSummaryText))
        {
            var keyPoints = JsonSerializer.Deserialize<List<string>>(course.AiKeyPointsJson) ?? new();
            return (course.AiSummaryText, keyPoints);
        }

        return ($"Essential knowledge overview for {course.Title}. Designed for rural offline mastery.",
            new List<string>
            {
                "Key Principle: Understand foundational theory and practical application.",
                "Village Relevance: Direct application to local communities, crops, and health.",
                "Review: Complete the daily quiz to lock in XP points."
            });
    }
}

public interface IRecommendationService
{
    Task<List<CourseDto>> GetRecommendedCoursesAsync(string studentId, int count = 3);
}

public class RecommendationService : IRecommendationService
{
    private readonly AppDbContext _context;

    public RecommendationService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<CourseDto>> GetRecommendedCoursesAsync(string studentId, int count = 3)
    {
        var enrolledCourseIds = await _context.Enrollments
            .Where(e => e.StudentId == studentId)
            .Select(e => e.CourseId)
            .ToListAsync();

        var courses = await _context.Courses
            .Where(c => !enrolledCourseIds.Contains(c.Id))
            .OrderByDescending(c => c.Rating)
            .Take(count)
            .ToListAsync();

        if (!courses.Any())
        {
            courses = await _context.Courses.Take(count).ToListAsync();
        }

        return courses.Select(c => new CourseDto
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
            StudentsCount = c.StudentsCount
        }).ToList();
    }
}
