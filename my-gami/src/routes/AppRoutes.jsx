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
      {/* First Page when opening the project: Login Portal */}
      <Route path="/" element={<AuthPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/portals" element={<PortalGatewayPage />} />
      <Route path="/landing" element={<LandingPage />} />
      
      {/* Student Portal Exclusive Routes */}
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

      {/* Teacher / Faculty Portal Route */}
      <Route 
        path="/teacher" 
        element={
          <RoleGuard allowedRoles={['teacher', 'admin']}>
            <TeacherDashboardPage />
          </RoleGuard>
        } 
      />

      {/* Admin Portal Route */}
      <Route 
        path="/admin" 
        element={
          <RoleGuard allowedRoles={['admin']}>
            <AdminPortalPage />
          </RoleGuard>
        } 
      />

      {/* Parent Portal Route */}
      <Route 
        path="/parent" 
        element={
          <RoleGuard allowedRoles={['parent']}>
            <ParentDashboardPage />
          </RoleGuard>
        } 
      />

      {/* Role-Specific Shared Academic Routes */}
      <Route 
        path="/courses" 
        element={
          <RoleGuard allowedRoles={['student', 'teacher', 'admin']}>
            <CourseLibraryPage />
          </RoleGuard>
        } 
      />
      <Route 
        path="/course/:id" 
        element={
          <RoleGuard allowedRoles={['student', 'teacher', 'admin']}>
            <CoursePlayerPage />
          </RoleGuard>
        } 
      />
      <Route 
        path="/tasks" 
        element={
          <RoleGuard allowedRoles={['student', 'teacher']}>
            <TaskPlannerPage />
          </RoleGuard>
        } 
      />
      <Route 
        path="/reports" 
        element={
          <RoleGuard allowedRoles={['student', 'teacher', 'parent', 'admin']}>
            <ProgressReportsPage />
          </RoleGuard>
        } 
      />
      <Route 
        path="/timetable" 
        element={
          <RoleGuard allowedRoles={['student', 'teacher', 'parent']}>
            <TimetablePage />
          </RoleGuard>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <RoleGuard allowedRoles={['student', 'teacher']}>
            <ProfilePage />
          </RoleGuard>
        } 
      />
      <Route path="/accessibility" element={<AccessibilityPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
