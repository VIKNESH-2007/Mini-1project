import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

// Create configured Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gamilearn_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified response handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If backend is unreachable or offline, preserve error details
    const message = error.response?.data?.message || error.message || 'Network error';
    return Promise.reject({
      status: error.response?.status,
      message,
      data: error.response?.data,
      isOffline: !navigator.onLine || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED'
    });
  }
);

// API Service Functions
export const api = {
  // 1. Authentication
  auth: {
    login: async (email, password) => {
      return apiClient.post('/auth/login', { email, password });
    },
    register: async (userData) => {
      return apiClient.post('/auth/register', userData);
    },
    getMe: async () => {
      return apiClient.get('/auth/me');
    }
  },

  // 2. Student Dashboard
  dashboard: {
    getStudentStats: async (studentId) => {
      return apiClient.get(`/dashboard/student/${studentId}`);
    }
  },

  // 3. Courses
  courses: {
    getAll: async (params = {}) => {
      return apiClient.get('/courses', { params });
    },
    getById: async (courseId) => {
      return apiClient.get(`/courses/${courseId}`);
    },
    enroll: async (courseId, studentId) => {
      return apiClient.post(`/courses/${courseId}/enroll`, { studentId });
    },
    updateProgress: async (courseId, studentId, progressPercent) => {
      return apiClient.post(`/courses/${courseId}/progress`, { studentId, progressPercent });
    },
    downloadOffline: async (courseId, studentId) => {
      return apiClient.post(`/courses/${courseId}/download`, { studentId });
    },
    getAiSummary: async (courseId) => {
      return apiClient.get(`/courses/${courseId}/ai-summary`);
    }
  },

  // 4. Quizzes
  quizzes: {
    getAll: async () => {
      return apiClient.get('/quizzes');
    },
    getById: async (quizId) => {
      return apiClient.get(`/quizzes/${quizId}`);
    },
    submit: async (submission) => {
      return apiClient.post('/quizzes/submit', submission);
    },
    getAttempts: async (studentId) => {
      return apiClient.get(`/quizzes/attempts/${studentId}`);
    }
  },

  // 5. Gamification (XP, Badges, Leaderboard)
  gamification: {
    getLeaderboard: async (period = 'Weekly') => {
      return apiClient.get('/gamification/leaderboard', { params: { period } });
    },
    getBadges: async (studentId) => {
      return apiClient.get(`/gamification/badges/${studentId}`);
    },
    awardXp: async (studentId, xpPoints, reason) => {
      return apiClient.post('/gamification/award-xp', { studentId, xpPoints, reason });
    }
  },

  // 6. AI Doubt Tutor
  aiTutor: {
    ask: async (studentId, questionText, language = 'en') => {
      return apiClient.post('/ai-tutor/ask', { studentId, questionText, language });
    },
    getHistory: async (studentId) => {
      return apiClient.get(`/ai-tutor/history/${studentId}`);
    }
  },

  // 7. Student Analytics & ML Risk Assessment
  progress: {
    getReport: async (studentId) => {
      return apiClient.get(`/progress/${studentId}`);
    },
    predictRisk: async (studentId) => {
      return apiClient.get(`/progress/${studentId}/predict-risk`);
    }
  },

  // 8. Timetable
  timetable: {
    getStudentSessions: async (studentId) => {
      return apiClient.get(`/timetable/${studentId}`);
    },
    createSession: async (session) => {
      return apiClient.post('/timetable', session);
    },
    updateSession: async (id, session) => {
      return apiClient.put(`/timetable/${id}`, session);
    },
    deleteSession: async (id) => {
      return apiClient.delete(`/timetable/${id}`);
    }
  },

  // 9. Parent Portal
  parent: {
    getChildren: async (parentId) => {
      return apiClient.get(`/parent/${parentId}/children`);
    },
    sendMessageToTeacher: async (messageData) => {
      return apiClient.post('/parent/message-teacher', messageData);
    },
    getMilestones: async (parentId) => {
      return apiClient.get(`/parent/${parentId}/milestones`);
    }
  },

  // 10. Offline Sync Queue
  sync: {
    uploadPending: async (studentId, events) => {
      return apiClient.post('/sync/upload', { studentId, events });
    },
    getPending: async (studentId) => {
      return apiClient.get(`/sync/pending/${studentId}`);
    }
  },

  // 11. Student Task Scheduler & Progress Tracking
  tasks: {
    getAll: async (studentId, params = {}) => {
      return apiClient.get(`/tasks/${studentId}`, { params });
    },
    getProgress: async (studentId) => {
      return apiClient.get(`/tasks/${studentId}/progress`);
    },
    create: async (taskData) => {
      return apiClient.post('/tasks', taskData);
    },
    update: async (id, taskData) => {
      return apiClient.put(`/tasks/${id}`, taskData);
    },
    toggle: async (id) => {
      return apiClient.patch(`/tasks/${id}/toggle`);
    },
    delete: async (id) => {
      return apiClient.delete(`/tasks/${id}`);
    }
  }
};

export default api;
