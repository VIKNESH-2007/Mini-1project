using Gamiweb.Data;
using Gamiweb.DTOs;
using Gamiweb.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Gamiweb.Services;

public interface IAiTutorService
{
    Task<AiTutorResponseDto> AskQuestionAsync(AiTutorAskDto request);
    Task<List<AiTutorResponseDto>> GetStudentHistoryAsync(string studentId);
}

public class AiTutorService : IAiTutorService
{
    private readonly AppDbContext _context;
    private readonly IXpService _xpService;
    private readonly HttpClient _httpClient;

    public AiTutorService(AppDbContext context, IXpService xpService, HttpClient httpClient)
    {
        _context = context;
        _xpService = xpService;
        _httpClient = httpClient;
    }

    public async Task<AiTutorResponseDto> AskQuestionAsync(AiTutorAskDto request)
    {
        string q = request.Question.ToLower();
        string answer;
        var steps = new List<string>();
        string? tip = null;

        // Intent matching & curriculum resolution
        if (q.Contains("fraction") || q.Contains("divide") || q.Contains("market") || q.Contains("math"))
        {
            answer = "Fractions represent parts of a whole quantity. Here is how they operate in daily village commerce:";
            steps = new List<string>
            {
                "Step 1: In a fraction like 1/4, the bottom number (4) is total parts, and the top (1) is parts taken.",
                "Step 2: If a 100 kg grain sack is divided into 4 bags, each bag gets 100 ÷ 4 = 25 kg (1/4th or 25%).",
                "Step 3: To combine fractions with same denominator: 1/4 + 2/4 = 3/4 (75 kg).",
                "Step 4: Market rule: Always simplify before paying (e.g. ₹50 out of ₹100 is 1/2)."
            };
            tip = "Test your fraction math by calculating change at the weekly local haat!";
        }
        else if (q.Contains("photo") || q.Contains("plant") || q.Contains("sun") || q.Contains("leaf") || q.Contains("science"))
        {
            answer = "Photosynthesis is the natural solar food synthesis in green leaves:";
            steps = new List<string>
            {
                "Step 1: Chlorophyll inside leaf cells absorbs energy from sunlight.",
                "Step 2: Roots pull water (H₂O) from soil, while leaf stomata draw in carbon dioxide (CO₂).",
                "Step 3: Solar energy transforms these into glucose (crop nourishment) and oxygen (O₂).",
                "Step 4: Formula: 6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ + 6O₂."
            };
            tip = "Keep crop leaves clean of excessive dust so microscopic stomata can breathe freely.";
        }
        else if (q.Contains("upi") || q.Contains("pin") || q.Contains("bank") || q.Contains("scam") || q.Contains("money"))
        {
            answer = "Rural Cyber & Digital Banking Safety Rules:";
            steps = new List<string>
            {
                "Rule 1: UPI PIN is only needed to SEND money from your bank account.",
                "Rule 2: You NEVER need to enter your PIN or OTP to RECEIVE money or government DBT grants.",
                "Rule 3: If an unknown caller asks for your OTP or promises a lottery prize, hang up immediately.",
                "Rule 4: Always confirm the beneficiary name on the screen before confirming."
            };
            tip = "National cyber fraud reporting emergency helpline is 1930.";
        }
        else if (q.Contains("compost") || q.Contains("soil") || q.Contains("worm") || q.Contains("farm") || q.Contains("agri"))
        {
            answer = "Preparing Organic Vermicompost Fertilizer:";
            steps = new List<string>
            {
                "Step 1: Choose a cool, shaded bed protected from heavy waterlogging and direct sun.",
                "Step 2: Spread dry foliage and crop residue (carbon base) about 6 inches thick.",
                "Step 3: Add cattle dung and sprinkle water to maintain 60% moisture.",
                "Step 4: Add earthworms (Eisenia fetida); in 45 days, you have odorless, black organic humus."
            };
            tip = "Vermicompost preserves up to 40% soil moisture during dry spells.";
        }
        else
        {
            answer = $"Here is the structured breakdown for \"{request.Question}\":";
            steps = new List<string>
            {
                "1. Fundamental Concept: Focus on foundational principles first.",
                "2. Everyday Application: Connect this knowledge to village or household realities.",
                "3. Review: Practice 2 quick quiz questions to solidify memory."
            };
            tip = "You earned +15 XP for asking academic doubts!";
        }

        // Save conversation
        var convo = new AiTutorConversation
        {
            StudentId = request.StudentId,
            QuestionText = request.Question,
            AiResponseText = answer,
            StepsJson = JsonSerializer.Serialize(steps),
            Language = request.Language,
            CreatedAt = DateTime.UtcNow
        };
        _context.AiTutorConversations.Add(convo);
        await _context.SaveChangesAsync();

        // Award +15 XP for asking doubts
        await _xpService.AwardXpAsync(request.StudentId, 15, "AI Doubt Inquirer");

        return new AiTutorResponseDto
        {
            ConversationId = convo.Id,
            Answer = answer,
            Steps = steps,
            Tip = tip,
            XpAwarded = 15,
            IsCachedOfflineAnswer = true,
            Timestamp = convo.CreatedAt
        };
    }

    public async Task<List<AiTutorResponseDto>> GetStudentHistoryAsync(string studentId)
    {
        var history = await _context.AiTutorConversations
            .Where(c => c.StudentId == studentId)
            .OrderByDescending(c => c.CreatedAt)
            .Take(20)
            .ToListAsync();

        return history.Select(c => new AiTutorResponseDto
        {
            ConversationId = c.Id,
            Answer = c.AiResponseText,
            Steps = JsonSerializer.Deserialize<List<string>>(c.StepsJson) ?? new(),
            XpAwarded = 15,
            Timestamp = c.CreatedAt
        }).ToList();
    }
}
