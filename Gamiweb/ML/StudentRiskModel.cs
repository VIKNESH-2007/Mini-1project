using Microsoft.ML;
using Microsoft.ML.Data;

namespace Gamiweb.ML;

public class StudentRiskInput
{
    [LoadColumn(0)]
    public float QuizAccuracy { get; set; }

    [LoadColumn(1)]
    public float DailyStudyMinutes { get; set; }

    [LoadColumn(2)]
    public float StreakCount { get; set; }

    [LoadColumn(3)]
    public float MissedDays { get; set; }

    [LoadColumn(4)]
    public float QuizzesCompleted { get; set; }

    [LoadColumn(5)]
    public bool Label { get; set; } // true = At Risk, false = On Track
}

public class StudentRiskPrediction
{
    [ColumnName("PredictedLabel")]
    public bool IsAtRisk { get; set; }

    public float Probability { get; set; }

    public float Score { get; set; }
}

public class StudentRiskModelBuilder
{
    public static ITransformer TrainAndSaveModel(MLContext mlContext, string modelPath)
    {
        // Sample representative rural learner training set
        var trainingData = new List<StudentRiskInput>
        {
            new() { QuizAccuracy = 92f, DailyStudyMinutes = 60f, StreakCount = 14f, MissedDays = 0f, QuizzesCompleted = 10f, Label = false },
            new() { QuizAccuracy = 85f, DailyStudyMinutes = 45f, StreakCount = 8f, MissedDays = 1f, QuizzesCompleted = 8f, Label = false },
            new() { QuizAccuracy = 78f, DailyStudyMinutes = 50f, StreakCount = 12f, MissedDays = 0f, QuizzesCompleted = 9f, Label = false },
            new() { QuizAccuracy = 95f, DailyStudyMinutes = 70f, StreakCount = 20f, MissedDays = 0f, QuizzesCompleted = 15f, Label = false },
            new() { QuizAccuracy = 42f, DailyStudyMinutes = 15f, StreakCount = 0f, MissedDays = 5f, QuizzesCompleted = 2f, Label = true },
            new() { QuizAccuracy = 50f, DailyStudyMinutes = 10f, StreakCount = 1f, MissedDays = 4f, QuizzesCompleted = 1f, Label = true },
            new() { QuizAccuracy = 35f, DailyStudyMinutes = 5f, StreakCount = 0f, MissedDays = 7f, QuizzesCompleted = 1f, Label = true },
            new() { QuizAccuracy = 58f, DailyStudyMinutes = 20f, StreakCount = 2f, MissedDays = 3f, QuizzesCompleted = 3f, Label = true },
            new() { QuizAccuracy = 88f, DailyStudyMinutes = 55f, StreakCount = 10f, MissedDays = 0f, QuizzesCompleted = 7f, Label = false },
            new() { QuizAccuracy = 45f, DailyStudyMinutes = 12f, StreakCount = 0f, MissedDays = 6f, QuizzesCompleted = 2f, Label = true }
        };

        var dataView = mlContext.Data.LoadFromEnumerable(trainingData);

        var pipeline = mlContext.Transforms.Concatenate("Features",
                nameof(StudentRiskInput.QuizAccuracy),
                nameof(StudentRiskInput.DailyStudyMinutes),
                nameof(StudentRiskInput.StreakCount),
                nameof(StudentRiskInput.MissedDays),
                nameof(StudentRiskInput.QuizzesCompleted))
            .Append(mlContext.BinaryClassification.Trainers.SdcaLogisticRegression(labelColumnName: "Label", featureColumnName: "Features"));

        var model = pipeline.Fit(dataView);

        var directory = Path.GetDirectoryName(modelPath);
        if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
        {
            Directory.CreateDirectory(directory);
        }

        mlContext.Model.Save(model, dataView.Schema, modelPath);
        return model;
    }
}
