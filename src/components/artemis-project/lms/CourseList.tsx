'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  ArrowRight,
  Clock,
  Users,
  ChevronRight,
  Star,
} from 'lucide-react';
import type { LMSUser } from './LMSApp';

interface CourseListProps {
  user: LMSUser | null;
  onSelectCourse: (courseId: string) => void;
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  code: string;
  category: string;
  level: string;
  status: string;
  enrolled: boolean;
  progress: number;
  modules: Array<{
    id: string;
    title: string;
    lessons: Array<unknown>;
  }>;
  assignments: Array<unknown>;
  enrollments: Array<{ userId: string }>;
}

const LEVEL_COLORS: Record<string, string> = {
  introductory: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  advanced: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const CATEGORY_ICONS: Record<string, string> = {
  'Synthetic Intelligence': '🧠',
  'Ethics': '⚖️',
  'Learning Design': '📐',
};

export function CourseList({ user, onSelectCourse }: CourseListProps) {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'enrolled' | 'available'>('all');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`/api/lms/courses?userId=${user?.id || ''}&role=${user?.role || 'student'}`);
        const json = await res.json();
        setCourses(json.courses || []);
      } catch (err) {
        console.error('Courses fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [user?.id, user?.role]);

  const filteredCourses = courses.filter((c) => {
    if (filter === 'enrolled') return c.enrolled;
    if (filter === 'available') return !c.enrolled;
    return true;
  });

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-[#8A0000] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Courses</h1>
          <p className="text-gray-400 text-sm mt-1">Explore and enroll in Artemis learning experiences</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {(['all', 'enrolled', 'available'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              filter === f
                ? 'bg-[#8A0000] text-white'
                : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCourses.map((course, i) => (
          <motion.button
            key={course.id}
            onClick={() => onSelectCourse(course.id)}
            className="bg-[#1a1a1a] rounded-xl border border-white/5 hover:border-[#8A0000]/30 transition-all text-left group overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -2 }}
          >
            {/* Card Header / Thumbnail area */}
            <div className="h-28 bg-gradient-to-br from-[#8A0000]/20 to-[#1a1a1a] flex items-center justify-center relative overflow-hidden">
              <span className="text-4xl">{CATEGORY_ICONS[course.category] || '📚'}</span>
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-white font-mono backdrop-blur-sm">
                  {course.code}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${LEVEL_COLORS[course.level] || LEVEL_COLORS.introductory}`}>
                  {course.level}
                </span>
              </div>
              {course.enrolled && (
                <div className="absolute bottom-3 right-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Enrolled
                  </span>
                </div>
              )}
            </div>

            {/* Card Body */}
            <div className="p-5">
              <h3 className="text-white font-semibold text-sm group-hover:text-[#8A0000] transition-colors mb-2 line-clamp-2">
                {course.title}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-4">{course.description}</p>

              {/* Course Stats */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {course.modules.reduce((a, m) => a + m.lessons.length, 0)} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {course.enrollments.length} enrolled
                </span>
              </div>

              {/* Progress bar if enrolled */}
              {course.enrolled && (
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Progress</span>
                    <span className="text-gray-400 font-mono">{Math.round(course.progress)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#242424] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#8A0000] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 0.6, delay: 0.3 + i * 0.05 }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No courses found</p>
        </div>
      )}
    </div>
  );
}
