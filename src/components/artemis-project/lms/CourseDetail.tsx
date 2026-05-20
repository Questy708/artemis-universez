'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Play,
  FileText,
  Users,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Lock,
  Bot,
  Radio,
  Video,
  Monitor,
  HelpCircle,
  Zap,
} from 'lucide-react';
import type { LMSUser } from './LMSApp';

interface CourseDetailProps {
  courseId: string;
  user: LMSUser | null;
  onBack: () => void;
  onNavigateAssignment: (assignmentId: string) => void;
}

interface LessonData {
  id: string;
  title: string;
  type: string;
  duration: string | null;
  order: number;
  isPublished: boolean;
  content: string | null;
}

interface ModuleData {
  id: string;
  title: string;
  description: string | null;
  order: number;
  type: string;
  duration: string | null;
  lessons: LessonData[];
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  code: string;
  category: string;
  level: string;
  enrolled: boolean;
  progress: number;
  enrollmentRole: string | null;
  modules: ModuleData[];
  assignments: Array<{
    id: string;
    title: string;
    type: string;
    dueDate: string | null;
    status: string;
    maxScore: number;
  }>;
}

const LESSON_TYPE_ICONS: Record<string, React.ReactNode> = {
  video: <Video className="w-3.5 h-3.5" />,
  reading: <FileText className="w-3.5 h-3.5" />,
  quiz: <HelpCircle className="w-3.5 h-3.5" />,
  live_session: <Radio className="w-3.5 h-3.5" />,
  interactive: <Zap className="w-3.5 h-3.5" />,
};

const LESSON_TYPE_COLORS: Record<string, string> = {
  video: 'text-blue-400 bg-blue-500/10',
  reading: 'text-emerald-400 bg-emerald-500/10',
  quiz: 'text-amber-400 bg-amber-500/10',
  live_session: 'text-red-400 bg-red-500/10',
  interactive: 'text-purple-400 bg-purple-500/10',
};

export function CourseDetail({ courseId, user, onBack, onNavigateAssignment }: CourseDetailProps) {
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<LessonData | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/lms/courses/${courseId}?userId=${user?.id || ''}`);
        const json = await res.json();
        setCourse(json.course);
        // Auto-expand first module and select first lesson
        if (json.course?.modules?.[0]) {
          setExpandedModules(new Set([json.course.modules[0].id]));
          if (json.course.modules[0].lessons?.[0]) {
            setSelectedLesson(json.course.modules[0].lessons[0]);
          }
        }
      } catch (err) {
        console.error('Course fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId, user?.id]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-[#8A0000] rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Course not found</p>
          <button onClick={onBack} className="text-[#8A0000] text-sm mt-2">Go back</button>
        </div>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0);
  const completedLessons = Math.round((course.progress / 100) * totalLessons);

  return (
    <div className="h-full flex">
      {/* Left: Module/Lesson Sidebar */}
      <div className="w-80 bg-[#1a1a1a] border-r border-white/5 flex flex-col shrink-0 overflow-hidden">
        {/* Course Header */}
        <div className="p-4 border-b border-white/5">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-gray-400 hover:text-white text-xs mb-3 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Courses
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8A0000]/10 text-[#8A0000] font-mono">
              {course.code}
            </span>
            <span className="text-[10px] text-gray-500">{course.category}</span>
          </div>
          <h2 className="text-white font-semibold text-sm line-clamp-2">{course.title}</h2>
          {/* Progress */}
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">{completedLessons}/{totalLessons} lessons</span>
              <span className="text-gray-400 font-mono">{Math.round(course.progress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#242424] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#8A0000] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${course.progress}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>
        </div>

        {/* Module List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {course.modules.map((module) => {
            const isExpanded = expandedModules.has(module.id);
            return (
              <div key={module.id}>
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left hover:bg-white/5 transition-colors group"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{module.title}</p>
                    {module.duration && (
                      <p className="text-[10px] text-gray-600 font-mono">{module.duration}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-600 shrink-0">
                    {module.lessons.length}
                  </span>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 space-y-0.5 pb-1">
                        {module.lessons.map((lesson) => {
                          const isSelected = selectedLesson?.id === lesson.id;
                          const lessonIdx = course.modules
                            .flatMap((m) => m.lessons)
                            .findIndex((l) => l.id === lesson.id);
                          const isCompleted = lessonIdx < completedLessons;

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => setSelectedLesson(lesson)}
                              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition-all ${
                                isSelected
                                  ? 'bg-[#8A0000]/20 text-white border border-[#8A0000]/30'
                                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <span className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                                isCompleted
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : LESSON_TYPE_COLORS[lesson.type] || 'bg-white/5 text-gray-500'
                              }`}>
                                {isCompleted ? (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : (
                                  LESSON_TYPE_ICONS[lesson.type] || <BookOpen className="w-3.5 h-3.5" />
                                )}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="truncate">{lesson.title}</p>
                                {lesson.duration && (
                                  <p className="text-[10px] text-gray-600 font-mono">{lesson.duration}</p>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Assignments Section */}
          {course.assignments.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                Assignments
              </h3>
              <div className="space-y-0.5">
                {course.assignments.map((assignment) => (
                  <button
                    key={assignment.id}
                    onClick={() => onNavigateAssignment(assignment.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <span className="w-6 h-6 rounded flex items-center justify-center bg-amber-500/10 text-amber-400 shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{assignment.title}</p>
                      {assignment.dueDate && (
                        <p className="text-[10px] text-gray-600 font-mono">
                          Due {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${
                      assignment.status === 'open' ? 'bg-emerald-500/10 text-emerald-400' :
                      assignment.status === 'closed' ? 'bg-red-500/10 text-red-400' :
                      'bg-gray-500/10 text-gray-400'
                    }`}>
                      {assignment.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Lesson Content */}
      <div className="flex-1 overflow-y-auto">
        {selectedLesson ? (
          <motion.div
            key={selectedLesson.id}
            className="p-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${LESSON_TYPE_COLORS[selectedLesson.type] || 'bg-white/5 text-gray-400'}`}>
                  {selectedLesson.type.replace('_', ' ')}
                </span>
                {selectedLesson.duration && (
                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {selectedLesson.duration}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">{selectedLesson.title}</h1>
            </div>

            {/* Lesson Content */}
            {selectedLesson.type === 'video' ? (
              <div className="aspect-video bg-[#242424] rounded-xl border border-white/5 flex items-center justify-center mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#8A0000]/20 flex items-center justify-center mx-auto mb-3">
                    <Play className="w-8 h-8 text-[#8A0000] ml-1" />
                  </div>
                  <p className="text-gray-400 text-sm">Video content preview</p>
                  <p className="text-gray-600 text-xs mt-1">{selectedLesson.duration}</p>
                </div>
              </div>
            ) : selectedLesson.type === 'live_session' ? (
              <div className="bg-[#242424] rounded-xl p-8 border border-white/5 mb-8 text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <Radio className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Live Session</h3>
                <p className="text-gray-400 text-sm mb-4">This lesson is a live interactive session with your instructor.</p>
                <button className="px-6 py-2.5 bg-[#8A0000] text-white rounded-lg text-sm hover:bg-[#9B0F0F] transition-colors">
                  Join Live Session
                </button>
              </div>
            ) : null}

            {/* Content Text */}
            {selectedLesson.content && (
              <div className="prose prose-invert prose-sm max-w-none">
                {selectedLesson.content.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) {
                    return <h2 key={i} className="text-xl font-bold text-white mt-8 mb-4">{line.replace('## ', '')}</h2>;
                  }
                  if (line.startsWith('### ')) {
                    return <h3 key={i} className="text-lg font-semibold text-gray-200 mt-6 mb-3">{line.replace('### ', '')}</h3>;
                  }
                  if (line.startsWith('- **')) {
                    const match = line.match(/- \*\*(.+?)\*\*:?\s*(.*)/);
                    if (match) {
                      return (
                        <div key={i} className="flex items-start gap-2 mb-2">
                          <ChevronRight className="w-3 h-3 text-[#8A0000] mt-1.5 shrink-0" />
                          <p className="text-gray-300">
                            <strong className="text-white">{match[1]}</strong>
                            {match[2] ? `: ${match[2]}` : ''}
                          </p>
                        </div>
                      );
                    }
                  }
                  if (line.startsWith('- ')) {
                    return (
                      <div key={i} className="flex items-start gap-2 mb-2">
                        <ChevronRight className="w-3 h-3 text-[#8A0000] mt-1.5 shrink-0" />
                        <p className="text-gray-300">{line.replace('- ', '')}</p>
                      </div>
                    );
                  }
                  if (line.match(/^\d+\./)) {
                    return (
                      <div key={i} className="flex items-start gap-2 mb-2">
                        <span className="text-[#8A0000] font-bold text-sm mt-0.5 shrink-0">
                          {line.match(/^(\d+)\./)?.[1]}.
                        </span>
                        <p className="text-gray-300">{line.replace(/^\d+\.\s*/, '')}</p>
                      </div>
                    );
                  }
                  if (line.trim() === '') return <div key={i} className="h-2" />;
                  return <p key={i} className="text-gray-300 mb-3 leading-relaxed">{line}</p>;
                })}
              </div>
            )}

            {!selectedLesson.content && selectedLesson.type !== 'video' && selectedLesson.type !== 'live_session' && (
              <div className="bg-[#242424] rounded-xl p-8 border border-white/5 text-center">
                <Lock className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Content for this lesson is being prepared.</p>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Select a lesson to begin</p>
            </div>
          </div>
        )}

        {/* AI Tutor FAB */}
        <div className="fixed bottom-6 right-6">
          <motion.button
            className="w-14 h-14 rounded-full bg-[#8A0000] text-white flex items-center justify-center shadow-lg shadow-[#8A0000]/30 hover:bg-[#9B0F0F] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bot className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
