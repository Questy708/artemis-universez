'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ClipboardList,
  Clock,
  FileText,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Bot,
  Loader2,
} from 'lucide-react';
import type { LMSUser } from './LMSApp';

interface AssignmentListProps {
  user: LMSUser | null;
  onSelectAssignment: (assignmentId: string) => void;
}

interface AssignmentData {
  id: string;
  title: string;
  description: string;
  type: string;
  dueDate: string | null;
  maxScore: number;
  status: string;
  submissions: Array<{
    id: string;
    status: string;
    grade: number | null;
  }>;
}

const TYPE_BADGES: Record<string, { color: string; label: string }> = {
  essay: { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', label: 'Essay' },
  quiz: { color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: 'Quiz' },
  project: { color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', label: 'Project' },
  peer_review: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Peer Review' },
  live_demo: { color: 'bg-red-500/10 text-red-400 border-red-500/20', label: 'Live Demo' },
};

const STATUS_BADGES: Record<string, { color: string; icon: React.ReactNode }> = {
  open: { color: 'bg-emerald-500/10 text-emerald-400', icon: <CheckCircle2 className="w-3 h-3" /> },
  closed: { color: 'bg-red-500/10 text-red-400', icon: <AlertCircle className="w-3 h-3" /> },
  graded: { color: 'bg-blue-500/10 text-blue-400', icon: <CheckCircle2 className="w-3 h-3" /> },
};

export function AssignmentList({ user, onSelectAssignment }: AssignmentListProps) {
  const [assignments, setAssignments] = useState<Array<AssignmentData & { courseTitle?: string; courseCode?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'submitted' | 'graded'>('all');

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!user?.id) return;
      try {
        // Get enrollments first, then assignments for each course
        const enrollRes = await fetch(`/api/lms/enrollments?userId=${user.id}`);
        const enrollData = await enrollRes.json();

        const allAssignments: Array<AssignmentData & { courseTitle?: string; courseCode?: string }> = [];

        for (const enrollment of enrollData.enrollments || []) {
          const assignRes = await fetch(`/api/lms/assignments?courseId=${enrollment.courseId}&userId=${user.id}`);
          const assignData = await assignRes.json();
          for (const a of assignData.assignments || []) {
            allAssignments.push({
              ...a,
              courseTitle: enrollment.course.title,
              courseCode: enrollment.course.code,
            });
          }
        }

        setAssignments(allAssignments);
      } catch (err) {
        console.error('Assignments fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [user?.id]);

  const filteredAssignments = assignments.filter((a) => {
    if (filter === 'open') return a.status === 'open' && a.submissions.length === 0;
    if (filter === 'submitted') return a.submissions.length > 0 && a.submissions[0].status !== 'graded';
    if (filter === 'graded') return a.submissions.some((s) => s.status === 'graded' || s.grade !== null);
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
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Assignments</h1>
        <p className="text-gray-400 text-sm mt-1">Track and submit your coursework</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-500" />
        {(['all', 'open', 'submitted', 'graded'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
              filter === f
                ? 'bg-[#8A0000] text-white'
                : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Assignment List */}
      <div className="space-y-3">
        {filteredAssignments.map((assignment, i) => {
          const submission = assignment.submissions[0];
          const daysLeft = assignment.dueDate
            ? Math.ceil((new Date(assignment.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            : null;
          const typeBadge = TYPE_BADGES[assignment.type] || TYPE_BADGES.essay;
          const statusBadge = STATUS_BADGES[assignment.status] || STATUS_BADGES.open;

          return (
            <motion.button
              key={assignment.id}
              onClick={() => onSelectAssignment(assignment.id)}
              className="w-full bg-[#1a1a1a] rounded-xl p-5 border border-white/5 hover:border-[#8A0000]/30 transition-all text-left group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ x: 4 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${typeBadge.color}`}>
                      {typeBadge.label}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 ${statusBadge.color}`}>
                      {statusBadge.icon}
                      {assignment.status}
                    </span>
                    {submission && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        submission.status === 'graded' ? 'bg-blue-500/10 text-blue-400' :
                        submission.status === 'ai_reviewed' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-white/5 text-gray-400'
                      }`}>
                        {submission.status.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-semibold text-sm group-hover:text-[#8A0000] transition-colors mb-1">
                    {assignment.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{assignment.description}</p>
                  {assignment.courseCode && (
                    <p className="text-xs text-gray-600 mt-1">{assignment.courseCode} · {assignment.courseTitle}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {daysLeft !== null && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      daysLeft <= 0 ? 'bg-red-500/10 text-red-400' :
                      daysLeft <= 3 ? 'bg-amber-500/10 text-amber-400' :
                      'bg-white/5 text-gray-500'
                    }`}>
                      {daysLeft <= 0 ? 'Overdue' : `${daysLeft}d left`}
                    </span>
                  )}
                  <span className="text-xs text-gray-600 font-mono">/{assignment.maxScore}pts</span>
                  {submission?.grade !== null && submission?.grade !== undefined && (
                    <span className="text-lg font-bold text-white">{submission.grade}%</span>
                  )}
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-[#8A0000] transition-colors" />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="text-center py-12">
          <ClipboardList className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No assignments found</p>
        </div>
      )}
    </div>
  );
}
