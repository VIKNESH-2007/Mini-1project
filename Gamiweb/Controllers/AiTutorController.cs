using Microsoft.AspNetCore.Mvc;
using Gamiweb.DTOs;
using Gamiweb.Services;

namespace Gamiweb.Controllers;

[ApiController]
[Route("api/v1/ai-tutor")]
public class AiTutorController : ControllerBase
{
    private readonly IAiTutorService _tutorService;

    public AiTutorController(IAiTutorService tutorService)
    {
        _tutorService = tutorService;
    }

    [HttpPost("ask")]
    public async Task<ActionResult<ApiResponse<AiTutorResponseDto>>> Ask([FromBody] AiTutorAskDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Question))
        {
            return BadRequest(ApiResponse<AiTutorResponseDto>.Fail("Question cannot be empty."));
        }

        var response = await _tutorService.AskQuestionAsync(request);
        return Ok(ApiResponse<AiTutorResponseDto>.Ok(response, "AI response generated successfully"));
    }

    [HttpGet("history/{studentId}")]
    public async Task<ActionResult<ApiResponse<List<AiTutorResponseDto>>>> GetHistory(string studentId)
    {
        var history = await _tutorService.GetStudentHistoryAsync(studentId);
        return Ok(ApiResponse<List<AiTutorResponseDto>>.Ok(history));
    }
}
