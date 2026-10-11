-- ======================================================================
-- GAMIFIED LEARNING PLATFORM - MYSQL DATABASE SCHEMA & SEED SCRIPT
-- Designed for Rural, Offline-First & AI Multilingual Education
-- ======================================================================

CREATE DATABASE IF NOT EXISTS `gamiweb_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `gamiweb_db`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `Users` (
    `Id` VARCHAR(50) NOT NULL,
    `Name` VARCHAR(120) NOT NULL,
    `Email` VARCHAR(160) NOT NULL UNIQUE,
    `PasswordHash` VARCHAR(255) NOT NULL,
    `Role` INT NOT NULL COMMENT '0=Student, 1=Parent, 2=Teacher',
    `PreferredLanguage` VARCHAR(10) DEFAULT 'en',
    `AvatarUrl` VARCHAR(500) DEFAULT '',
    `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Student Profiles Table
CREATE TABLE IF NOT EXISTS `StudentProfiles` (
    `UserId` VARCHAR(50) NOT NULL,
    `Grade` VARCHAR(80) DEFAULT 'Class 8',
    `SchoolName` VARCHAR(160) DEFAULT 'Bilaspur Govt High School',
    `District` VARCHAR(120) DEFAULT 'Bilaspur, Chhattisgarh',
    `XpPoints` INT DEFAULT 0,
    `Level` INT DEFAULT 1,
    `StreakCount` INT DEFAULT 0,
    `LastActiveDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`UserId`),
    CONSTRAINT `FK_StudentProfiles_Users` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Parent-Student Relationship Links
CREATE TABLE IF NOT EXISTS `ParentStudentLinks` (
    `Id` VARCHAR(50) NOT NULL,
    `ParentId` VARCHAR(50) NOT NULL,
    `StudentId` VARCHAR(50) NOT NULL,
    `LinkedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_ParentLinks_Parent` FOREIGN KEY (`ParentId`) REFERENCES `Users` (`Id`),
    CONSTRAINT `FK_ParentLinks_Student` FOREIGN KEY (`StudentId`) REFERENCES `Users` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Courses Table
CREATE TABLE IF NOT EXISTS `Courses` (
    `Id` VARCHAR(50) NOT NULL,
    `Title` VARCHAR(200) NOT NULL,
    `Subject` VARCHAR(100) NOT NULL,
    `Description` TEXT,
    `Language` VARCHAR(10) DEFAULT 'en',
    `DifficultyLevel` VARCHAR(50) DEFAULT 'Beginner',
    `Grade` VARCHAR(80) DEFAULT 'Class 6-8',
    `ThumbnailUrl` VARCHAR(500),
    `VideoUrl` VARCHAR(500),
    `Instructor` VARCHAR(100),
    `DownloadableSizeMb` DOUBLE DEFAULT 15.0,
    `Rating` DOUBLE DEFAULT 4.8,
    `StudentsCount` INT DEFAULT 0,
    `AiSummaryText` TEXT,
    `AiKeyPointsJson` TEXT,
    `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Course Modules Table
CREATE TABLE IF NOT EXISTS `CourseModules` (
    `Id` VARCHAR(50) NOT NULL,
    `CourseId` VARCHAR(50) NOT NULL,
    `Title` VARCHAR(200) NOT NULL,
    `SequenceOrder` INT DEFAULT 1,
    `VideoUrl` VARCHAR(500),
    `DurationMinutes` VARCHAR(30) DEFAULT '10:00',
    `CaptionsUrl` VARCHAR(500),
    `SignLanguageVideoUrl` VARCHAR(500),
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_CourseModules_Courses` FOREIGN KEY (`CourseId`) REFERENCES `Courses` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Student Course Enrollments
CREATE TABLE IF NOT EXISTS `Enrollments` (
    `Id` VARCHAR(50) NOT NULL,
    `StudentId` VARCHAR(50) NOT NULL,
    `CourseId` VARCHAR(50) NOT NULL,
    `ProgressPercent` INT DEFAULT 0,
    `Status` INT DEFAULT 0 COMMENT '0=InProgress, 1=Completed',
    `EnrolledAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `CompletedAt` DATETIME NULL,
    PRIMARY KEY (`Id`),
    KEY `IX_Enrollments_Student_Course` (`StudentId`, `CourseId`),
    CONSTRAINT `FK_Enrollments_Courses` FOREIGN KEY (`CourseId`) REFERENCES `Courses` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Downloaded Offline Content Registry
CREATE TABLE IF NOT EXISTS `DownloadedContents` (
    `Id` VARCHAR(50) NOT NULL,
    `StudentId` VARCHAR(50) NOT NULL,
    `CourseId` VARCHAR(50) NOT NULL,
    `DownloadedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `SyncStatus` VARCHAR(50) DEFAULT 'CachedOffline',
    PRIMARY KEY (`Id`),
    KEY `IX_Downloaded_Student` (`StudentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Quizzes Table
CREATE TABLE IF NOT EXISTS `Quizzes` (
    `Id` VARCHAR(50) NOT NULL,
    `CourseId` VARCHAR(50) NULL,
    `Title` VARCHAR(200) NOT NULL,
    `Difficulty` VARCHAR(50) DEFAULT 'Medium',
    `Subject` VARCHAR(100) DEFAULT 'General',
    `TimeLimitSeconds` INT DEFAULT 60,
    `TotalXp` INT DEFAULT 100,
    `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Quiz Questions Table
CREATE TABLE IF NOT EXISTS `QuizQuestions` (
    `Id` VARCHAR(50) NOT NULL,
    `QuizId` VARCHAR(50) NOT NULL,
    `QuestionText` TEXT NOT NULL,
    `OptionsJson` TEXT NOT NULL,
    `CorrectOption` INT NOT NULL DEFAULT 0,
    `ExplanationText` TEXT,
    `HintText` VARCHAR(500),
    `XpValue` INT DEFAULT 25,
    `Language` VARCHAR(10) DEFAULT 'en',
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_QuizQuestions_Quizzes` FOREIGN KEY (`QuizId`) REFERENCES `Quizzes` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Quiz Attempts History
CREATE TABLE IF NOT EXISTS `QuizAttempts` (
    `Id` VARCHAR(50) NOT NULL,
    `StudentId` VARCHAR(50) NOT NULL,
    `QuizId` VARCHAR(50) NOT NULL,
    `Score` INT DEFAULT 0,
    `TotalQuestions` INT DEFAULT 0,
    `AccuracyPercent` DOUBLE DEFAULT 0.0,
    `XpEarned` INT DEFAULT 0,
    `IsOfflineSynced` BOOLEAN DEFAULT FALSE,
    `AttemptedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`Id`),
    KEY `IX_QuizAttempts_Student` (`StudentId`),
    CONSTRAINT `FK_QuizAttempts_Quizzes` FOREIGN KEY (`QuizId`) REFERENCES `Quizzes` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Quiz Answers Table
CREATE TABLE IF NOT EXISTS `QuizAnswers` (
    `Id` VARCHAR(50) NOT NULL,
    `AttemptId` VARCHAR(50) NOT NULL,
    `QuestionId` VARCHAR(50) NOT NULL,
    `SelectedOption` INT NOT NULL,
    `IsCorrect` BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_QuizAnswers_QuizAttempts` FOREIGN KEY (`AttemptId`) REFERENCES `QuizAttempts` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_QuizAnswers_QuizQuestions` FOREIGN KEY (`QuestionId`) REFERENCES `QuizQuestions` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 11. Badges & Achievement Showcase Table
CREATE TABLE IF NOT EXISTS `Badges` (
    `Id` VARCHAR(50) NOT NULL,
    `Name` VARCHAR(100) NOT NULL,
    `Description` VARCHAR(500),
    `Category` VARCHAR(50) DEFAULT 'General',
    `IconEmoji` VARCHAR(20) DEFAULT '🏆',
    `Rarity` VARCHAR(50) DEFAULT 'Common',
    `XpReward` INT DEFAULT 100,
    `RequirementType` VARCHAR(100) DEFAULT 'Streak',
    `RequirementValue` INT DEFAULT 7,
    PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Student Badges Unlocked Table
CREATE TABLE IF NOT EXISTS `StudentBadges` (
    `Id` VARCHAR(50) NOT NULL,
    `StudentId` VARCHAR(50) NOT NULL,
    `BadgeId` VARCHAR(50) NOT NULL,
    `EarnedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_StudentBadges_Badges` FOREIGN KEY (`BadgeId`) REFERENCES `Badges` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. Leaderboard Snapshots Table
CREATE TABLE IF NOT EXISTS `LeaderboardSnapshots` (
    `Id` VARCHAR(50) NOT NULL,
    `StudentId` VARCHAR(50) NOT NULL,
    `StudentName` VARCHAR(120) NOT NULL,
    `SchoolName` VARCHAR(160) NOT NULL,
    `District` VARCHAR(120) NOT NULL,
    `XpPoints` INT DEFAULT 0,
    `Rank` INT DEFAULT 0,
    `Streak` INT DEFAULT 0,
    `Level` INT DEFAULT 1,
    `AvatarUrl` VARCHAR(500),
    `Period` INT DEFAULT 0 COMMENT '0=Weekly, 1=Monthly, 2=AllTime',
    `SnapshotDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`Id`),
    KEY `IX_Leaderboard_Period_Rank` (`Period`, `Rank`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. Timetable Sessions Table
CREATE TABLE IF NOT EXISTS `TimetableSessions` (
    `Id` VARCHAR(50) NOT NULL,
    `StudentId` VARCHAR(50) NOT NULL,
    `Subject` VARCHAR(100) NOT NULL,
    `Topic` VARCHAR(200),
    `DayOfWeek` VARCHAR(30) DEFAULT 'Monday',
    `StartTime` VARCHAR(50) DEFAULT '09:00 AM',
    `EndTime` VARCHAR(50) DEFAULT '09:45 AM',
    `RoomOrLink` VARCHAR(100) DEFAULT 'Home Study / Offline Tab',
    `ReminderEnabled` BOOLEAN DEFAULT TRUE,
    `IsCompleted` BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15. AI Tutor Conversations Table
CREATE TABLE IF NOT EXISTS `AiTutorConversations` (
    `Id` VARCHAR(50) NOT NULL,
    `StudentId` VARCHAR(50) NOT NULL,
    `QuestionText` TEXT NOT NULL,
    `AiResponseText` TEXT NOT NULL,
    `StepsJson` TEXT,
    `Language` VARCHAR(10) DEFAULT 'en',
    `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`Id`),
    KEY `IX_AiTutor_Student` (`StudentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 17. Progress Reports Table
CREATE TABLE IF NOT EXISTS `ProgressReports` (
    `Id` VARCHAR(50) NOT NULL,
    `StudentId` VARCHAR(50) NOT NULL,
    `WeekStartDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `StudyHours` DOUBLE DEFAULT 0.0,
    `QuizzesCompleted` INT DEFAULT 0,
    `AvgAccuracy` DOUBLE DEFAULT 0.0,
    `SubjectBreakdownJson` TEXT,
    `GeneratedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`Id`),
    KEY `IX_ProgressReports_Student` (`StudentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 16. Notifications Table
CREATE TABLE IF NOT EXISTS `Notifications` (
    `Id` VARCHAR(50) NOT NULL,
    `UserId` VARCHAR(50) NOT NULL,
    `Title` VARCHAR(200) NOT NULL,
    `Message` TEXT,
    `Type` INT DEFAULT 0 COMMENT '0=Milestone, 1=Report, 2=Message, 3=Sync',
    `ReadStatus` BOOLEAN DEFAULT FALSE,
    `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Notifications_Users` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 17. Teacher Messages Table
CREATE TABLE IF NOT EXISTS `TeacherMessages` (
    `Id` VARCHAR(50) NOT NULL,
    `SenderId` VARCHAR(50) NOT NULL,
    `ReceiverId` VARCHAR(50) NOT NULL,
    `StudentId` VARCHAR(50) NULL,
    `MessageText` TEXT NOT NULL,
    `SentAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`Id`),
    CONSTRAINT `FK_TeacherMessages_Sender` FOREIGN KEY (`SenderId`) REFERENCES `Users` (`Id`),
    CONSTRAINT `FK_TeacherMessages_Receiver` FOREIGN KEY (`ReceiverId`) REFERENCES `Users` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ======================================================================
-- INITIAL SEED RECORDS (Matching Frontend Demo Credentials)
-- ======================================================================

-- Seed Default Users (Password is 'demopass123')
-- BCrypt Hash: $2a$11$qR0k6mI5qfQ6h7lH.j/e6.8e2q5y0j7l1j4h6m8k0e2q5y0j7l1j4
INSERT INTO `Users` (`Id`, `Name`, `Email`, `PasswordHash`, `Role`, `PreferredLanguage`, `AvatarUrl`)
VALUES 
('usr-student-01', 'Karan Verma', 'karan.verma@ruralschool.org', '$2a$11$w1B0sQp0Yn5zS8N.0qR8nO0bV1x7d3mY0p2h4k6m8k0e2q5y0j7l1', 0, 'en', 'https://api.dicebear.com/7.x/bottts/svg?seed=Karan'),
('usr-parent-01', 'Ramesh Verma', 'ramesh.verma@farmermail.in', '$2a$11$w1B0sQp0Yn5zS8N.0qR8nO0bV1x7d3mY0p2h4k6m8k0e2q5y0j7l1', 1, 'hi', 'https://api.dicebear.com/7.x/bottts/svg?seed=RameshParent'),
('usr-teacher-01', 'Master Anand Sharma', 'anand.sharma@govschools.in', '$2a$11$w1B0sQp0Yn5zS8N.0qR8nO0bV1x7d3mY0p2h4k6m8k0e2q5y0j7l1', 2, 'hi', 'https://api.dicebear.com/7.x/bottts/svg?seed=TeacherAnand')
ON DUPLICATE KEY UPDATE `Name`=VALUES(`Name`);

INSERT INTO `StudentProfiles` (`UserId`, `Grade`, `SchoolName`, `District`, `XpPoints`, `Level`, `StreakCount`)
VALUES ('usr-student-01', 'Class 8 - Section B', 'Bilaspur Govt High School', 'Bilaspur, Chhattisgarh', 1820, 10, 12)
ON DUPLICATE KEY UPDATE `XpPoints`=VALUES(`XpPoints`);

INSERT INTO `ParentStudentLinks` (`Id`, `ParentId`, `StudentId`)
VALUES ('link-01', 'usr-parent-01', 'usr-student-01')
ON DUPLICATE KEY UPDATE `StudentId`=VALUES(`StudentId`);

-- Seed Courses
INSERT INTO `Courses` (`Id`, `Title`, `Subject`, `Description`, `Language`, `DifficultyLevel`, `Grade`, `ThumbnailUrl`, `VideoUrl`, `Instructor`, `DownloadableSizeMb`, `Rating`, `StudentsCount`, `AiSummaryText`, `AiKeyPointsJson`)
VALUES
('crs-math-01', 'Fractions & Decimals in Village Markets', 'Mathematics', 'Learn fractions, percentages, and real-world currency calculations using relatable examples from weekly village haats and grain markets.', 'en', 'Beginner', 'Class 6-8', 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&auto=format&fit=crop&q=80', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'Master Anand Sharma', 14.2, 4.9, 1420, 'Fractions represent parts of a whole quantity. Dividing 100 kg of grain among 4 sacks yields 25 kg (1/4th) per sack.', '[\"Numerator: The top number representing parts taken.\", \"Denominator: The bottom number representing total equal parts.\", \"Conversion: 1/4 is equal to 0.25 or 25% of any given quantity.\", \"Rule: When multiplying fractions, multiply numerators and denominators directly.\"]'),
('crs-sci-02', 'Photosynthesis & Rainwater Harvesting', 'Science', 'Discover how crops manufacture food from sunlight and how simple rooftop trenches can store clean drinking water during monsoons.', 'hi', 'Intermediate', 'Class 7-9', 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop&q=80', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 'Dr. Meera Nambiar', 18.6, 4.8, 2890, 'Plants transform sunlight, carbon dioxide, and water into glucose and oxygen through chlorophyll pigments in leaf chloroplasts.', '[\"Chlorophyll captures light inside thylakoid membranes.\", \"Leaves absorb CO2 from the atmosphere and roots draw soil water.\", \"Formula: 6CO2 + 6H2O + Sunlight -> C6H12O6 + 6O2.\", \"Rainwater harvesting trenches replenish rural ground water.\"]'),
('crs-agri-03', 'Smart Organic Farming & Soil Health', 'Agriculture', 'Practical modern agricultural science: preparing vermicompost, zero-budget organic pest control, and nitrogen fixation crops.', 'ta', 'Essential', 'Community & Youth', 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=80', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'Farmer Innovator Rajesh Patil', 22.4, 4.95, 3740, 'Organic humus and earthworm composting maximize moisture retention and soil fertility without chemical urea.', '[\"Maintain 30:1 carbon to nitrogen ratio with dry and green foliage.\", \"Eisenia fetida earthworms produce rich castings in 45 days.\", \"Legume crops naturally replenish nitrogen.\"]')
ON DUPLICATE KEY UPDATE `Title`=VALUES(`Title`);

-- Seed Course Modules
INSERT INTO `CourseModules` (`Id`, `CourseId`, `Title`, `SequenceOrder`, `VideoUrl`, `DurationMinutes`)
VALUES
('mod-01', 'crs-math-01', '1. Understanding Halves, Quarters & Eighths', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '10:15'),
('mod-02', 'crs-math-01', '2. Calculating Grain Weights & Division', 2, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '12:40'),
('mod-03', 'crs-math-01', '3. Market Money: Decimals in Action', 3, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '11:20'),
('mod-04', 'crs-math-01', '4. Practical Problem Solving & Quiz', 4, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '10:45'),
('mod-05', 'crs-sci-02', '1. Chlorophyll and the Magic of Sunlight', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '14:00'),
('mod-06', 'crs-sci-02', '2. The Water Cycle in Rural Ecosystems', 2, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '16:15')
ON DUPLICATE KEY UPDATE `Title`=VALUES(`Title`);

-- Seed Enrollments & Offline content
INSERT INTO `Enrollments` (`Id`, `StudentId`, `CourseId`, `ProgressPercent`, `Status`, `EnrolledAt`)
VALUES
('enr-01', 'usr-student-01', 'crs-math-01', 65, 0, NOW() - INTERVAL 10 DAY)
ON DUPLICATE KEY UPDATE `ProgressPercent`=VALUES(`ProgressPercent`);

INSERT INTO `DownloadedContents` (`Id`, `StudentId`, `CourseId`, `DownloadedAt`, `SyncStatus`)
VALUES
('dl-01', 'usr-student-01', 'crs-math-01', NOW() - INTERVAL 3 DAY, 'CachedOffline')
ON DUPLICATE KEY UPDATE `SyncStatus`=VALUES(`SyncStatus`);

-- Seed Daily Quiz & Questions
INSERT INTO `Quizzes` (`Id`, `CourseId`, `Title`, `Difficulty`, `Subject`, `TimeLimitSeconds`, `TotalXp`)
VALUES
('quiz-daily-01', 'crs-math-01', 'Daily Science & Math Quest', 'Easy/Medium', 'Daily Challenge', 60, 100)
ON DUPLICATE KEY UPDATE `Title`=VALUES(`Title`);

INSERT INTO `QuizQuestions` (`Id`, `QuizId`, `QuestionText`, `OptionsJson`, `CorrectOption`, `HintText`, `ExplanationText`, `XpValue`)
VALUES
('q-01', 'quiz-daily-01', 'A farmer divides a 120-acre field equally among 4 sons. What fraction and how many acres does each son receive?', '[\"1/3 and 40 acres\", \"1/4 and 30 acres\", \"1/2 and 60 acres\", \"1/4 and 25 acres\"]', 1, 'Divide total acres (120) by the number of equal parts (4).', '120 / 4 = 30 acres per son. Each portion represents 1 part out of 4 equal parts, which is fraction 1/4.', 25),
('q-02', 'quiz-daily-01', 'Which gas do green crops absorb from the air during photosynthesis in daytime?', '[\"Oxygen (O2)\", \"Nitrogen (N2)\", \"Carbon Dioxide (CO2)\", \"Hydrogen (H2)\"]', 2, 'It is the gas exhaled by humans and animals.', 'Plants take in Carbon Dioxide (CO2) through microscopic leaf stomata and release Oxygen (O2).', 25),
('q-03', 'quiz-daily-01', 'When sending money using UPI, why should you NEVER enter your UPI PIN to RECEIVE money?', '[\"Entering PIN will speed up your bank transfer\", \"Entering your UPI PIN always authorizes money to LEAVE your account\", \"Receiving money requires entering your phone number PIN instead\", \"It blocks your internet banking account\"]', 1, 'Remember the golden rule of UPI banking.', 'A UPI PIN is solely a security lock to debit money from your bank account. You NEVER need to enter a PIN to receive incoming transfers.', 25),
('q-04', 'quiz-daily-01', 'Which natural material is mixed with cow dung to produce rich vermicompost fertilizer for organic crops?', '[\"Dry leaves & red earthworms\", \"Plastic bags & chemical weedicide\", \"Crushed glass & cement\", \"Synthetic diesel oil\"]', 0, 'Think about decomposer organisms and dry carbon matter.', 'Vermicomposting utilizes earthworms alongside organic residues and dry foliage to produce rich humus.', 25)
ON DUPLICATE KEY UPDATE `QuestionText`=VALUES(`QuestionText`);

-- Seed Badges
INSERT INTO `Badges` (`Id`, `Name`, `Description`, `Category`, `IconEmoji`, `Rarity`, `XpReward`, `RequirementType`, `RequirementValue`)
VALUES
('bdg-streak-7', '7-Day Flame', 'Studied for 7 consecutive days without missing a lesson.', 'Consistency', '🔥', 'Common', 100, 'Streak', 7),
('bdg-offline-champ', 'Offline Champion', 'Completed 5 full course modules while completely offline.', 'Resilience', '📡', 'Rare', 250, 'Offline', 5),
('bdg-math-wizard', 'Math Haat Wizard', 'Scored 100% on 3 consecutive market fraction quizzes.', 'Mastery', '🧮', 'Epic', 300, 'QuizScore', 3),
('bdg-eco-warrior', 'Eco Guardian', 'Completed the soil health and composting practical challenge.', 'Science', '🌱', 'Rare', 200, 'Practical', 1),
('bdg-streak-30', '30-Day Legend', 'Maintain a flawless 30-day continuous learning streak.', 'Consistency', '⚡', 'Legendary', 1000, 'Streak', 30)
ON DUPLICATE KEY UPDATE `Name`=VALUES(`Name`);

INSERT INTO `StudentBadges` (`Id`, `StudentId`, `BadgeId`, `EarnedAt`)
VALUES
('sbdg-01', 'usr-student-01', 'bdg-streak-7', NOW() - INTERVAL 2 DAY)
ON DUPLICATE KEY UPDATE `BadgeId`=VALUES(`BadgeId`);

-- Seed Leaderboard Snapshots
INSERT INTO `LeaderboardSnapshots` (`Id`, `StudentId`, `StudentName`, `SchoolName`, `District`, `XpPoints`, `Rank`, `Streak`, `Level`, `AvatarUrl`, `Period`)
VALUES
('lb-01', 'usr-02', 'Aarav Sharma', 'Rampur Zilla Parishad High School', 'Rampur, MP', 2450, 1, 18, 14, 'https://api.dicebear.com/7.x/bottts/svg?seed=Aarav', 0),
('lb-02', 'usr-03', 'Lakshmi Priya', 'Kallakurichi Govt Girls School', 'Kallakurichi, TN', 2280, 2, 21, 13, 'https://api.dicebear.com/7.x/bottts/svg?seed=Lakshmi', 0),
('lb-03', 'usr-04', 'Bikash Mondal', 'Sundarbans Coastal Vidyalaya', 'Gosaba, WB', 2110, 3, 15, 12, 'https://api.dicebear.com/7.x/bottts/svg?seed=Bikash', 0),
('lb-04', 'usr-student-01', 'Karan Verma (You)', 'Bilaspur Govt High School', 'Bilaspur, CG', 1820, 5, 12, 10, 'https://api.dicebear.com/7.x/bottts/svg?seed=Karan', 0)
ON DUPLICATE KEY UPDATE `XpPoints`=VALUES(`XpPoints`);

-- Seed Timetable Sessions
INSERT INTO `TimetableSessions` (`Id`, `StudentId`, `Subject`, `Topic`, `DayOfWeek`, `StartTime`, `EndTime`, `RoomOrLink`, `ReminderEnabled`, `IsCompleted`)
VALUES
('tt-01', 'usr-student-01', 'Mathematics', 'Market Fractions & Weights', 'Monday', '08:30 AM', '09:15 AM', 'Village Study Hall / Offline Tab', 1, 1),
('tt-02', 'usr-student-01', 'Science', 'Photosynthesis & Solar Cells', 'Monday', '10:00 AM', '10:45 AM', 'Smart TV Room', 1, 1),
('tt-03', 'usr-student-01', 'English', 'Conversational Dialogues & Greetings', 'Tuesday', '09:00 AM', '09:45 AM', 'Audio Listening Booth', 1, 0)
ON DUPLICATE KEY UPDATE `Topic`=VALUES(`Topic`);

-- Seed Initial Notifications
INSERT INTO `Notifications` (`Id`, `UserId`, `Title`, `Message`, `Type`, `ReadStatus`, `CreatedAt`)
VALUES
('notif-01', 'usr-student-01', '🔥 12-Day Streak Achieved!', 'You have learned consistently for 12 days. Only 2 days away from a 2-week trophy!', 0, 0, NOW() - INTERVAL 1 HOUR),
('notif-02', 'usr-student-01', '📥 Module Download Ready', '\"Photosynthesis & Rainwater Harvesting\" is cached for offline study.', 3, 1, NOW() - INTERVAL 1 DAY)
ON DUPLICATE KEY UPDATE `Title`=VALUES(`Title`);

