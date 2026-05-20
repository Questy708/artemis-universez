'use client';

import { ArrowRight, MessageSquareText, Brain, Shield } from 'lucide-react';

interface LandingPageProps {
  onNext: () => void;
}

export function LandingPage({ onNext }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-3">
          {/* 4-dot logo grid */}
          <div className="grid grid-cols-2 gap-[3px]">
            <div className="w-[7px] h-[7px] rounded-full bg-[#8A0000]" />
            <div className="w-[7px] h-[7px] rounded-full bg-[#8A0000]/70" />
            <div className="w-[7px] h-[7px] rounded-full bg-[#8A0000]/70" />
            <div className="w-[7px] h-[7px] rounded-full bg-[#8A0000]" />
          </div>
          <span className="text-sm font-medium tracking-wide text-white/90">
            Artemis Project
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Logo Mark */}
          <div className="flex justify-center mb-10">
            <div className="grid grid-cols-2 gap-[6px]">
              <div className="w-4 h-4 rounded-full bg-[#8A0000]" />
              <div className="w-4 h-4 rounded-full bg-[#8A0000]/60" />
              <div className="w-4 h-4 rounded-full bg-[#8A0000]/60" />
              <div className="w-4 h-4 rounded-full bg-[#8A0000]" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight mb-5">
            The future of learning is active
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-white/60 leading-relaxed max-w-lg mx-auto mb-14">
            The Artemis Project transforms how we teach, learn, and collaborate —
            through live seminars, real-time polls, breakout discussions, and
            AI-powered tutoring.
          </p>

          {/* Product Cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-14 max-w-lg mx-auto">
            {/* Artemis Forum Card */}
            <div className="group relative rounded-xl border border-white/10 bg-white/[0.03] p-6 text-left transition-all hover:border-[#8A0000]/40 hover:bg-white/[0.05]">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#8A0000]/15">
                  <MessageSquareText className="w-4.5 h-4.5 text-[#8A0000]" />
                </div>
                <h3 className="text-sm font-semibold text-white">Artemis Forum</h3>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                Live, interactive seminars where every voice matters. No back row.
                No passive lectures.
              </p>
            </div>

            {/* Artemis Tutor Card */}
            <div className="group relative rounded-xl border border-white/10 bg-white/[0.03] p-6 text-left transition-all hover:border-[#8A0000]/40 hover:bg-white/[0.05]">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#8A0000]/15">
                  <Brain className="w-4.5 h-4.5 text-[#8A0000]" />
                </div>
                <h3 className="text-sm font-semibold text-white">Artemis Tutor</h3>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                An AI learning companion that asks the questions you didn&apos;t think
                to ask.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={onNext}
              className="inline-flex items-center gap-2 h-11 px-7 rounded-lg bg-[#8A0000] text-white text-sm font-medium transition-all hover:bg-[#9B0F0F] active:scale-[0.98] shadow-lg shadow-[#8A0000]/20"
            >
              Enter the Forum
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-xs text-white/40">
              Already have an account?{' '}
              <button className="text-white/70 hover:text-white transition-colors underline underline-offset-2">
                Sign in
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
