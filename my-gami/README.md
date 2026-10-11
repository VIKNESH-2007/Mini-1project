# 🌾 GamiLearn Rural — Frontend (`my-gami`)

This directory contains the React frontend application for **GamiLearn Rural**, an AI-powered, offline-first, multilingual, and gamified educational platform for rural and engineering students.

For full project architecture (including the `.NET 10.0` backend in `../Gamiweb`), see the root [README.md](../README.md).

---

## ✨ Core Frontend Capabilities

- **🎥 Live AI Teacher Google Meet Classroom** (`src/components/ai/GoogleMeetClassroomModal.jsx`):
  - Interactive live video lectures with audible Web Speech Synthesis (`SpeechSynthesisUtterance`), volume/speed controls, live captions, WebRTC student camera/mic feed, and active participant grid (**Sanjay**, **Rishi**, **Saran**, **Kavitha**, **Karthik**, **Deepika**).
- **🎙️ Rural Voice Assistant** (`src/components/common/VoiceAssistantModal.jsx` & `src/hooks/useSpeechRecognition.js`):
  - Continuous speech recognition in **Tamil (`ta-IN`)**, **Hindi (`hi-IN`)**, and **English (`en-IN`)** with automatic silence detection and spoken audio replies.
- **🌐 Whole-Project Multilingual Translation** (`src/context/LanguageContext.jsx` & `src/data/translations.js`):
  - Instant UI translation across **English**, **Tamil (தமிழ்)**, **Hindi (हिंदी)**, **Telugu (తెలుగు)**, **Bengali (বাংলা)**, **Marathi (मराठी)**, and **Spanish (Español)**.
- **📶 Offline Packet Store & Sync** (`src/context/OfflineContext.jsx`):
  - Download courses for offline study, simulate rural zero-internet conditions, and sync progress.
- **♿ Universal Accessibility** (`src/pages/AccessibilityPage.jsx`):
  - Font scaling (`100%`–`130%`), High Contrast (`Yellow / Black`), Dark Mode, Dyslexia-friendly typography, and Indian Sign Language (ISL) Picture-in-Picture interpreter.

---

## 🚀 Available Scripts

In the `my-gami` directory, you can run:

### `npm install`
Installs all project dependencies.

### `npm start`
Runs the app in development mode at **[http://localhost:3000](http://localhost:3000)**.

### `npm run build`
Builds the app for production into the `build/` folder, bundling and optimizing React for best performance.
