'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileSearch,
  Bot,
  UserCheck,
  CheckCircle2,
  XCircle,
  Loader2,
  Send,
  Star,
  MessageSquare,
  Clock,
  Filter,
} from 'lucide-react';
import type { LMSUser } from './LMSApp';

interface TutorReviewQueueProps {
  user: LMSUser;
}

interface ReviewSubmission {
  id: string;
  content: string;
  grade: number | null;
  feedback: string | null;
  aiFeedback: string | null;
  status: string;
  submittedAt: string;
  user: { name: string; email: string };
  assignment: {
    id: string;
    title: string;
    maxScore: number;
    type: string;
    course: { title: string; code: string };
  };
  tutorFeedback: Array<{
    id: string;
    content: string;
    rating: number | null;
    tutor: { name: string };
  }>;
}

export function TutorReviewQueue({ user }: TutorReviewQueueProps) {
  const [submissions, setSubmissions] = useState<ReviewSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tutorComment, setTutorComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'ai_reviewed' | 'submitted'>('all');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        // Get tutor's courses
        const enrollRes = await fetch(`/api/lms/enrollments?userId=${user.id}`);
        const enrollData = await enrollRes.json();
        const tutorCourseIds = enrollData.enrollments
          ?.filter((e: { role: string }) => e.role === 'tutor')
          .map((e: { courseId: string }) => e.courseId) || [];

        // Get all submissions for tutor's courses
        const allSubs: ReviewSubmission[] = [];
        for (const courseId of tutorCourseIds) {
          const assignRes = await fetch(`/api/lms/assignments?courseId=${courseId}`);
          const assignData = await assignRes.json();
          for (const assignment of assignData.assignments || []) {
            const subRes = await fetch(`/api/lms/submissions?assignmentId=${assignment.id}`);
            const subData = await subRes.json();
            for (const sub of subData.submissions || []) {
              allSubs.push(sub);
            }
          }
        }
        setSubmissions(allSubs);
      } catch (err) {
        console.error('Review queue fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [user.id]);

  const filteredSubmissions = submissions.filter((s) => {
    if (filter === 'ai_reviewed') return s.status === 'ai_reviewed';
    if (filter === 'submitted') return s.status === 'submitted';
    return true;
  });

  const selectedSubmission = submissions.find((s) => s.id === selectedId);

  const handleApproveAI = async (submissionId: string) => {
    if (!tutorComment.trim()) return;
    setSubmitting(true);
    try {
      await fetch('/api/lms/tutor-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          tutorId: user.id,
          content: tutorComment,
          rating: 4,
        }),
      });
      // Refresh submissions
      setSubmissions((prev) =>
        prev.map((s) => s.id === submissionId ? { ...s, status: 'tutor_reviewed' } : s)
      );
      setTutorComment('');
      setSelectedId(null);
    } catch (err) {
      console.error('Tutor review error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGradeAndReview = async (submissionId: string, grade: number) => {
    if (!tutorComment.trim()) return;
    setSubmitting(true);
    try {
      await fetch('/api/lms/tutor-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          tutorId: user.id,
          content: tutorComment,
          grade,
        }),
      });
      setSubmissions((prev) =>
        prev.map((s) => s.id === submissionId ? { ...s, status: 'graded', grade } : s)
      );
      setTutorComment('');
      setSelectedId(null);
    } catch (err) {
      console.error('Tutor grade error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-[#8A0000] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Left: Queue List */}
      <div className="w-96 bg-[#1a1a1a] border-r border-white/5 flex flex-col shrink-0">
        <div className="p-4 border-b border-white/5">
          <h2 className="text-white font-semibold flex items-center gap-2 mb-3">
            <FileSearch className="w-4 h-4 text-amber-400" />
            Review Queue
          </h2>
          <div className="flex items-center gap-1">
            {(['all', 'ai_reviewed', 'submitted'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded text-[10px] transition-all ${
                  filter === f
                    ? 'bg-[#8A0000] text-white'
                    : 'bg-white/5 text-gray-500 hover:text-white'
                }`}
              >
                {f === 'ai_reviewed' ? 'AI Reviewed' : f === 'submitted' ? 'New' : 'All'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredSubmissions.map((sub, i) => (
            <motion.button
              key={sub.id}
              onClick={() => {
                setSelectedId(sub.id);
                setTutorComment('');
              }}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                selectedId === sub.id
                  ? 'bg-[#8A0000]/20 border border-[#8A0000]/30'
                  : 'hover:bg-white/5 border border-transparent'
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <div className="flex items-start justify-between mb-1">
                <h4 className="text-sm text-white font-medium truncate">{sub.assignment.title}</h4>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full shrink-0 ml-2 ${
                  sub.status === 'submitted' ? 'bg-red-500/10 text-red-400' :
                  sub.status === 'ai_reviewed' ? 'bg-amber-500/10 text-amber-400' :
                  sub.status === 'tutor_reviewed' ? 'bg-emerald-500/10 text-emerald-400' :
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  {sub.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-gray-500">{sub.user.name}</p>
              <p className="text-[10px] text-gray-600">{sub.assignment.course.code} · {new Date(sub.submittedAt).toLocaleDateString()}</p>
            </motion.button>
          ))}

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle2 className="w-8 h-8 text-emerald-500/50 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">All caught up!</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: Detail Review */}
      <div className="flex-1 overflow-y-auto">
        {selectedSubmission ? (
          <motion.div
            key={selectedSubmission.id}
            className="p-6 max-w-3xl mx-auto space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8A0000]/10 text-[#8A0000] font-mono">
                  {selectedSubmission.assignment.course.code}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-500">
                  {selectedSubmission.assignment.type}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">{selectedSubmission.assignment.title}</h2>
              <p className="text-sm text-gray-400 mt-1">
                by {selectedSubmission.user.name} · {selectedSubmission.assignment.course.title}
              </p>
            </div>

            {/* Student Submission */}
            <div className="bg-[#1a1a1a] rounded-xl p-5 border border-white/5">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                Student Submission
              </h3>
              {(() => {
                try {
                  const parsed = JSON.parse(selectedSubmission.content);
                  return <p className="text-gray-300 text-sm whitespace-pre-wrap">{parsed.text || selectedSubmission.content}</p>;
                } catch {
                  return <p className="text-gray-300 text-sm whitespace-pre-wrap">{selectedSubmission.content}</p>;
                }
              })()}
            </div>

            {/* AI Feedback */}
            {selectedSubmission.aiFeedback && (
              <div className="bg-[#1a1a1a] rounded-xl p-5 border border-amber-500/10">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-amber-400" />
                  AI Feedback
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 ml-auto">
                    Automated Review
                  </span>
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">{selectedSubmission.aiFeedback}</p>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                  <span className="text-xs text-gray-500">AI quality rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${star <= 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Tutor Review Form */}
            <div className="bg-[#1a1a1a] rounded-xl p-5 border border-emerald-500/10">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                Your Review
              </h3>
              <textarea
                value={tutorComment}
                onChange={(e) => setTutorComment(e.target.value)}
                placeholder="Add your feedback, modifications, or additional notes..."
                className="w-full h-32 px-4 py-3 rounded-lg bg-[#0f0f0f] border border-white/5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 resize-none transition-all"
              />
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Quick grade:</span>
                  {[65, 75, 85, 95].map((grade) => (
                    <button
                      key={grade}
                      onClick={() => handleGradeAndReview(selectedSubmission.id, grade)}
                      disabled={!tutorComment.trim() || submitting}
                      className="px-2.5 py-1 rounded text-xs bg-white/5 text-gray-400 hover:text-white hover:bg-[#8A0000]/10 border border-white/5 transition-all disabled:opacity-30"
                    >
                      {grade}%
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApproveAI(selectedSubmission.id)}
                    disabled={!tutorComment.trim() || submitting}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs hover:bg-emerald-500/20 transition-colors disabled:opacity-30"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve AI Review
                  </button>
                  <button
                    onClick={() => handleGradeAndReview(selectedSubmission.id, 80)}
                    disabled={!tutorComment.trim() || submitting}
                    className="flex items-center gap-2 px-4 py-2 bg-[#8A0000] text-white rounded-lg text-xs hover:bg-[#9B0F0F] transition-colors disabled:opacity-30"
                  >
                    {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    Submit Review
                  </button>
                </div>
              </div>
            </div>

            {/* Existing Tutor Feedback */}
            {selectedSubmission.tutorFeedback?.length > 0 && (
              <div className="bg-[#1a1a1a] rounded-xl p-5 border border-white/5">
                <h3 className="text-sm font-semibold text-white mb-3">Previous Reviews</h3>
                {selectedSubmission.tutorFeedback.map((fb) => (
                  <div key={fb.id} className="bg-[#0f0f0f] rounded-lg p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-emerald-400 font-semibold">{fb.tutor.name}</span>
                      <span className="text-[10px] text-gray-600 font-mono">{new Date(fb.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{fb.content}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <FileSearch className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Select a submission to review</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
