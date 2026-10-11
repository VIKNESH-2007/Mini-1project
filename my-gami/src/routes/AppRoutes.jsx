import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import LandingPage from '../pages/LandingPage';
import AuthPage from '../pages/AuthPage';
import StudentDashboard from '../pages/StudentDashboard';
import CourseLibraryPage from '../pages/CourseLibraryPage';
import CoursePlayerPage from '../pages/CoursePlayerPage';
import QuizPage from '../pages/QuizPage';
import LeaderboardPage from '../pages/LeaderboardPage';
import AITutorPage from '../pages/AITutorPage';
import ProgressReportsPage from '../pages/ProgressReportsPage';
import ParentDashboardPage from '../pages/ParentDashboardPage';
import TeacherDashboardPage from '../pages/TeacherDashboardPage';
import AdminPortalPage from '../pages/AdminPortalPage';
import PortalGatewayPage from '../pages/PortalGatewayPage';
import TimetablePage from '../pages/TimetablePage';
import TaskPlannerPage from '../pages/TaskPlannerPage';
import AccessibilityPage from '../pages/AccessibilityPage';
import ProfilePage from '../pages/ProfilePage';

function RoleGuard({ allowedRoles, children, fallbackPath }) {
  const { currentUser } = useAuth();
  const role = currentUser?.role || 'student';
  if (!allowedRoles.includes(role)) {
    const defaultFallback = role === 'teacher' ? '/teacher' : role === 'admin' ? '/admin' : role === 'parent' ? '/parent' : '/dashboard';
    return <Navigate to={fallbackPath || defaultFallback} replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/portals" element={<PortalGatewayPage />} />
      <Route path="/auth" element={<AuthPage />} />
      
      {/* Student Only Routes */}
      <Route 
        path="/dashboard" 
        element={
          <RoleGuard allowedRoles={['student']}>
            <StudentDashboard />
          </RoleGuard>
        } 
      />
      <Route 
        path="/quiz" 
        element={
          <RoleGuard allowedRoles={['student']}>
            <QuizPage />
          </RoleGuard>
        } 
      />
      <Route 
        path="/leaderboard" 
        element={
          <RoleGuard allowedRoles={['student']}>
            <LeaderboardPage />
          </RoleGuard>
        } 
      />
      <Route 
        path="/ai-tutor" 
        element={
          <RoleGuard allowedRoles={['student']}>
            <AITutorPage />
          </RoleGuard>
        } 
      />

      {/* Teacher / Faculty Routes */}
      <Route 
        path="/teacher" 
        element={
          <RoleGuard allowedRoles={['teacher', 'admin']} fallbackPath="/dashboard">
            <TeacherDashboardPage />
          </RoleGuard>
        } 
      />

      {/* Admin Only Route */}
      <Route 
        path="/admin" 
        element={
          <RoleGuard allowedRoles={['admin']} fallbackPath="/dashboard">
            <AdminPortalPage />
          </RoleGuard>
        } 
      />

      {/* Parent Only Route */}
      <Route 
        path="/parent" 
        element={
          <RoleGuard allowedRoles={['parent']} fallbackPath="/dashboard">
            <ParentDashboardPage />
          </RoleGuard>
        } 
      />

      {/* Shared Educational & System Routes */}
      <Route path="/courses" element={<CourseLibraryPage />} />
      <Route path="/course/:id" element={<CoursePlayerPage />} />
      <Route path="/tasks" element={<TaskPlannerPage />} />
      <Route path="/reports" element={<ProgressReportsPage />} />
      <Route path="/timetable" element={<TimetablePage />} />
      <Route path="/accessibility" element={<AccessibilityPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/portals" replace />} />
    </Routes>
  );
}
