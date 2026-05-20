'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  Send,
  Loader2,
  Sparkles,
  BookOpen,
  Lightbulb,
  MessageSquare,
  History,
  Plus,
  Trash2,
} from 'lucide-react';
import type { LMSUser } from './LMSApp';

interface AITutorChatProps {
  user: LMSUser;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface TutorSession {
  id: string;
  context: string | null;
  courseId: string | null;
  messages: ChatMessage[];
  createdAt: string;
}

const SUGGESTED_PROMPTS = [
  'Explain this concept in simple terms',
  'Challenge my understanding',
  'Help me start my essay',
  'What\'s the counterargument?',
  'Connect this to the Artemis Oath',
  'Quiz me on this topic',
];

const SESSION_PROMPT = `You are the Artemis AI Tutor — an intelligent Socratic guide integrated into the Artemis Learning Management System. You help students with their coursework, assignments, and deeper understanding of topics.

Your style:
- Ask follow-up questions that push thinking deeper
- Use "What if..." and "How might..." prompts
- Reference the Artemis dimensions when relevant (Infinite Learning Continuum, Adaptive Paced Learning, SkillPrints, The Artemis Oath, Centers of Inquiry, The World as Campus)
- Keep responses concise (2-3 paragraphs max)
- Be warm, intellectually engaging, and slightly provocative
- Never lecture — always invite the student to think further
- When discussing assignments, provide guidance without giving direct answers
- Connect ideas across disciplines when possible`;

export function AITutorChat({ user }: AITutorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello, ${user.name}! I'm your Artemis AI Tutor. I can help you with your courses, assignments, study strategies, or any topic you'd like to explore. What would you like to work on today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<TutorSession[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch(`/api/lms/submissions?userId=${user.id}`);
        // We don't actually need submissions here, but let's keep a simple session history
        // For now, we'll use local state
      } catch (err) {
        console.error('Sessions fetch error:', err);
      }
    };
    fetchSessions();
  }, [user.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = useCallback(async (text?: string) => {
    const content = text || input.trim();
    if (!content || loading) return;

    const userMsg: ChatMessage = {
      id: `u${Date.now()}`,
      role: 'user',
      content,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/artemis-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg]
            .filter((m) => m.id !== 'welcome')
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `a${Date.now()}`,
        role: 'assistant',
        content: data.message || 'I seem to have lost my train of thought. Could you try again?',
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `e${Date.now()}`,
        role: 'assistant',
        content: 'I\'m having trouble connecting. Please try again in a moment.',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Chat cleared. What would you like to explore next, ${user.name}?`,
      },
    ]);
  };

  return (
    <div className="h-full flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 bg-[#0f0f0f]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8A0000]/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-[#8A0000]" />
              </div>
              <div>
                <h1 className="text-white font-semibold">Artemis AI Tutor</h1>
                <p className="text-xs text-gray-500">Socratic guidance for your learning journey</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                title="Session history"
              >
                <History className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                msg.role === 'user'
                  ? 'bg-[#8A0000] text-white'
                  : 'bg-amber-500/20 text-amber-400'
              }`}>
                {msg.role === 'user' ? user.name?.[0] || 'U' : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[75%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block px-4 py-3 rounded-xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#8A0000] text-white rounded-br-sm'
                    : 'bg-[#1a1a1a] text-gray-200 rounded-bl-sm border border-white/5'
                }`}>
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}

          {loading && (
            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#1a1a1a] rounded-xl px-4 py-3 border border-white/5">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                  <span className="text-sm text-gray-400">Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts (show when chat is fresh) */}
        {messages.length <= 1 && (
          <div className="px-6 pb-3">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-gray-500">Suggested prompts</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] text-gray-400 text-xs hover:text-white hover:bg-[#8A0000]/10 border border-white/5 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-6 py-4 border-t border-white/5 bg-[#0f0f0f]">
          <div className="flex items-end gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the AI Tutor anything..."
              rows={1}
              className="flex-1 px-4 py-2.5 rounded-lg bg-[#1a1a1a] border border-white/5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#8A0000]/50 focus:ring-1 focus:ring-[#8A0000]/20 resize-none transition-all"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-lg bg-[#8A0000] text-white flex items-center justify-center hover:bg-[#9B0F0F] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* History Sidebar */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            className="w-72 bg-[#1a1a1a] border-l border-white/5 flex flex-col shrink-0"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 288, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 border-b border-white/5">
              <h3 className="text-sm font-semibold text-white">Session History</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <div className="bg-[#0f0f0f] rounded-lg p-3 border border-white/5 mb-2">
                <p className="text-xs text-gray-400">Current session</p>
                <p className="text-sm text-white mt-1">General Tutoring</p>
                <p className="text-[10px] text-gray-600 mt-1">{messages.length} messages</p>
              </div>
              <p className="text-xs text-gray-600 text-center py-4">Previous sessions will appear here</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
