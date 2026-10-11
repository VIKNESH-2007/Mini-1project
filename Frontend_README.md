# 🌾 GamiLearn Rural — Frontend Documentation (`my-gami`)

This file documents the **React 19 Frontend Application (`my-gami`)** for **GamiLearn Rural**, an AI-powered, offline-first, multilingual, and gamified educational platform for rural and engineering students.

---

## ✨ Core Frontend Capabilities

### 1. 🎥 Live AI Teacher Google Meet Classroom
- **File**: `src/components/ai/GoogleMeetClassroomModal.jsx`
- **Features**:
  - Interactive live video lectures with audible Web Speech Synthesis (`SpeechSynthesisUtterance`), volume/speed controls, and live synchronized captions.
  - Real-time student camera and microphone stream via WebRTC (`navigator.mediaDevices.getUserMedia`).
  - Active student speech listener: when the student's mic is unmuted, the AI Teacher listens to spoken questions and replies aloud.
  - Class attendees grid displaying **Sanjay (You)**, **Rishi**, **Saran**, **Kavitha**, **Karthik**, and **Deepika**.

### 2. 🎙️ Multilingual Rural Voice Assistant
- **Files**: `src/components/common/VoiceAssistantModal.jsx`, `src/hooks/useSpeechRecognition.js`
- **Features**:
  - Continuous speech recognition supporting **Tamil (`ta-IN`)**, **Hindi (`hi-IN`)**, and **English (`en-IN`)**.
  - Live streaming interim transcript (`🎙️ Hearing: "..."`) and 5-bar animated voice equalizer.
  - Automatic silence detection (1.2s–1.4s pause) that finalizes speech and triggers an audible voice response automatically.

### 3. 🌐 Whole-Project Dynamic Localization
- **Files**: `src/context/LanguageContext.jsx`, `src/data/translations.js`
- **Features**:
  - Instant full-page translation across **English (`en`)**, **Tamil (`ta`)**, **Hindi (`hi`)**, **Telugu (`te`)**, **Bengali (`bn`)**, **Marathi (`mr`)**, and **Spanish (`es`)**.
  - Two-tier localization combining React `t()` hooks with a global `MutationObserver` DOM text-node translator.

### 4. 📶 Offline Packet Store & Zero-Internet Learning
- **Files**: `src/context/OfflineContext.jsx`, `src/components/common/OfflineBanner.jsx`
- **Features**:
  - Local caching of courses and lessons for offline study.
  - Rural offline simulation toggle and 1-click cloud synchronization when back online.

### 5. ♿ Universal Accessibility & Inclusive Design
- **Files**: `src/pages/AccessibilityPage.jsx`, `src/context/AccessibilityContext.jsx`, `src/components/common/SignLanguageModal.jsx`
- **Features**:
  - Text size scaling (`100%`, `115%`, `130%`).
  - Contrast themes: **Standard Light**, **High Contrast (Yellow / Black)**, and **Dark Mode**.
  - **Dyslexia-Friendly Typography** toggle.
  - Floating **Indian Sign Language (ISL)** Picture-in-Picture interpreter.

### 6. 🚪 Multi-Role Portals & Verified Google Sign-In
- **Files**: `src/pages/AuthPage.jsx`, `src/pages/PortalGatewayPage.jsx`, `src/context/AuthContext.jsx`
- **Roles**:
  - 🎒 **Student**: `Sanjay` (`sanjay@college-cs.edu`)
  - 👨‍🏫 **Faculty**: `Prof. Senthil Nathan`
  - 🏛️ **College Admin**: `Dr. Meenakshi Sundaram`
  - 👨‍👧 **Parent**: `Murugan` (Child: `Sanjay`)

---

## 📂 Frontend Directory Structure

```text
my-gami/
├── public/                      # Static assets, index.html, manifest.json
├── src/
│   ├── components/
│   │   ├── ai/                  # AIChatWindow.jsx, GoogleMeetClassroomModal.jsx, SuggestedChips.jsx
│   │   ├── charts/              # ActivityHeatmap.jsx, SimpleBarChart.jsx
│   │   ├── common/              # Navbar.jsx, Sidebar.jsx, OfflineBanner.jsx, VoiceAssistantModal.jsx, SignLanguageModal.jsx
│   │   ├── course/              # CourseCard.jsx, CourseNotes.jsx, VideoPlayer.jsx
│   │   └── quiz/                # QuizCard.jsx, QuizSummary.jsx
│   ├── context/                 # AuthContext, LanguageContext, AccessibilityContext, OfflineContext, GamificationContext
│   ├── data/                    # translations.js, mockCourses.js, mockQuiz.js, mockLeaderboard.js, mockTimetable.js
│   ├── hooks/                   # useSpeechRecognition.js
│   ├── pages/                   # StudentDashboard, AITutorPage, CourseLibraryPage, QuizPage, AccessibilityPage, AuthPage, etc.
│   ├── routes/                  # AppRoutes.jsx
│   ├── App.js                   # Root layout & context providers
│   └── index.js                 # Application entry point
└── package.json                 # Dependencies & scripts
```

---

## 🚀 How to Run Frontend

```bash
cd my-gami
npm install
npm start
```
- Development server runs at: `http://localhost:3000`
- Production build command: `npm run build`
