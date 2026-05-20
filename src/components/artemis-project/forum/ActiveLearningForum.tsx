'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Hand,
  BarChart3,
  MessageSquare,
  BookOpen,
  Bot,
  ChevronRight,
  Check,
  X,
  HelpCircle,
  Lightbulb,
  Users,
  Clock,
  Presentation,
  Mic,
  PanelRightOpen,
  PanelRightClose,
  LogOut,
  ArrowRight,
  Sparkles,
  Send,
  Loader2,
  ThumbsUp,
  GraduationCap,
  FileText,
  ClipboardList,
  ArrowLeft,
  LayoutDashboard,
  Radio,
  Zap,
  Globe,
  BrainCircuit,
} from 'lucide-react';

/* ─── Props ─── */
interface ActiveLearningForumProps {
  travelerName: string;
  workspace: string;
  onExit: () => void;
}

/* ─── Types ─── */
interface ChatMessage {
  id: string;
  sender: string;
  initials: string;
  text: string;
  timestamp: string;
  isSelf?: boolean;
}

interface TutorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  question: string;
  options: PollOption[];
  totalVotes: number;
}

interface Participant {
  id: string;
  name: string;
  initials: string;
  color: string;
  handRaised: boolean;
  isSpeaking: boolean;
}

interface TimelineStepData {
  id: number;
  label: string;
  icon: React.ReactNode;
  duration: string;
}

interface Session {
  id: string;
  title: string;
  time: string;
  instructor: string;
  day: string;
}

/* ─── Mock Data ─── */
const PARTICIPANTS: Participant[] = [
  { id: '1', name: 'Dr. Amara Osei', initials: 'AO', color: '#8A0000', handRaised: false, isSpeaking: true },
  { id: '2', name: 'Kai Nakamura', initials: 'KN', color: '#2563eb', handRaised: false, isSpeaking: false },
  { id: '3', name: 'Priya Sharma', initials: 'PS', color: '#7c3aed', handRaised: true, isSpeaking: false },
  { id: '4', name: 'Lena Torres', initials: 'LT', color: '#059669', handRaised: false, isSpeaking: false },
  { id: '5', name: 'Marcus Chen', initials: 'MC', color: '#d97706', handRaised: false, isSpeaking: false },
  { id: '6', name: 'Yuki Tanaka', initials: 'YT', color: '#dc2626', handRaised: false, isSpeaking: false },
  { id: '7', name: 'Fatima Al-Rashid', initials: 'FA', color: '#0891b2', handRaised: true, isSpeaking: false },
  { id: '8', name: 'James Okafor', initials: 'JO', color: '#4f46e5', handRaised: false, isSpeaking: false },
  { id: '9', name: 'Sofia Reyes', initials: 'SR', color: '#be185d', handRaised: false, isSpeaking: false },
  { id: '10', name: 'Ravi Patel', initials: 'RP', color: '#65a30d', handRaised: false, isSpeaking: false },
  { id: '11', name: 'Elena Volkov', initials: 'EV', color: '#9333ea', handRaised: false, isSpeaking: false },
  { id: '12', name: 'You', initials: 'YU', color: '#8A0000', handRaised: false, isSpeaking: false },
];

const TIMELINE_STEPS: TimelineStepData[] = [
  { id: 0, label: 'Session Introduction', icon: <Presentation className="w-4 h-4" />, duration: '5 min' },
  { id: 1, label: 'Opening Poll', icon: <BarChart3 className="w-4 h-4" />, duration: '3 min' },
  { id: 2, label: 'Discussion', icon: <MessageSquare className="w-4 h-4" />, duration: '10 min' },
  { id: 3, label: 'Breakout Rooms', icon: <Users className="w-4 h-4" />, duration: '15 min' },
  { id: 4, label: 'Group Presentations', icon: <Mic className="w-4 h-4" />, duration: '10 min' },
  { id: 5, label: 'Reflection Poll', icon: <BarChart3 className="w-4 h-4" />, duration: '3 min' },
  { id: 6, label: 'Session Wrap-up', icon: <Check className="w-4 h-4" />, duration: '5 min' },
];

const UPCOMING_SESSIONS: Session[] = [
  { id: 's1', title: 'Foundations of Synthetic Intelligence', time: '2:00 PM UTC', instructor: 'Dr. Amara Osei', day: 'Today' },
  { id: 's2', title: 'Adaptive Pacing in Practice', time: '10:00 AM UTC', instructor: 'Prof. Kai Nakamura', day: 'Tomorrow' },
  { id: 's3', title: 'The Artemis Oath: Purpose-Driven Design', time: '3:00 PM UTC', instructor: 'Dr. Priya Sharma', day: 'Wednesday' },
];

const INITIAL_CHAT: ChatMessage[] = [
  { id: 'c1', sender: 'Kai N.', initials: 'KN', text: 'The poll results are fascinating — I didn\'t expect that distribution', timestamp: '2:14 PM' },
  { id: 'c2', sender: 'Priya S.', initials: 'PS', text: 'I think the breakout room discussion really shifted my perspective', timestamp: '2:18 PM' },
  { id: 'c3', sender: 'Dr. Osei', initials: 'AO', text: 'Excellent observations. Let\'s carry this energy into the next activity.', timestamp: '2:20 PM' },
];

const OPENING_POLL: Poll = {
  question: 'What do you believe is the most critical challenge in designing ethical AI systems?',
  options: [
    { id: 'p1', text: 'Defining universal ethical frameworks across cultures', votes: 5 },
    { id: 'p2', text: 'Ensuring transparency without compromising proprietary methods', votes: 3 },
    { id: 'p3', text: 'Balancing innovation speed with safety precautions', votes: 2 },
    { id: 'p4', text: 'Preventing concentration of AI power in few entities', votes: 2 },
  ],
  totalVotes: 12,
};

const REFLECTION_POLL: Poll = {
  question: 'How has your understanding of ethical AI design evolved during this session?',
  options: [
    { id: 'r1', text: 'I now see it as fundamentally a cultural challenge, not technical', votes: 4 },
    { id: 'r2', text: 'I recognize the tension between transparency and innovation more clearly', votes: 3 },
    { id: 'r3', text: 'I appreciate the need for distributed governance structures', votes: 3 },
    { id: 'r4', text: 'I still believe the core challenge is defining universal principles', votes: 2 },
  ],
  totalVotes: 12,
};

const BREAKOUT_GROUPS = [
  { name: 'Group Alpha', members: ['Kai N.', 'Priya S.', 'Fatima A.'], topic: 'Cultural relativism vs. universal ethics in AI' },
  { name: 'Group Beta', members: ['Lena T.', 'Marcus C.', 'James O.'], topic: 'Transparency as a design principle' },
  { name: 'Group Gamma', members: ['Yuki T.', 'Sofia R.', 'Ravi P.'], topic: 'Distributed governance models for AI' },
  { name: 'Group Delta', members: ['You', 'Elena V.', 'Dr. Osei (Facilitator)'], topic: 'Balancing safety and innovation speed' },
];

const TUTOR_SUGGESTED_PROMPTS = [
  'Challenge my thinking',
  'Connect this to SkillPrints',
  'What\'s the counterargument?',
];

/* ─── Sub-Components ─── */

function ParticipantAvatar({ participant }: { participant: Participant }) {
  return (
    <motion.div
      className="relative flex-shrink-0 group"
      whileHover={{ scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white relative ${
          participant.isSpeaking ? 'ring-2 ring-[#22c55e] ring-offset-2 ring-offset-[#0f0f0f]' : ''
        }`}
        style={{ backgroundColor: participant.color }}
      >
        {participant.initials}
      </div>
      {participant.handRaised && (
        <motion.span
          className="absolute -top-1 -right-1 text-sm"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        >
          ✋
        </motion.span>
      )}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#242424] text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-white/10">
        {participant.name}
      </div>
    </motion.div>
  );
}

function ParticipantStrip({ participants }: { participants: Participant[] }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-white/5 overflow-x-auto">
      <Users className="w-4 h-4 text-gray-500 flex-shrink-0" />
      <span className="text-xs text-gray-500 font-mono flex-shrink-0">{participants.length}</span>
      <div className="flex items-center gap-2 ml-2">
        {participants.map((p) => (
          <ParticipantAvatar key={p.id} participant={p} />
        ))}
      </div>
    </div>
  );
}

function PollComponent({
  poll,
  submitted,
  selectedOption,
  onSelect,
  onSubmit,
}: {
  poll: Poll;
  submitted: boolean;
  selectedOption: string | null;
  onSelect: (id: string) => void;
  onSubmit: () => void;
}) {
  return (
    <motion.div
      className="bg-[#242424] rounded-xl p-6 border border-white/5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-[#8A0000]" />
        <h3 className="text-white font-semibold text-lg">Live Poll</h3>
      </div>
      <p className="text-gray-200 mb-5 text-base">{poll.question}</p>

      <div className="space-y-3">
        {poll.options.map((option) => {
          const percentage = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
          const isSelected = selectedOption === option.id;

          return (
            <div key={option.id}>
              {!submitted ? (
                <button
                  onClick={() => onSelect(option.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'border-[#8A0000] bg-[#8A0000]/20 text-white'
                      : 'border-white/10 bg-[#1a1a1a] text-gray-300 hover:border-white/20 hover:bg-[#1a1a1a]/80'
                  }`}
                >
                  <span className="text-sm">{option.text}</span>
                </button>
              ) : (
                <div className="relative w-full">
                  <div className="absolute inset-0 bg-[#1a1a1a] rounded-lg" />
                  <motion.div
                    className="relative h-12 rounded-lg flex items-center px-4"
                    style={{ backgroundColor: isSelected ? '#8A000040' : '#8A000020' }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  >
                    <span className="text-sm text-white truncate">{option.text}</span>
                  </motion.div>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-mono text-gray-400">
                    {percentage}%
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <motion.button
          onClick={onSubmit}
          disabled={!selectedOption}
          className={`mt-5 w-full py-3 rounded-lg font-semibold text-sm transition-all ${
            selectedOption
              ? 'bg-[#8A0000] text-white hover:bg-[#a00000] active:scale-[0.98]'
              : 'bg-[#242424] text-gray-600 cursor-not-allowed border border-white/5'
          }`}
          whileTap={selectedOption ? { scale: 0.98 } : {}}
        >
          Submit Response
        </motion.button>
      )}

      {submitted && (
        <p className="mt-4 text-xs text-gray-500 font-mono text-center">
          {poll.totalVotes} responses • Results are live
        </p>
      )}
    </motion.div>
  );
}

function ChatMessageBubble({ msg }: { msg: ChatMessage }) {
  return (
    <motion.div
      className={`flex gap-2.5 ${msg.isSelf ? 'flex-row-reverse' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
        style={{ backgroundColor: msg.isSelf ? '#8A0000' : '#333' }}
      >
        {msg.initials}
      </div>
      <div className={`max-w-[80%] ${msg.isSelf ? 'text-right' : ''}`}>
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="text-xs font-semibold text-gray-300">{msg.sender}</span>
          <span className="text-[10px] text-gray-600 font-mono">{msg.timestamp}</span>
        </div>
        <div
          className={`inline-block px-3 py-2 rounded-lg text-sm ${
            msg.isSelf
              ? 'bg-[#8A0000] text-white rounded-br-sm'
              : 'bg-[#242424] text-gray-200 rounded-bl-sm border border-white/5'
          }`}
        >
          {msg.text}
        </div>
      </div>
    </motion.div>
  );
}

function TimelineStepItem({
  step,
  isCurrent,
  isCompleted,
  onClick,
}: {
  step: TimelineStepData;
  isCurrent: boolean;
  isCompleted: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
        isCurrent
          ? 'bg-[#8A0000]/20 border border-[#8A0000]/40'
          : isCompleted
          ? 'hover:bg-white/5'
          : 'hover:bg-white/5 opacity-60'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isCurrent
            ? 'bg-[#8A0000] text-white shadow-[0_0_12px_rgba(138,0,0,0.5)]'
            : isCompleted
            ? 'bg-[#22c55e]/20 text-[#22c55e]'
            : 'bg-[#242424] text-gray-500'
        }`}
      >
        {isCompleted ? <Check className="w-4 h-4" /> : step.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-sm truncate ${isCurrent ? 'text-white font-semibold' : 'text-gray-400'}`}>
          {step.label}
        </p>
        <p className="text-[10px] text-gray-600 font-mono">{step.duration}</p>
      </div>
      {isCurrent && (
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-[#8A0000]"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </button>
  );
}

function MainStageContent({
  step,
  currentPoll,
  pollSubmitted,
  selectedPollOption,
  onSelectPollOption,
  onSubmitPoll,
}: {
  step: number;
  currentPoll: Poll | null;
  pollSubmitted: boolean;
  selectedPollOption: string | null;
  onSelectPollOption: (id: string) => void;
  onSubmitPoll: () => void;
}) {
  switch (step) {
    case 0:
      return (
        <motion.div
          className="flex flex-col items-center justify-center h-full text-center px-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#8A0000]/20 flex items-center justify-center mb-6">
            <Presentation className="w-8 h-8 text-[#8A0000]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Foundations of Synthetic Intelligence
          </h2>
          <p className="text-gray-400 mb-6">with Dr. Amara Osei</p>
          <div className="bg-[#242424] rounded-xl p-5 max-w-lg border border-white/5">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#8A0000]" />
              Learning Objectives
            </h3>
            <ul className="space-y-2 text-sm text-gray-400 text-left">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 text-[#8A0000] mt-1 flex-shrink-0" />
                Analyze the ethical dimensions of synthetic intelligence design
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 text-[#8A0000] mt-1 flex-shrink-0" />
                Evaluate competing frameworks for responsible AI governance
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 text-[#8A0000] mt-1 flex-shrink-0" />
                Synthesize perspectives through collaborative deliberation
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 text-[#8A0000] mt-1 flex-shrink-0" />
                Articulate a personal position on AI ethics through the Artemis Oath lens
              </li>
            </ul>
          </div>
        </motion.div>
      );

    case 1:
      return currentPoll ? (
        <div className="flex items-center justify-center h-full px-8">
          <div className="w-full max-w-xl">
            <PollComponent
              poll={currentPoll}
              submitted={pollSubmitted}
              selectedOption={selectedPollOption}
              onSelect={onSelectPollOption}
              onSubmit={onSubmitPoll}
            />
          </div>
        </div>
      ) : null;

    case 2:
      return (
        <motion.div
          className="flex flex-col items-center justify-center h-full text-center px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#8A0000]/20 flex items-center justify-center mb-6">
            <MessageSquare className="w-8 h-8 text-[#8A0000]" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3">Open Discussion</h2>
          <div className="bg-[#242424] rounded-xl p-6 max-w-lg border border-white/5">
            <p className="text-gray-300 text-base leading-relaxed">
              &ldquo;If ethical frameworks are culturally contingent, can we ever build AI systems
              that are universally fair — or is the pursuit itself a form of cultural imposition?&rdquo;
            </p>
          </div>
          <p className="text-gray-500 text-sm mt-4 font-mono">Raise your hand to contribute</p>
        </motion.div>
      );

    case 3:
      return (
        <motion.div
          className="flex flex-col items-center justify-center h-full px-8 py-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#8A0000]/20 flex items-center justify-center mb-6">
            <Users className="w-8 h-8 text-[#8A0000]" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Breakout Rooms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
            {BREAKOUT_GROUPS.map((group, i) => (
              <motion.div
                key={group.name}
                className="bg-[#242424] rounded-xl p-4 border border-white/5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <h3 className="text-sm font-semibold text-white mb-1">{group.name}</h3>
                <p className="text-xs text-gray-500 mb-2 italic">{group.topic}</p>
                <div className="flex flex-wrap gap-1">
                  {group.members.map((member) => (
                    <span
                      key={member}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 font-mono"
                    >
                      {member}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );

    case 4:
      return (
        <motion.div
          className="flex flex-col items-center justify-center h-full px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#8A0000]/20 flex items-center justify-center mb-6">
            <Mic className="w-8 h-8 text-[#8A0000]" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Group Presentations</h2>
          <p className="text-gray-500 text-sm mb-6">Group Alpha is presenting</p>
          <div className="bg-[#242424] rounded-xl p-5 max-w-lg w-full border border-white/5">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#8A0000]" />
              Shared Notes — Group Alpha
            </h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>
                &bull; Cultural relativism challenges the assumption that &ldquo;fairness&rdquo; has a
                single definition
              </p>
              <p>
                &bull; Universal ethics may require a meta-framework that accommodates pluralism
              </p>
              <p>
                &bull; Key tension: who gets to define the &ldquo;universal&rdquo; principles?
              </p>
              <p>&bull; Proposed: a layered governance model with local adaptation</p>
            </div>
          </div>
        </motion.div>
      );

    case 5:
      return currentPoll ? (
        <div className="flex items-center justify-center h-full px-8">
          <div className="w-full max-w-xl">
            <PollComponent
              poll={currentPoll}
              submitted={pollSubmitted}
              selectedOption={selectedPollOption}
              onSelect={onSelectPollOption}
              onSubmit={onSubmitPoll}
            />
          </div>
        </div>
      ) : null;

    case 6:
      return (
        <motion.div
          className="flex flex-col items-center justify-center h-full text-center px-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#22c55e]/20 flex items-center justify-center mb-6">
            <Check className="w-8 h-8 text-[#22c55e]" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3">Session Wrap-up</h2>
          <div className="bg-[#242424] rounded-xl p-5 max-w-lg border border-white/5">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-sm text-gray-400 text-left">
              <li className="flex items-start gap-2">
                <Check className="w-3 h-3 text-[#22c55e] mt-1 flex-shrink-0" />
                Ethical AI design requires balancing universal principles with cultural sensitivity
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3 h-3 text-[#22c55e] mt-1 flex-shrink-0" />
                Transparency and innovation speed are not inherently opposed
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3 h-3 text-[#22c55e] mt-1 flex-shrink-0" />
                Distributed governance models offer promising structures for AI oversight
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3 h-3 text-[#22c55e] mt-1 flex-shrink-0" />
                The Artemis Oath framework connects personal purpose to systemic responsibility
              </li>
            </ul>
          </div>
          <p className="text-gray-500 text-xs mt-5 font-mono">
            Next session: Adaptive Pacing in Practice — Tomorrow, 10:00 AM UTC
          </p>
        </motion.div>
      );

    default:
      return null;
  }
}

function DashboardView({
  travelerName,
  workspace,
  onJoinSession,
  onExit,
}: {
  travelerName: string;
  workspace: string;
  onJoinSession: () => void;
  onExit: () => void;
}) {
  return (
    <motion.div
      className="min-h-screen bg-[#0f0f0f] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <header className="px-6 py-5 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#8A0000] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Active Learning Forum</h1>
              <p className="text-gray-500 text-xs font-mono">{workspace}</p>
            </div>
          </div>
          <button
            onClick={onExit}
            className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 max-w-6xl mx-auto w-full">
        {/* Welcome */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
            Welcome back, {travelerName}
          </h2>
          <p className="text-gray-500">Your next session starts soon. Ready to learn?</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Sessions */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Upcoming Sessions
              </h3>
              <div className="space-y-3">
                {UPCOMING_SESSIONS.map((session, i) => (
                  <motion.button
                    key={session.id}
                    onClick={onJoinSession}
                    className="w-full bg-[#242424] rounded-xl p-4 border border-white/5 hover:border-[#8A0000]/40 transition-all text-left group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.08 }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-sm group-hover:text-[#8A0000] transition-colors truncate">
                          {session.title}
                        </h4>
                        <p className="text-gray-500 text-xs mt-1">{session.instructor}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                        <span className="text-[10px] px-2 py-1 rounded-full bg-[#8A0000]/10 text-[#8A0000] font-mono">
                          {session.day}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">{session.time}</span>
                        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-[#8A0000] transition-colors" />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Recent Activity
              </h3>
              <div className="space-y-2">
                {[
                  { icon: <BarChart3 className="w-4 h-4" />, text: 'Completed poll: "Ethical AI Priorities"', time: '2 hours ago' },
                  { icon: <FileText className="w-4 h-4" />, text: 'Submitted reflection: "Cultural Frameworks"', time: '1 day ago' },
                  { icon: <Users className="w-4 h-4" />, text: 'Participated in breakout: "Governance Models"', time: '1 day ago' },
                  { icon: <ThumbsUp className="w-4 h-4" />, text: 'Received peer feedback on presentation', time: '2 days ago' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 bg-[#1a1a1a] rounded-lg border border-white/5"
                  >
                    <div className="text-gray-500">{item.icon}</div>
                    <span className="text-sm text-gray-300 flex-1">{item.text}</span>
                    <span className="text-[10px] text-gray-600 font-mono">{item.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={onJoinSession}
                  className="w-full flex items-center gap-3 px-4 py-3.5 bg-[#8A0000] text-white rounded-xl hover:bg-[#a00000] transition-colors group"
                >
                  <Radio className="w-4 h-4" />
                  <span className="text-sm font-semibold">Join Session</span>
                  <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3.5 bg-[#242424] text-gray-300 rounded-xl hover:bg-[#2a2a2a] transition-colors border border-white/5">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm">Review Notes</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3.5 bg-[#242424] text-gray-300 rounded-xl hover:bg-[#2a2a2a] transition-colors border border-white/5">
                  <ClipboardList className="w-4 h-4" />
                  <span className="text-sm">Check Grades</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3.5 bg-[#242424] text-gray-300 rounded-xl hover:bg-[#2a2a2a] transition-colors border border-white/5">
                  <BrainCircuit className="w-4 h-4" />
                  <span className="text-sm">SkillPrints</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3.5 bg-[#242424] text-gray-300 rounded-xl hover:bg-[#2a2a2a] transition-colors border border-white/5">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">Global Cohort</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto px-6 py-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={onExit}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-300 text-xs transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Exit to University of Artemis
          </button>
        </div>
      </footer>
    </motion.div>
  );
}

/* ─── Main Component ─── */
export function ActiveLearningForum({ travelerName, workspace, onExit }: ActiveLearningForumProps) {
  // View state
  const [activeView, setActiveView] = useState<'dashboard' | 'session'>('dashboard');
  const [sidebarTab, setSidebarTab] = useState<'timeline' | 'chat' | 'tutor'>('timeline');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Session state
  const [handRaised, setHandRaised] = useState(false);
  const [timelineStep, setTimelineStep] = useState(0);
  const [pollSubmitted, setPollSubmitted] = useState(false);
  const [selectedPollOption, setSelectedPollOption] = useState<string | null>(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [chatInput, setChatInput] = useState('');

  // Tutor state
  const [tutorMessages, setTutorMessages] = useState<TutorMessage[]>([
    {
      id: 't0',
      role: 'assistant',
      content:
        "I'm your Artemis Tutor. Ask me anything about this session's topics — or request a Socratic challenge to deepen your thinking.",
    },
  ]);
  const [tutorInput, setTutorInput] = useState('');
  const [tutorLoading, setTutorLoading] = useState(false);

  // Refs
  const chatEndRef = useRef<HTMLDivElement>(null);
  const tutorEndRef = useRef<HTMLDivElement>(null);

  // Derived state
  const currentPoll = timelineStep === 1 ? OPENING_POLL : timelineStep === 5 ? REFLECTION_POLL : null;

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    tutorEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [tutorMessages, tutorLoading]);

  // Reset poll state when step changes
  useEffect(() => {
    setPollSubmitted(false);
    setSelectedPollOption(null);
  }, [timelineStep]);

  // Handlers
  const handleJoinSession = useCallback(() => {
    setActiveView('session');
  }, []);

  const handleExitToDashboard = useCallback(() => {
    setActiveView('dashboard');
  }, []);

  const handleSendChat = useCallback(() => {
    if (!chatInput.trim()) return;
    const newMsg: ChatMessage = {
      id: `c${Date.now()}`,
      sender: 'You',
      initials: 'YU',
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');
  }, [chatInput]);

  const handleSendTutor = useCallback(async (text?: string) => {
    const content = text || tutorInput.trim();
    if (!content || tutorLoading) return;

    const userMsg: TutorMessage = {
      id: `tu${Date.now()}`,
      role: 'user',
      content,
    };

    setTutorMessages((prev) => [...prev, userMsg]);
    setTutorInput('');
    setTutorLoading(true);

    try {
      const response = await fetch('/api/artemis-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...tutorMessages, userMsg]
            .filter((m) => m.id !== 't0')
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      const assistantMsg: TutorMessage = {
        id: `ta${Date.now()}`,
        role: 'assistant',
        content: data.message || data.error || 'I seem to have lost my train of thought. Could you try again?',
      };
      setTutorMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: TutorMessage = {
        id: `te${Date.now()}`,
        role: 'assistant',
        content: 'I\'m having trouble connecting. Please try again in a moment.',
      };
      setTutorMessages((prev) => [...prev, errorMsg]);
    } finally {
      setTutorLoading(false);
    }
  }, [tutorInput, tutorLoading, tutorMessages]);

  // Dashboard view
  if (activeView === 'dashboard') {
    return (
      <DashboardView
        travelerName={travelerName}
        workspace={workspace}
        onJoinSession={handleJoinSession}
        onExit={onExit}
      />
    );
  }

  // Session view
  return (
    <div className="h-screen bg-[#0f0f0f] flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a1a] border-b border-white/5">
        <div className="flex items-center gap-3">
          <button
            onClick={handleExitToDashboard}
            className="flex items-center gap-1 text-gray-400 hover:text-white text-xs transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#8A0000] flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 text-white" />
            </div>
            <h1 className="text-white font-semibold text-sm">Foundations of Synthetic Intelligence</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-gray-500">
            Step {timelineStep + 1}/7
          </span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[10px] text-[#22c55e] font-mono">LIVE</span>
          </div>
        </div>
      </div>

      {/* Participant Strip */}
      <ParticipantStrip participants={PARTICIPANTS.map((p) => ({
        ...p,
        handRaised: p.id === '12' ? handRaised : p.handRaised,
      }))} />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Stage */}
        <div className="flex-1 overflow-y-auto">
          <MainStageContent
            step={timelineStep}
            currentPoll={currentPoll}
            pollSubmitted={pollSubmitted}
            selectedPollOption={selectedPollOption}
            onSelectPollOption={setSelectedPollOption}
            onSubmitPoll={() => setPollSubmitted(true)}
          />
        </div>

        {/* Sidebar */}
        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <motion.div
              className="w-80 bg-[#1a1a1a] border-l border-white/5 flex flex-col overflow-hidden"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Sidebar Tabs */}
              <div className="flex border-b border-white/5">
                {[
                  { id: 'timeline' as const, icon: <Clock className="w-3.5 h-3.5" />, label: 'Timeline' },
                  { id: 'chat' as const, icon: <MessageSquare className="w-3.5 h-3.5" />, label: 'Chat' },
                  { id: 'tutor' as const, icon: <Bot className="w-3.5 h-3.5" />, label: 'Tutor' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSidebarTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs transition-colors ${
                      sidebarTab === tab.id
                        ? 'text-white border-b-2 border-[#8A0000] bg-[#8A0000]/5'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Timeline Tab */}
                {sidebarTab === 'timeline' && (
                  <div className="p-3 space-y-1">
                    {TIMELINE_STEPS.map((step) => (
                      <TimelineStepItem
                        key={step.id}
                        step={step}
                        isCurrent={step.id === timelineStep}
                        isCompleted={step.id < timelineStep}
                        onClick={() => setTimelineStep(step.id)}
                      />
                    ))}
                    <div className="pt-3">
                      <button
                        onClick={() => setTimelineStep(Math.min(6, timelineStep + 1))}
                        disabled={timelineStep >= 6}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#8A0000]/10 text-[#8A0000] text-xs rounded-lg hover:bg-[#8A0000]/20 transition-colors disabled:opacity-30"
                      >
                        Next Step
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Chat Tab */}
                {sidebarTab === 'chat' && (
                  <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[calc(100vh-200px)]">
                      {chatMessages.map((msg) => (
                        <ChatMessageBubble key={msg.id} msg={msg} />
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                    <div className="p-3 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                          placeholder="Send a message..."
                          className="flex-1 bg-[#242424] text-white text-sm px-3 py-2 rounded-lg border border-white/5 focus:outline-none focus:border-[#8A0000]/40 placeholder:text-gray-600"
                        />
                        <button
                          onClick={handleSendChat}
                          disabled={!chatInput.trim()}
                          className="p-2 rounded-lg bg-[#8A0000] text-white hover:bg-[#a00000] transition-colors disabled:opacity-30"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tutor Tab */}
                {sidebarTab === 'tutor' && (
                  <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[calc(100vh-260px)]">
                      {tutorMessages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                              msg.role === 'assistant'
                                ? 'bg-[#8A0000]/20 text-[#8A0000]'
                                : 'bg-[#8A0000] text-white'
                            }`}
                          >
                            {msg.role === 'assistant' ? (
                              <Bot className="w-3.5 h-3.5" />
                            ) : (
                              <span className="text-[10px] font-bold">Y</span>
                            )}
                          </div>
                          <div
                            className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                              msg.role === 'user'
                                ? 'bg-[#8A0000] text-white rounded-br-sm'
                                : 'bg-[#242424] text-gray-200 rounded-bl-sm border border-white/5'
                            }`}
                          >
                            {msg.content}
                          </div>
                        </motion.div>
                      ))}
                      {tutorLoading && (
                        <div className="flex gap-2.5">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#8A0000]/20 text-[#8A0000]">
                            <Bot className="w-3.5 h-3.5" />
                          </div>
                          <div className="bg-[#242424] border border-white/5 px-4 py-3 rounded-lg rounded-bl-sm">
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 bg-[#8A0000] rounded-full animate-bounce [animation-delay:0ms]" />
                              <div className="w-1.5 h-1.5 bg-[#8A0000] rounded-full animate-bounce [animation-delay:150ms]" />
                              <div className="w-1.5 h-1.5 bg-[#8A0000] rounded-full animate-bounce [animation-delay:300ms]" />
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={tutorEndRef} />
                    </div>

                    {/* Suggested Prompts */}
                    {tutorMessages.length <= 1 && (
                      <div className="px-3 pb-2">
                        <div className="flex flex-wrap gap-1.5">
                          {TUTOR_SUGGESTED_PROMPTS.map((prompt) => (
                            <button
                              key={prompt}
                              onClick={() => handleSendTutor(prompt)}
                              className="text-[10px] px-2.5 py-1.5 rounded-full bg-[#8A0000]/10 text-[#8A0000] hover:bg-[#8A0000]/20 transition-colors"
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="p-3 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={tutorInput}
                          onChange={(e) => setTutorInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendTutor()}
                          placeholder="Ask the tutor..."
                          disabled={tutorLoading}
                          className="flex-1 bg-[#242424] text-white text-sm px-3 py-2 rounded-lg border border-white/5 focus:outline-none focus:border-[#8A0000]/40 placeholder:text-gray-600 disabled:opacity-50"
                        />
                        <button
                          onClick={() => handleSendTutor()}
                          disabled={!tutorInput.trim() || tutorLoading}
                          className="p-2 rounded-lg bg-[#8A0000] text-white hover:bg-[#a00000] transition-colors disabled:opacity-30"
                        >
                          {tutorLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1a1a] border-t border-white/5">
        <div className="flex items-center gap-2">
          {/* Hand Raise */}
          <motion.button
            onClick={() => setHandRaised(!handRaised)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              handRaised
                ? 'bg-[#8A0000] text-white shadow-[0_0_12px_rgba(138,0,0,0.4)]'
                : 'bg-[#242424] text-gray-400 hover:text-white hover:bg-[#2a2a2a] border border-white/5'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <Hand className="w-4 h-4" />
            <span className="hidden sm:inline">{handRaised ? 'Raised' : 'Raise Hand'}</span>
          </motion.button>

          {/* Poll Button */}
          <button
            onClick={() => {
              if (timelineStep !== 1 && timelineStep !== 5) {
                setTimelineStep(1);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              currentPoll
                ? 'bg-[#8A0000]/20 text-[#8A0000] border border-[#8A0000]/30'
                : 'bg-[#242424] text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Poll</span>
          </button>

          {/* Reactions */}
          <div className="flex items-center gap-1">
            {[
              { icon: <Check className="w-4 h-4" />, label: 'Agree', color: 'text-[#22c55e] hover:bg-[#22c55e]/10' },
              { icon: <X className="w-4 h-4" />, label: 'Disagree', color: 'text-red-400 hover:bg-red-400/10' },
              { icon: <HelpCircle className="w-4 h-4" />, label: 'Confused', color: 'text-yellow-400 hover:bg-yellow-400/10' },
              { icon: <Lightbulb className="w-4 h-4" />, label: 'Insight', color: 'text-[#8A0000] hover:bg-[#8A0000]/10' },
            ].map((reaction) => (
              <motion.button
                key={reaction.label}
                onClick={() => {
                  // Flash feedback on reaction click
                }}
                className={`p-2 rounded-lg transition-colors ${reaction.color}`}
                whileTap={{ scale: 0.85 }}
                title={reaction.label}
              >
                {reaction.icon}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Speaker Queue */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#242424] rounded-lg border border-white/5">
            <Mic className="w-3 h-3 text-gray-500" />
            <span className="text-[10px] text-gray-500 font-mono">Queue:</span>
            <div className="flex items-center gap-1.5">
              {['Priya S.', 'Fatima A.', 'Kai N.'].map((name, i) => (
                <span key={name} className="text-[10px] text-gray-400 font-mono">
                  {i > 0 && <span className="text-gray-600 mr-1.5">›</span>}
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-[#242424] text-gray-400 hover:text-white transition-colors border border-white/5"
          >
            {sidebarOpen ? (
              <PanelRightClose className="w-4 h-4" />
            ) : (
              <PanelRightOpen className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActiveLearningForum;
