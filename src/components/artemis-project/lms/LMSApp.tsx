'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  BarChart3,
  Bot,
  BrainCircuit,
  Users,
  UserCheck,
  FileSearch,
  Calendar,
  Settings,
  Search,
  Bell,
  LogOut,
  ChevronLeft,
  Menu,
  Sparkles,
  GraduationCap,
  Shield,
} from 'lucide-react';
import { LMSDashboard } from './LMSDashboard';
import { CourseList } from './CourseList';
import { CourseDetail } from './CourseDetail';
import { AssignmentList } from './AssignmentList';
import { AssignmentDetail } from './AssignmentDetail';
import { Gradebook } from './Gradebook';
import { AITutorChat } from './AITutorChat';
import { AdminPanel } from './AdminPanel';
import { TutorReviewQueue } from './TutorReviewQueue';

/* ─── Types ─── */
export interface LMSUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

export type LMSPage =
  | 'dashboard'
  | 'courses'
  | 'course-detail'
  | 'assignments'
  | 'assignment-detail'
  | 'gradebook'
  | 'ai-tutor'
  | 'admin'
  | 'tutor-review'
  | 'skillprints';

interface LMSAppProps {
  travelerName: string;
  workspace: string;
  onExit: () => void;
}

interface NavItem {
  id: LMSPage;
  label: string;
  icon: React.ReactNode;
  roles: string[];
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, roles: ['student', 'tutor', 'admin'] },
  { id: 'courses', label: 'My Courses', icon: <BookOpen className="w-4 h-4" />, roles: ['student', 'tutor'] },
  { id: 'assignments', label: 'Assignments', icon: <ClipboardList className="w-4 h-4" />, roles: ['student'] },
  { id: 'gradebook', label: 'Gradebook', icon: <BarChart3 className="w-4 h-4" />, roles: ['student'] },
  { id: 'ai-tutor', label: 'AI Tutor', icon: <Bot className="w-4 h-4" />, roles: ['student', 'tutor'] },
  { id: 'skillprints', label: 'SkillPrints', icon: <BrainCircuit className="w-4 h-4" />, roles: ['student'] },
  // Tutor nav
  { id: 'courses', label: 'My Courses', icon: <BookOpen className="w-4 h-4" />, roles: ['tutor'] },
  { id: 'tutor-review', label: 'Review Queue', icon: <FileSearch className="w-4 h-4" />, roles: ['tutor'] },
  { id: 'ai-tutor', label: 'AI Tutor', icon: <Bot className="w-4 h-4" />, roles: ['tutor'] },
  { id: 'assignments', label: 'Student Submissions', icon: <UserCheck className="w-4 h-4" />, roles: ['tutor'] },
  // Admin nav
  { id: 'courses', label: 'All Courses', icon: <BookOpen className="w-4 h-4" />, roles: ['admin'] },
  { id: 'admin', label: 'Users & Analytics', icon: <Users className="w-4 h-4" />, roles: ['admin'] },
  { id: 'ai-tutor', label: 'AI Tutor', icon: <Bot className="w-4 h-4" />, roles: ['admin'] },
];

const ROLE_BADGE_COLORS: Record<string, string> = {
  student: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  tutor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  admin: 'bg-[#8A0000]/20 text-[#ff4444] border-[#8A0000]/30',
};

export function LMSApp({ travelerName, workspace, onExit }: LMSAppProps) {
  const [user, setUser] = useState<LMSUser | null>(null);
  const [currentPage, setCurrentPage] = useState<LMSPage>('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Load user from localStorage and sync with API
  useEffect(() => {
    const initUser = async () => {
      try {
        const stored = localStorage.getItem('artemis-lms-user');
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
        } else {
          // Create user via API using onboarding data
          const storedState = localStorage.getItem('artemis-project-state');
          if (storedState) {
            const state = JSON.parse(storedState);
            const res = await fetch('/api/lms/auth', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: state.email || `${state.travelerName?.toLowerCase().replace(/\s+/g, '.')}@artemis.edu`,
                name: state.travelerName || 'Explorer',
                role: state.role || 'student',
              }),
            });
            const data = await res.json();
            if (data.user) {
              setUser(data.user);
              localStorage.setItem('artemis-lms-user', JSON.stringify(data.user));
            }
          }
        }
      } catch (err) {
        console.error('Failed to init LMS user:', err);
      } finally {
        setLoading(false);
      }
    };
    initUser();
  }, []);

  // Get unique nav items for current role
  const filteredNav = NAV_ITEMS.filter(
    (item, index, arr) =>
      item.roles.includes(user?.role || 'student') &&
      arr.findIndex((i) => i.id === item.id) === index
  );

  const navigateToCourse = useCallback((courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentPage('course-detail');
  }, []);

  const navigateToAssignment = useCallback((assignmentId: string) => {
    setSelectedAssignmentId(assignmentId);
    setCurrentPage('assignment-detail');
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('artemis-lms-user');
    localStorage.removeItem('artemis-project-state');
    onExit();
  }, [onExit]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-white/10 border-t-[#8A0000] rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-mono">Initializing Artemis LMS...</p>
        </div>
      </div>
    );
  }

  const roleBadge = user?.role ? (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wider ${ROLE_BADGE_COLORS[user.role] || ROLE_BADGE_COLORS.student}`}>
      {user.role}
    </span>
  ) : null;

  return (
    <div className="h-screen bg-[#0a0a0a] flex overflow-hidden">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              className="fixed left-0 top-0 bottom-0 w-72 bg-[#1a1a1a] z-50 lg:hidden flex flex-col border-r border-white/5"
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#8A0000] flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-bold text-sm">Artemis LMS</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white">
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {filteredNav.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setCurrentPage(item.id); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                      currentPage === item.id
                        ? 'bg-[#8A0000]/20 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden lg:flex flex-col bg-[#1a1a1a] border-r border-white/5 shrink-0"
        animate={{ width: sidebarCollapsed ? 64 : 240 }}
        transition={{ duration: 0.2 }}
      >
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[#8A0000] flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            {!sidebarCollapsed && (
              <motion.span
                className="text-white font-bold text-sm whitespace-nowrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Artemis LMS
              </motion.span>
            )}
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {filteredNav.map((item) => (
            <button
              key={`${item.id}-${item.label}`}
              onClick={() => {
                setCurrentPage(item.id);
                setSelectedCourseId(null);
                setSelectedAssignmentId(null);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group ${
                currentPage === item.id
                  ? 'bg-[#8A0000]/20 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <span className="shrink-0">{item.icon}</span>
              {!sidebarCollapsed && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
              {currentPage === item.id && (
                <motion.div
                  className="w-1 h-1 rounded-full bg-[#8A0000] ml-auto shrink-0"
                  layoutId="navIndicator"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-2 border-t border-white/5">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 text-sm transition-all"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 bg-[#0f0f0f] border-b border-white/5 flex items-center px-4 gap-4 shrink-0">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white p-1"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, assignments, resources..."
                className="w-full h-9 pl-9 pr-4 rounded-lg bg-[#1a1a1a] border border-white/5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#8A0000]/50 focus:ring-1 focus:ring-[#8A0000]/20 transition-all"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#8A0000] rounded-full" />
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-white/10" />

            {/* User Info */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#8A0000] flex items-center justify-center text-xs font-bold text-white shrink-0">
                {user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'U'}
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white font-medium truncate max-w-[120px]">{user?.name || travelerName}</span>
                  {roleBadge}
                </div>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-white transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#0f0f0f]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage + (selectedCourseId || '') + (selectedAssignmentId || '')}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {currentPage === 'dashboard' && (
                <LMSDashboard user={user} travelerName={travelerName} workspace={workspace} onNavigateCourse={navigateToCourse} />
              )}
              {currentPage === 'courses' && (
                <CourseList user={user} onSelectCourse={navigateToCourse} />
              )}
              {currentPage === 'course-detail' && selectedCourseId && (
                <CourseDetail
                  courseId={selectedCourseId}
                  user={user}
                  onBack={() => setCurrentPage('courses')}
                  onNavigateAssignment={navigateToAssignment}
                />
              )}
              {currentPage === 'assignments' && (
                <AssignmentList user={user} onSelectAssignment={navigateToAssignment} />
              )}
              {currentPage === 'assignment-detail' && selectedAssignmentId && (
                <AssignmentDetail
                  assignmentId={selectedAssignmentId}
                  user={user}
                  onBack={() => setCurrentPage('assignments')}
                />
              )}
              {currentPage === 'gradebook' && user && (
                <Gradebook user={user} onNavigateAssignment={navigateToAssignment} />
              )}
              {currentPage === 'ai-tutor' && user && (
                <AITutorChat user={user} />
              )}
              {currentPage === 'admin' && user && (
                <AdminPanel user={user} />
              )}
              {currentPage === 'tutor-review' && user && (
                <TutorReviewQueue user={user} />
              )}
              {currentPage === 'skillprints' && (
                <SkillPrintsPlaceholder />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function SkillPrintsPlaceholder() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-20 h-20 rounded-2xl bg-[#8A0000]/10 flex items-center justify-center mx-auto mb-6">
          <BrainCircuit className="w-10 h-10 text-[#8A0000]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">SkillPrints</h2>
        <p className="text-gray-400 mb-6 leading-relaxed">
          Your multi-dimensional competency map is being generated. SkillPrints tracks your growth across knowledge, skills, and dispositions — going far beyond traditional grades.
        </p>
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <Sparkles className="w-4 h-4 text-[#8A0000]" />
          <span className="text-sm font-mono">Coming soon in Artemis v2.0</span>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-4 max-w-sm mx-auto">
          {['Analysis', 'Synthesis', 'Creativity'].map((skill, i) => (
            <motion.div
              key={skill}
              className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div className="w-8 h-8 rounded-lg bg-[#8A0000]/20 flex items-center justify-center mx-auto mb-2">
                <div className="w-3 h-3 rounded-full bg-[#8A0000]" />
              </div>
              <p className="text-xs text-gray-400 text-center">{skill}</p>
              <p className="text-lg font-bold text-white text-center mt-1">{65 + i * 12}%</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
