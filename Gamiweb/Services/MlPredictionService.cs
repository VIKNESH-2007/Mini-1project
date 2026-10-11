using Microsoft.ML;
using Gamiweb.DTOs;
using Gamiweb.ML;
using Gamiweb.Data;
using Microsoft.EntityFrameworkCore;

namespace Gamiweb.Services;

public interface IMlPredictionService
{
    Task<RiskPredictionResultDto> PredictStudentRiskAsync(string studentId);
}

public class MlPredictionService : IMlPredictionService
{
    private readonly AppDbContext _context;
    private readonly MLContext _mlContext;
    private readonly ITransformer _model;
    private readonly string _modelPath;

    public MlPredictionService(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _mlContext = new MLContext(seed: 42);
        _modelPath = Path.Combine(env.ContentRootPath, "ML", "student_risk_model.zip");

        if (File.Exists(_modelPath))
        {
            try
            {
                _model = _mlContext.Model.Load(_modelPath, out _);
            }
            catch
            {
                _model = StudentRiskModelBuilder.TrainAndSaveModel(_mlContext, _modelPath);
            }
        }
        else
        {
            _model = StudentRiskModelBuilder.TrainAndSaveModel(_mlContext, _modelPath);
        }
    }

    public async Task<RiskPredictionResultDto> PredictStudentRiskAsync(string studentId)
    {
        var profile = await _context.StudentProfiles.FirstOrDefaultAsync(sp => sp.UserId == studentId);
        var attempts = await _context.QuizAttempts.Where(qa => qa.StudentId == studentId).ToListAsync();

        float avgAccuracy = attempts.Any() ? (float)attempts.Average(a => a.AccuracyPercent) : 85f;
        float totalQuizzes = attempts.Count;
        float streak = profile?.StreakCount ?? 5f;
        float missedDays = streak == 0 ? 4f : 0f;
        float dailyMinutes = 55f;

        var input = new StudentRiskInput
        {
            QuizAccuracy = avgAccuracy,
            DailyStudyMinutes = dailyMinutes,
            StreakCount = streak,
            MissedDays = missedDays,
            QuizzesCompleted = totalQuizzes
        };

        var predEngine = _mlContext.Model.CreatePredictionEngine<StudentRiskInput, StudentRiskPrediction>(_model);
        var prediction = predEngine.Predict(input);

        var riskFactors = new List<string>();
        var interventions = new List<string>();

        if (prediction.IsAtRisk || avgAccuracy < 60f)
        {
            if (avgAccuracy < 60f)
            {
                riskFactors.Add($"Low quiz mastery average ({avgAccuracy:F1}%)");
                interventions.Add("Assign simplified conceptual video lessons and peer tutoring.");
            }
            if (streak < 3)
            {
                riskFactors.Add("Irregular daily attendance or missed days.");
                interventions.Add("Enable automated offline SMS/voice study reminders for parent.");
            }
        }
        else
        {
            interventions.Add("Student is on track. Challenge with advanced community problem solving.");
        }

        return new RiskPredictionResultDto
        {
            StudentId = studentId,
            IsAtRisk = prediction.IsAtRisk,
            RiskProbability = Math.Round(prediction.Probability, 3),
            RiskLevel = prediction.IsAtRisk ? (prediction.Probability > 0.75 ? "High Risk" : "Moderate Risk") : "Low Risk (On Track)",
            RiskFactors = riskFactors,
            RecommendedInterventions = interventions
        };
    }
}
