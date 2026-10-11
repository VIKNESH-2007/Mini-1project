using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Gamiweb.Data;
using Gamiweb.DTOs;

namespace Gamiweb.Controllers;

[ApiController]
public class LanguageController : ControllerBase
{
    private readonly AppDbContext _context;

    public LanguageController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("api/v1/languages")]
    public ActionResult<ApiResponse<List<object>>> GetSupportedLanguages()
    {
        var languages = new List<object>
        {
            new { code = "en", label = "English", flag = "🇬🇧" },
            new { code = "hi", label = "हिंदी (Hindi)", flag = "🇮🇳" },
            new { code = "ta", label = "தமிழ் (Tamil)", flag = "🇮🇳" },
            new { code = "te", label = "తెలుగు (Telugu)", flag = "🇮🇳" },
            new { code = "bn", label = "বাংলা (Bengali)", flag = "🇮🇳" },
            new { code = "mr", label = "मराठी (Marathi)", flag = "🇮🇳" },
            new { code = "es", label = "Español (Spanish)", flag = "🇪🇸" }
        };

        return Ok(ApiResponse<List<object>>.Ok(languages));
    }

    [HttpGet("api/v1/content/{courseId}")]
    public async Task<ActionResult<ApiResponse<object>>> GetLocalizedContent(string courseId, [FromQuery] string lang = "en")
    {
        var course = await _context.Courses.FindAsync(courseId);
        if (course == null)
        {
            return NotFound(ApiResponse<object>.Fail("Course not found."));
        }

        return Ok(ApiResponse<object>.Ok(new
        {
            courseId = course.Id,
            requestedLanguage = lang,
            title = course.Title,
            subject = course.Subject,
            description = course.Description,
            aiSummary = course.AiSummaryText
        }));
    }
}
