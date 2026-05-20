'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Clock,
  Send,
  Bot,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  MessageSquare,
  Star,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import type { LMSUser } from './LMSApp';

interface AssignmentDetailProps {
  assignmentId: string;
  user: LMSUser | null;
  onBack: () => void;
}

interface SubmissionData {
  id: string;
  content: string;
  grade: number | null;
  feedback: string | null;
  aiFeedback: string | null;
  status: string;
  submittedAt: string;
  tutorFeedback: Array<{
    id: string;
    content: string;
    rating: number | null;
    createdAt: string;
    tutor: { name: string };
  }>;
}

interface AssignmentData {
  id: string;
  title: string;
  description: string;
  type: string;
  dueDate: string | null;
  maxScore: number;
  status: string;
  course: { title: string; code: string };
  submissions: SubmissionData[];
}

export function AssignmentDetail({ assignmentId, user, onBack }: AssignmentDetailProps) {
  const [assignment, setAssignment] = useState<AssignmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submissionText, setSubmissionText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [aiReviewing, setAiReviewing] = useState(false);
  const [activeTab, setActiveTab] = useState<'instructions' | 'submit' | 'feedback'>('instructions');

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await fetch(`/api/lms/assignments?courseId=all&assignmentId=${assignmentId}`);
        // Fallback: fetch via submissions to get assignment info
        const subRes = await fetch(`/api/lms/submissions?userId=${user?.id || ''}`);
        const subData = await subRes.json();
        const matchingSub = subData.submissions?.find((s: { assignment: { id: string } }) => s.assignment.id === assignmentId);
        if (matchingSub) {
          setAssignment({
            ...matchingSub.assignment,
            submissions: [matchingSub],
          });
        } else {
          // Need to fetch assignment details separately - use enrollments to find the course
          const enrollRes = await fetch(`/api/lms/enrollments?userId=${user?.id}`);
          const enrollData = await enrollRes.json();
          for (const enrollment of enrollData.enrollments || []) {
            const assignRes = await fetch(`/api/lms/assignments?courseId=${enrollment.courseId}&userId=${user?.id}`);
            const assignData = await assignRes.json();
            const found = assignData.assignments?.find((a: { id: string }) => a.id === assignmentId);
            if (found) {
              setAssignment(found);
              break;
            }
          }
        }
      } catch (err) {
        console.error('Assignment detail fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [assignmentId, user?.id]);

  const existingSubmission = assignment?.submissions?.[0];
  const daysLeft = assignment?.dueDate
    ? Math.ceil((new Date(assignment.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const handleSubmit = async () => {
    if (!submissionText.trim() || !user?.id || !assignment) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/lms/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: assignment.id,
          userId: user.id,
          content: JSON.stringify({ type: assignment.type, text: submissionText.trim() }),
        }),
      });
      const data = await res.json();
      if (data.submission) {
        // Refresh assignment data
        setAssignment({
          ...assignment,
          submissions: [data.submission],
        });
        setActiveTab('feedback');
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAIReview = async () => {
    if (!existingSubmission) return;
    setAiReviewing(true);
    try {
      const res = await fetch('/api/lms/ai-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: existingSubmission.id }),
      });
      const data = await res.json();
      if (data.submission) {
        setAssignment({
          ...assignment!,
          submissions: [data.submission],
        });
      }
    } catch (err) {
      console.error('AI review error:', err);
    } finally {
      setAiReviewing(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-[#8A0000] rounded-full animate-spin" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Assignment not found</p>
          <button onClick={onBack} className="text-[#8A0000] text-sm mt-2">Go back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-gray-400 hover:text-white text-xs mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Assignments
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8A0000]/10 text-[#8A0000] font-mono">
              {assignment.course?.code}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
              {assignment.type}
            </span>
            {daysLeft !== null && (
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                daysLeft <= 0 ? 'bg-red-500/10 text-red-400' :
                daysLeft <= 3 ? 'bg-amber-500/10 text-amber-400' :
                'bg-white/5 text-gray-500'
              }`}>
                {daysLeft <= 0 ? 'Overdue' : `${daysLeft}d left`}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">{assignment.title}</h1>
          <p className="text-sm text-gray-500">{assignment.course?.title} · /{assignment.maxScore} points</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-[#1a1a1a] rounded-lg p-1 border border-white/5">
          {[
            { id: 'instructions' as const, label: 'Instructions', icon: <FileText className="w-3.5 h-3.5" /> },
            { id: 'submit' as const, label: existingSubmission ? 'Your Submission' : 'Submit', icon: <Send className="w-3.5 h-3.5" /> },
            { id: 'feedback' as const, label: 'Feedback', icon: <MessageSquare className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-[#8A0000] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'instructions' && (
            <motion.div
              key="instructions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5"
            >
              <h2 className="text-lg font-semibold text-white mb-4">Assignment Instructions</h2>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{assignment.description}</p>
              <div className="mt-6 flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {assignment.dueDate ? `Due ${new Date(assignment.dueDate).toLocaleDateString()}` : 'No due date'}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {assignment.maxScore} points max
                </span>
              </div>
            </motion.div>
          )}

          {activeTab === 'submit' && (
            <motion.div
              key="submit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {existingSubmission ? (
                <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <h2 className="text-lg font-semibold text-white">Submitted</h2>
                    <span className="text-xs text-gray-500 font-mono ml-auto">
                      {new Date(existingSubmission.submittedAt).toLocaleString()}
                    </span>
                  </div>
                  {(() => {
                    try {
                      const parsed = JSON.parse(existingSubmission.content);
                      return (
                        <div className="bg-[#0f0f0f] rounded-lg p-4 border border-white/5">
                          <p className="text-gray-300 text-sm whitespace-pre-wrap">{parsed.text || existingSubmission.content}</p>
                        </div>
                      );
                    } catch {
                      return (
                        <div className="bg-[#0f0f0f] rounded-lg p-4 border border-white/5">
                          <p className="text-gray-300 text-sm whitespace-pre-wrap">{existingSubmission.content}</p>
                        </div>
                      );
                    }
                  })()}
                  <div className="flex items-center gap-2 mt-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      existingSubmission.status === 'graded' ? 'bg-blue-500/10 text-blue-400' :
                      existingSubmission.status === 'ai_reviewed' ? 'bg-amber-500/10 text-amber-400' :
                      existingSubmission.status === 'tutor_reviewed' ? 'bg-emerald-500/10 text-emerald-400' :
                      'bg-white/5 text-gray-400'
                    }`}>
                      {existingSubmission.status.replace('_', ' ')}
                    </span>
                    {existingSubmission.grade !== null && (
                      <span className="text-sm font-bold text-white">
                        Grade: {existingSubmission.grade}/{assignment.maxScore}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5">
                    <h2 className="text-lg font-semibold text-white mb-4">Submit Your Work</h2>
                    <textarea
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      placeholder="Write your response here..."
                      className="w-full h-64 px-4 py-3 rounded-lg bg-[#0f0f0f] border border-white/5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#8A0000]/50 focus:ring-1 focus:ring-[#8A0000]/20 resize-none transition-all"
                    />
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-gray-500">{submissionText.length} characters</span>
                      <button
                        onClick={handleSubmit}
                        disabled={!submissionText.trim() || submitting}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#8A0000] text-white rounded-lg text-sm hover:bg-[#9B0F0F] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {submitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        Submit
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'feedback' && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {!existingSubmission ? (
                <div className="bg-[#1a1a1a] rounded-xl p-8 border border-white/5 text-center">
                  <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Submit your work first to receive feedback</p>
                </div>
              ) : (
                <>
                  {/* AI Feedback */}
                  <div className="bg-[#1a1a1a] rounded-xl p-6 border border-amber-500/10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">AI Feedback</h3>
                        <p className="text-[10px] text-gray-500">Automated review by Artemis AI</p>
                      </div>
                      {!existingSubmission.aiFeedback && (
                        <button
                          onClick={handleAIReview}
                          disabled={aiReviewing}
                          className="ml-auto flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-400 rounded-lg text-xs hover:bg-amber-500/20 transition-colors disabled:opacity-50"
                        >
                          {aiReviewing ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                          )}
                          Generate AI Review
                        </button>
                      )}
                    </div>
                    {existingSubmission.aiFeedback ? (
                      <p className="text-gray-300 text-sm leading-relaxed">{existingSubmission.aiFeedback}</p>
                    ) : (
                      <p className="text-gray-500 text-sm">Click &ldquo;Generate AI Review&rdquo; to get automated feedback on your submission.</p>
                    )}
                  </div>

                  {/* Tutor Feedback */}
                  <div className="bg-[#1a1a1a] rounded-xl p-6 border border-emerald-500/10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <UserCheck className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">Tutor Feedback</h3>
                        <p className="text-[10px] text-gray-500">Human expert review</p>
                      </div>
                    </div>
                    {existingSubmission.tutorFeedback?.length > 0 ? (
                      <div className="space-y-3">
                        {existingSubmission.tutorFeedback.map((fb) => (
                          <div key={fb.id} className="bg-[#0f0f0f] rounded-lg p-4 border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs text-emerald-400 font-semibold">{fb.tutor.name}</span>
                              <span className="text-[10px] text-gray-600 font-mono">
                                {new Date(fb.createdAt).toLocaleDateString()}
                              </span>
                              {fb.rating && (
                                <span className="text-[10px] text-gray-500 ml-auto">AI quality: {fb.rating}/5</span>
                              )}
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">{fb.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Your submission is awaiting tutor review.</p>
                    )}
                  </div>

                  {/* Grade */}
                  {existingSubmission.grade !== null && (
                    <div className="bg-[#1a1a1a] rounded-xl p-6 border border-blue-500/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-blue-400" />
                          </div>
                          <h3 className="text-sm font-semibold text-white">Final Grade</h3>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-white">{existingSubmission.grade}</p>
                          <p className="text-xs text-gray-500">/ {assignment.maxScore} points</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
