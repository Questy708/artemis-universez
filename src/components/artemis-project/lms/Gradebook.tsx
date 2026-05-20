'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  BarChart3,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import type { LMSUser } from './LMSApp';

interface GradebookProps {
  user: LMSUser;
  onNavigateAssignment: (assignmentId: string) => void;
}

interface GradeEntry {
  id: string;
  title: string;
  type: string;
  maxScore: number;
  dueDate: string | null;
  status: string;
  courseCode: string;
  courseTitle: string;
  grade: number | null;
  submissionStatus: string;
}

export function Gradebook({ user, onNavigateAssignment }: GradebookProps) {
  const [grades, setGrades] = useState<GradeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const enrollRes = await fetch(`/api/lms/enrollments?userId=${user.id}`);
        const enrollData = await enrollRes.json();

        const allGrades: GradeEntry[] = [];

        for (const enrollment of enrollData.enrollments || []) {
          const assignRes = await fetch(`/api/lms/assignments?courseId=${enrollment.courseId}&userId=${user.id}`);
          const assignData = await assignRes.json();

          for (const assignment of assignData.assignments || []) {
            const submission = assignment.submissions?.[0];
            allGrades.push({
              id: assignment.id,
              title: assignment.title,
              type: assignment.type,
              maxScore: assignment.maxScore,
              dueDate: assignment.dueDate,
              status: assignment.status,
              courseCode: enrollment.course.code,
              courseTitle: enrollment.course.title,
              grade: submission?.grade ?? null,
              submissionStatus: submission?.status ?? 'not_submitted',
            });
          }
        }

        setGrades(allGrades);
      } catch (err) {
        console.error('Gradebook fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, [user.id]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-[#8A0000] rounded-full animate-spin" />
      </div>
    );
  }

  const gradedAssignments = grades.filter((g) => g.grade !== null);
  const avgGrade = gradedAssignments.length > 0
    ? Math.round(gradedAssignments.reduce((a, g) => a + (g.grade! / g.maxScore) * 100, 0) / gradedAssignments.length)
    : 0;

  const courseGroups = grades.reduce<Record<string, GradeEntry[]>>((acc, g) => {
    if (!acc[g.courseCode]) acc[g.courseCode] = [];
    acc[g.courseCode].push(g);
    return acc;
  }, {});

  const getGradeColor = (pct: number) => {
    if (pct >= 90) return 'text-emerald-400 bg-emerald-500/10';
    if (pct >= 75) return 'text-blue-400 bg-blue-500/10';
    if (pct >= 60) return 'text-amber-400 bg-amber-500/10';
    return 'text-red-400 bg-red-500/10';
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Gradebook</h1>
        <p className="text-gray-400 text-sm mt-1">Your academic performance across all courses</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Average Grade', value: `${avgGrade}%`, icon: <BarChart3 className="w-4 h-4" />, color: 'text-[#8A0000]' },
          { label: 'Graded', value: gradedAssignments.length, icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-emerald-400' },
          { label: 'Total Assignments', value: grades.length, icon: <BookOpen className="w-4 h-4" />, color: 'text-blue-400' },
          { label: 'Pending', value: grades.filter((g) => g.submissionStatus === 'not_submitted').length, icon: <Clock className="w-4 h-4" />, color: 'text-amber-400' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={stat.color}>{stat.icon}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Grade Table by Course */}
      {Object.entries(courseGroups).map(([courseCode, assignments], ci) => (
        <motion.div
          key={courseCode}
          className="bg-[#1a1a1a] rounded-xl border border-white/5 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + ci * 0.1 }}
        >
          <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8A0000]/10 text-[#8A0000] font-mono">
              {courseCode}
            </span>
            <h3 className="text-sm font-semibold text-white">{assignments[0]?.courseTitle}</h3>
          </div>
          <div className="divide-y divide-white/5">
            {assignments.map((a) => {
              const gradePct = a.grade !== null ? Math.round((a.grade / a.maxScore) * 100) : null;
              return (
                <button
                  key={a.id}
                  onClick={() => onNavigateAssignment(a.id)}
                  className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors text-left group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white group-hover:text-[#8A0000] transition-colors truncate">{a.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500">{a.type}</span>
                      {a.dueDate && (
                        <span className="text-[10px] text-gray-600 font-mono">
                          {new Date(a.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {gradePct !== null ? (
                      <span className={`text-sm font-bold px-3 py-1 rounded-lg ${getGradeColor(gradePct)}`}>
                        {gradePct}%
                      </span>
                    ) : (
                      <span className="text-xs text-gray-600 px-3 py-1 rounded-lg bg-white/5">
                        {a.submissionStatus === 'not_submitted' ? 'Not submitted' : 'Pending'}
                      </span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-[#8A0000] transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      ))}

      {grades.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No grades yet</p>
        </div>
      )}
    </div>
  );
}
