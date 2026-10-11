import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const demoProfiles = {
  student: {
    id: "usr-student-01",
    name: "Sanjay",
    role: "student",
    email: "sanjay@college-cs.edu",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Sanjay",
    school: "Institute of Technology & Computer Science",
    grade: "B.Tech Computer Science - Year 2",
    village: "Engineering Campus",
    parentId: "usr-parent-01",
    learningTrack: "self", // 'self' (AI Teacher) or 'college' (Admin-Assigned Faculty)
    assignedTeacherId: "usr-teacher-01",
    assignedTeacherName: "Prof. Senthil Nathan (CS Dept)",
    batchName: "B.Tech CS 2026 - Sec A"
  },
  teacher: {
    id: "usr-teacher-01",
    name: "Prof. Senthil Nathan",
    role: "teacher",
    email: "senthil.nathan@college-cs.edu",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ProfSenthil",
    school: "Institute of Technology & Computer Science",
    department: "Computer Science & Engineering",
    designation: "Associate Professor & Lab Head",
    grade: "Faculty - CS Dept",
    village: "Faculty Quarters, Tech Campus",
    coursesTeaching: ["Data Structures & C++", "Java Enterprise Systems", "Docker & Cloud DevOps"],
    assignedStudentsCount: 38
  },
  admin: {
    id: "usr-admin-01",
    name: "Dr. Meenakshi Sundaram",
    role: "admin",
    email: "admin@college-cs.edu",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=AdminMeenakshi",
    school: "Institute of Technology & Computer Science",
    department: "Academic Affairs & Administration",
    designation: "Academic Dean & System Administrator",
    grade: "Admin Command",
    village: "Central Administrative Block"
  },
  parent: {
    id: "usr-parent-01",
    name: "Murugan",
    role: "parent",
    email: "murugan@familymail.in",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=MuruganParent",
    childName: "Sanjay",
    childGrade: "B.Tech Computer Science",
    phone: "+91 98765 43210",
    village: "Campus Quarters"
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('gamilearn_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name === "Karan Verma" || parsed.email === "karan.verma@college-cs.edu") {
          return demoProfiles.student;
        }
        return parsed;
      } catch (e) {}
    }
    return demoProfiles.student;
  });
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('gamilearn_token') || null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('gamilearn_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('gamilearn_user');
      localStorage.removeItem('gamilearn_token');
    }
  }, [currentUser]);

  const switchRole = (role) => {
    if (demoProfiles[role]) {
      setCurrentUser(demoProfiles[role]);
    }
  };

  const switchStudentTrack = (track) => {
    setCurrentUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, learningTrack: track };
      localStorage.setItem('gamilearn_user', JSON.stringify(updated));
      return updated;
    });
  };

  const updateTeacherAssignment = (assignment) => {
    setCurrentUser(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        learningTrack: assignment.learningTrack || prev.learningTrack,
        assignedTeacherId: assignment.teacherId || prev.assignedTeacherId,
        assignedTeacherName: assignment.teacherName || prev.assignedTeacherName,
        batchName: assignment.batchName || prev.batchName
      };
      localStorage.setItem('gamilearn_user', JSON.stringify(updated));
      return updated;
    });
  };

  const register = async (userData) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      // 1. Save in local registered users database
      const existing = JSON.parse(localStorage.getItem('gamilearn_registered_users') || '[]');
      const emailLower = (userData.email || '').toLowerCase().trim();
      
      const alreadyExists = existing.find(u => u.email.toLowerCase() === emailLower);
      if (alreadyExists) {
        throw new Error('An account with this email/username already exists.');
      }

      const newUserRecord = {
        id: `usr-${Date.now()}`,
        name: userData.fullName || 'Student Learner',
        email: emailLower,
        password: userData.password,
        role: userData.role || 'student',
        grade: userData.grade || 'B.Tech Computer Science',
        school: userData.college || 'Institute of Technology & Computer Science',
        village: userData.district || 'Engineering Campus',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userData.fullName || 'User')}`,
        xpPoints: 100,
        level: 1,
        streakCount: 1,
        createdAt: new Date().toISOString()
      };

      existing.push(newUserRecord);
      localStorage.setItem('gamilearn_registered_users', JSON.stringify(existing));

      // 2. Attempt backend registration
      try {
        await api.auth.register({
          name: newUserRecord.name,
          email: newUserRecord.email,
          password: userData.password,
          role: newUserRecord.role === 'student' ? 0 : 1,
          preferredLanguage: userData.language || 'en',
          grade: newUserRecord.grade,
          district: newUserRecord.village
        });
      } catch (backendErr) {
        console.warn('Backend registration offline, saved in local account vault:', backendErr);
      }

      return { success: true, user: newUserRecord };
    } catch (err) {
      setAuthError(err.message || 'Registration failed');
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (role, email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    const cleanEmail = (email || '').toLowerCase().trim();

    try {
      // 1. Attempt real authentication against backend API
      try {
        const response = await api.auth.login(cleanEmail, password);
        if (response && response.success && response.data) {
          const backendUser = response.data.user;
          const normalizedRole = (backendUser.role || role || 'Student').toLowerCase();
          const profile = {
            id: backendUser.id,
            name: backendUser.name,
            email: backendUser.email,
            role: normalizedRole,
            avatar: backendUser.avatarUrl || demoProfiles[normalizedRole]?.avatar,
            grade: backendUser.grade || demoProfiles[normalizedRole]?.grade || "B.Tech Computer Science",
            school: backendUser.schoolName || demoProfiles[normalizedRole]?.school || "Institute of Technology & CS",
            village: backendUser.district || demoProfiles[normalizedRole]?.village || "Engineering Campus",
            xpPoints: backendUser.xpPoints ?? 1820,
            level: backendUser.level ?? 10,
            streakCount: backendUser.streakCount ?? 12
          };
          localStorage.setItem('gamilearn_token', response.data.token);
          setAuthToken(response.data.token);
          setCurrentUser(profile);
          return { success: true, user: profile };
        }
      } catch (apiErr) {
        console.warn("Backend auth unavailable, checking local registered accounts vault...", apiErr);
      }

      // 2. Check locally registered users in localStorage
      const registered = JSON.parse(localStorage.getItem('gamilearn_registered_users') || '[]');
      const matched = registered.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);
      if (matched) {
        setCurrentUser(matched);
        return { success: true, user: matched };
      }

      // 3. Check demo profiles if email matches demo
      const demoKey = role in demoProfiles ? role : 'student';
      if (cleanEmail === demoProfiles[demoKey].email.toLowerCase()) {
        const profile = demoProfiles[demoKey];
        setCurrentUser(profile);
        return { success: true, user: profile, offline: true };
      }

      // 4. If user typed custom credentials and wants offline login
      const customProfile = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0] || "Student",
        email: cleanEmail,
        role: role || 'student',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
        grade: "Undergraduate Computer Science",
        school: "Institute of Technology & Computer Science",
        village: "Engineering Campus",
        xpPoints: 200,
        level: 2,
        streakCount: 1
      };
      setCurrentUser(customProfile);
      return { success: true, user: customProfile, offline: true };

    } catch (err) {
      setAuthError(err.message || 'Login failed');
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const loginWithGoogle = async (role = 'student', customEmail = '', customName = '') => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const emailToUse = customEmail.trim() || (role === 'student' ? 'vasan@gmail.com' : `${role}.user@gmail.com`);
      const defaultName = customName.trim() || 
        (emailToUse.includes('vasan') ? 'Vasanth Kumar' : emailToUse.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));

      const googleUser = {
        id: `usr-google-${Date.now()}`,
        name: defaultName,
        email: emailToUse,
        role: role,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(defaultName)}`,
        grade: "B.Tech Computer Science - Year 2",
        school: "Institute of Technology & Computer Science",
        village: "University Tech Campus",
        xpPoints: 2850,
        level: 14,
        streakCount: 18,
        isGoogleAuth: true,
        emailVerified: true
      };

      localStorage.setItem('gamilearn_token', 'google_mock_jwt_token_' + Date.now());
      localStorage.setItem('gamilearn_user', JSON.stringify(googleUser));
      setAuthToken('google_mock_jwt_token');
      setCurrentUser(googleUser);
      return { success: true, user: googleUser };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem('gamilearn_user');
    localStorage.removeItem('gamilearn_token');
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      authToken,
      authLoading,
      authError,
      switchRole,
      switchStudentTrack,
      updateTeacherAssignment,
      login,
      loginWithGoogle,
      register,
      logout,
      isStudent: currentUser?.role === 'student',
      isParent: currentUser?.role === 'parent',
      isTeacher: currentUser?.role === 'teacher',
      isAdmin: currentUser?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
