'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Clock,
  Bot,
  Zap,
  TrendingUp,
  Users,
  FileText,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Plus,
  Activity,
  Globe,
} from 'lucide-react';
import type { LMSUser } from './LMSApp';

interface LMSDashboardProps {
  user: LMSUser | null;
  travelerName: string;
  workspace: string;
  onNavigateCourse: (courseId: string) => void;
}

interface DashboardData {
  user: { id: string; name: string; email: string; role: string };
  stats: { totalUsers: number; totalCourses: number; totalEnrollments: number };
  studentData: {
    enrollments: Array<{
      id: string;
      progress: number;
      status: string;
      course: {
        id: string;
        title: string;
        code: string;
        category: string;
        modules: Array<{ lessons: Array<unknown> }>;
        assignments: Array<unknown>;
      };
    }>;
    upcomingAssignments: Array<{
      id: string;
      title: string;
      dueDate: string;
      type: string;
      maxScore: number;
      course: { title: string; code: string };
    }>;
    recentSubmissions: Array<{
      id: string;
      status: string;
      grade: number | null;
      submittedAt: string;
      assignment: { title: string; course: { title: string; code: string } };
    }>;
    studentProgress: Array<{
      courseId: string;
      courseTitle: string;
      courseCode: string;
      progress: number;
      totalLessons: number;
      status: string;
    }>;
  };
  tutorData: {
    pendingReviewCount: number;
    aiReviewedSubmissions: Array<{
      id: string;
      status: string;
      aiFeedback: string | null;
      user: { name: string; email: string };
      assignment: { title: string; course: { title: string } };
      submittedAt: string;
    }>;
    tutoredCourses: Array<{ courseId: string; courseTitle: string; courseCode: string }>;
  };
  adminData: {
    allUsers: Array<{ id: string; name: string; email: string; role: string; createdAt: string }>;
    allCourses: Array<{
      id: string; title: string; code: string; status: string;
      _count: { enrollments: number; assignments: number };
    }>;
  };
}

export function LMSDashboard({ user, travelerName, workspace, onNavigateCourse }: LMSDashboardProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`/api/lms/dashboard?userId=${user.id}&role=${user.role}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user?.id, user?.role]);

  if (loading || !data) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-[#8A0000] rounded-full animate-spin" />
      </div>
    );
  }

  const role = user?.role || 'student';

  if (role === 'admin') return <AdminDashboard data={data} onNavigateCourse={onNavigateCourse} />;
  if (role === 'tutor') return <TutorDashboard data={data} user={user} onNavigateCourse={onNavigateCourse} />;
  return <StudentDashboard data={data} travelerName={travelerName} workspace={workspace} onNavigateCourse={onNavigateCourse} />;
}

/* ─── Student Dashboard ─── */
function StudentDashboard({ data, travelerName, workspace, onNavigateCourse }: {
  data: DashboardData;
  travelerName: string;
  workspace: string;
  onNavigateCourse: (courseId: string) => void;
}) {
  const firstName = travelerName.split(' ')[0] || 'Explorer';
  const { enrollments, upcomingAssignments, recentSubmissions, studentProgress } = data.studentData;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Card */}
      <motion.div
        className="bg-gradient-to-r from-[#8A0000]/20 via-[#8A0000]/10 to-transparent rounded-2xl p-6 border border-[#8A0000]/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
              Welcome back, {firstName}
            </h1>
            <p className="text-gray-400">Continue your learning journey at {workspace}</p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-[#1a1a1a] rounded-xl px-4 py-2.5 border border-white/5">
            <Bot className="w-4 h-4 text-[#8A0000]" />
            <span className="text-sm text-gray-300">AI Tutor ready</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Enrolled Courses', value: enrollments.length, icon: <BookOpen className="w-4 h-4" />, color: 'text-[#8A0000]' },
          { label: 'Upcoming Due', value: upcomingAssignments.length, icon: <Clock className="w-4 h-4" />, color: 'text-amber-400' },
          { label: 'Submissions', value: recentSubmissions.length, icon: <FileText className="w-4 h-4" />, color: 'text-emerald-400' },
          { label: 'Avg Progress', value: studentProgress.length > 0 ? Math.round(studentProgress.reduce((a, b) => a + b.progress, 0) / studentProgress.length) + '%' : '0%', icon: <TrendingUp className="w-4 h-4" />, color: 'text-blue-400' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={stat.color}>{stat.icon}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enrolled Courses */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            My Courses
          </h2>
          {enrollments.length === 0 ? (
            <div className="bg-[#1a1a1a] rounded-xl p-8 border border-white/5 text-center">
              <BookOpen className="w-8 h-8 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">You haven&apos;t enrolled in any courses yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {enrollments.map((enrollment, i) => (
                <motion.button
                  key={enrollment.id}
                  onClick={() => onNavigateCourse(enrollment.course.id)}
                  className="w-full bg-[#1a1a1a] rounded-xl p-5 border border-white/5 hover:border-[#8A0000]/30 transition-all text-left group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8A0000]/10 text-[#8A0000] font-mono">
                          {enrollment.course.code}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-500">
                          {enrollment.course.category}
                        </span>
                      </div>
                      <h3 className="text-white font-semibold text-sm group-hover:text-[#8A0000] transition-colors truncate">
                        {enrollment.course.title}
                      </h3>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-[#8A0000] transition-colors shrink-0 ml-4" />
                  </div>
                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Progress</span>
                      <span className="text-gray-400 font-mono">{Math.round(enrollment.progress)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#242424] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#8A0000] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${enrollment.progress}%` }}
                        transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {enrollment.course.assignments.length} assignments
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {enrollment.course.modules.reduce((a, m) => a + m.lessons.length, 0)} lessons
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {/* Recent Activity */}
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4" />
              Recent Activity
            </h2>
            <div className="space-y-2">
              {recentSubmissions.map((sub, i) => (
                <motion.div
                  key={sub.id}
                  className="flex items-center gap-3 px-4 py-3 bg-[#1a1a1a] rounded-lg border border-white/5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                >
                  {sub.status === 'graded' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : sub.status === 'ai_reviewed' ? (
                    <Bot className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-500 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 truncate">Submitted: {sub.assignment.title}</p>
                    <p className="text-xs text-gray-600">{sub.assignment.course.code}</p>
                  </div>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                    sub.status === 'graded' ? 'bg-emerald-500/10 text-emerald-400' :
                    sub.status === 'ai_reviewed' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-white/5 text-gray-500'
                  }`}>
                    {sub.status === 'graded' ? `${sub.grade}%` : sub.status.replace('_', ' ')}
                  </span>
                </motion.div>
              ))}
              {recentSubmissions.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Upcoming Deadlines */}
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4" />
              Upcoming Deadlines
            </h2>
            <div className="space-y-2">
              {upcomingAssignments.map((a, i) => {
                const daysLeft = Math.ceil((new Date(a.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                return (
                  <motion.div
                    key={a.id}
                    className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm text-white font-medium truncate">{a.title}</h4>
                    </div>
                    <p className="text-xs text-gray-500">{a.course.code} · {a.type}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        daysLeft <= 3 ? 'bg-red-500/10 text-red-400' :
                        daysLeft <= 7 ? 'bg-amber-500/10 text-amber-400' :
                        'bg-white/5 text-gray-500'
                      }`}>
                        {daysLeft}d left
                      </span>
                      <span className="text-[10px] text-gray-600 font-mono">/{a.maxScore}pts</span>
                    </div>
                  </motion.div>
                );
              })}
              {upcomingAssignments.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">No upcoming deadlines</p>
              )}
            </div>
          </div>

          {/* AI Tutor Quick Access */}
          <motion.div
            className="bg-gradient-to-br from-[#1a1a1a] to-[#242424] rounded-xl p-5 border border-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#8A0000]" />
              <h3 className="text-sm font-semibold text-white">AI Tutor</h3>
            </div>
            <p className="text-xs text-gray-400 mb-4">Get instant help with your coursework, study strategies, or concept clarification.</p>
            <div className="space-y-2">
              {['Explain this concept', 'Help me start my essay', 'Quiz me on this topic'].map((prompt) => (
                <button
                  key={prompt}
                  className="w-full text-left text-xs px-3 py-2 rounded-lg bg-[#0f0f0f] text-gray-400 hover:text-white hover:bg-[#8A0000]/10 border border-white/5 transition-all"
                >
                  &ldquo;{prompt}&rdquo;
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ─── Tutor Dashboard ─── */
function TutorDashboard({ data, user, onNavigateCourse }: {
  data: DashboardData;
  user: LMSUser;
  onNavigateCourse: (courseId: string) => void;
}) {
  const { pendingReviewCount, aiReviewedSubmissions, tutoredCourses } = data.tutorData;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome */}
      <motion.div
        className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent rounded-2xl p-6 border border-amber-500/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-white mb-1">Welcome, {user.name}</h1>
        <p className="text-gray-400">Your tutor dashboard for the Artemis Learning System</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Pending Reviews', value: pendingReviewCount, icon: <FileText className="w-4 h-4" />, color: 'text-red-400' },
          { label: 'AI-Reviewed', value: aiReviewedSubmissions.length, icon: <Bot className="w-4 h-4" />, color: 'text-amber-400' },
          { label: 'Tutored Courses', value: tutoredCourses.length, icon: <BookOpen className="w-4 h-4" />, color: 'text-emerald-400' },
          { label: 'Total Students', value: data.stats.totalEnrollments, icon: <Users className="w-4 h-4" />, color: 'text-blue-400' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={stat.color}>{stat.icon}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI-Reviewed Submissions Needing Human Review */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-4">
            <Bot className="w-4 h-4 text-amber-400" />
            AI-Reviewed — Needs Your Sign-off
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {aiReviewedSubmissions.slice(0, 5).map((sub, i) => (
              <motion.div
                key={sub.id}
                className="bg-[#1a1a1a] rounded-xl p-4 border border-amber-500/10 hover:border-amber-500/30 transition-all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm text-white font-medium">{sub.assignment.title}</h4>
                    <p className="text-xs text-gray-500">{sub.user.name} · {sub.assignment.course.title}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">
                    AI Reviewed
                  </span>
                </div>
                {sub.aiFeedback && (
                  <p className="text-xs text-gray-400 line-clamp-2 mt-2">{sub.aiFeedback.slice(0, 150)}...</p>
                )}
              </motion.div>
            ))}
            {aiReviewedSubmissions.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-8">No submissions pending review</p>
            )}
          </div>
        </div>

        {/* Tutored Courses */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4" />
            Your Courses
          </h2>
          <div className="space-y-3">
            {tutoredCourses.map((course, i) => (
              <motion.button
                key={course.courseId}
                onClick={() => onNavigateCourse(course.courseId)}
                className="w-full bg-[#1a1a1a] rounded-xl p-4 border border-white/5 hover:border-[#8A0000]/30 transition-all text-left group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8A0000]/10 text-[#8A0000] font-mono">
                      {course.courseCode}
                    </span>
                    <h4 className="text-sm text-white font-medium mt-1 group-hover:text-[#8A0000] transition-colors">
                      {course.courseTitle}
                    </h4>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-[#8A0000] transition-colors" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Admin Dashboard ─── */
function AdminDashboard({ data, onNavigateCourse }: {
  data: DashboardData;
  onNavigateCourse: (courseId: string) => void;
}) {
  const { allUsers, allCourses } = data.adminData;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome */}
      <motion.div
        className="bg-gradient-to-r from-[#8A0000]/20 via-[#8A0000]/10 to-transparent rounded-2xl p-6 border border-[#8A0000]/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
            <p className="text-gray-400">System overview and management</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#8A0000] text-white rounded-lg text-sm hover:bg-[#9B0F0F] transition-colors">
              <Plus className="w-4 h-4" />
              New Course
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#242424] text-white rounded-lg text-sm hover:bg-[#2a2a2a] transition-colors border border-white/5">
              <Users className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: data.stats.totalUsers, icon: <Users className="w-4 h-4" />, color: 'text-[#8A0000]', change: '+12%' },
          { label: 'Active Courses', value: data.stats.totalCourses, icon: <BookOpen className="w-4 h-4" />, color: 'text-emerald-400', change: '+3' },
          { label: 'Enrollments', value: data.stats.totalEnrollments, icon: <GraduationCap className="w-4 h-4" />, color: 'text-amber-400', change: '+8%' },
          { label: 'System Health', value: '99.9%', icon: <Activity className="w-4 h-4" />, color: 'text-blue-400', change: 'Stable' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={stat.color}>{stat.icon}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</span>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <span className="text-xs text-emerald-400 mb-1">{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* All Courses */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4" />
            All Courses
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {allCourses.map((course, i) => (
              <motion.button
                key={course.id}
                onClick={() => onNavigateCourse(course.id)}
                className="w-full bg-[#1a1a1a] rounded-xl p-4 border border-white/5 hover:border-[#8A0000]/30 transition-all text-left group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8A0000]/10 text-[#8A0000] font-mono">{course.code}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        course.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'
                      }`}>{course.status}</span>
                    </div>
                    <h4 className="text-sm text-white font-medium group-hover:text-[#8A0000] transition-colors truncate">{course.title}</h4>
                  </div>
                  <div className="flex items-center gap-3 ml-4 text-xs text-gray-500 shrink-0">
                    <span>{course._count.enrollments} enrolled</span>
                    <span>{course._count.assignments} assignments</span>
                    <ArrowRight className="w-4 h-4 group-hover:text-[#8A0000] transition-colors" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-4">
            <Users className="w-4 h-4" />
            Recent Users
          </h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {allUsers.map((u, i) => (
              <motion.div
                key={u.id}
                className="flex items-center gap-3 px-4 py-3 bg-[#1a1a1a] rounded-lg border border-white/5"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.04 }}
              >
                <div className="w-8 h-8 rounded-full bg-[#8A0000] flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{u.name}</p>
                  <p className="text-xs text-gray-500 truncate">{u.email}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                  u.role === 'admin' ? 'bg-[#8A0000]/10 text-[#ff4444]' :
                  u.role === 'tutor' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-emerald-500/10 text-emerald-400'
                }`}>
                  {u.role}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
