'use client';

export function AppMockup() {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Mockup Container */}
      <div className="rounded-2xl bg-[#1a1a1a] border border-white/[0.06] overflow-hidden shadow-2xl shadow-black/40">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 h-10 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="grid grid-cols-2 gap-[2px]">
              <div className="w-[4px] h-[4px] rounded-full bg-[#8A0000]" />
              <div className="w-[4px] h-[4px] rounded-full bg-[#8A0000]/60" />
              <div className="w-[4px] h-[4px] rounded-full bg-[#8A0000]/60" />
              <div className="w-[4px] h-[4px] rounded-full bg-[#8A0000]" />
            </div>
            <span className="text-[10px] font-medium text-white/50">Active Learning Forum</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-white/10" />
            <div className="w-2 h-2 rounded-full bg-white/10" />
            <div className="w-2 h-2 rounded-full bg-white/10" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Participant Avatars */}
          <div className="flex items-center gap-1.5">
            {[
              'bg-[#8A0000]',
              'bg-emerald-500',
              'bg-amber-500',
              'bg-sky-500',
              'bg-violet-500',
              'bg-rose-400',
              'bg-teal-400',
            ].map((color, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full ${color} animate-pulse`}
                style={{
                  animationDelay: `${i * 300}ms`,
                  animationDuration: '3s',
                  opacity: 0.7 + (i === 0 ? 0.3 : 0),
                }}
              />
            ))}
            <span className="text-[9px] text-white/30 ml-1">+12 more</span>
          </div>

          {/* Main Video/Seminar Area */}
          <div className="relative rounded-xl bg-gradient-to-br from-[#8A0000]/20 to-[#8A0000]/5 border border-white/[0.06] aspect-video flex items-center justify-center overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div
                className="absolute top-2 left-3 w-16 h-8 rounded bg-white/5 animate-slide-in"
                style={{ animationDelay: '0ms' }}
              />
              <div
                className="absolute top-3 right-4 w-12 h-6 rounded bg-white/5 animate-slide-in"
                style={{ animationDelay: '200ms' }}
              />
              <div
                className="absolute bottom-3 left-6 w-20 h-5 rounded bg-white/5 animate-slide-in"
                style={{ animationDelay: '400ms' }}
              />
            </div>

            {/* Play Icon */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                <svg
                  className="w-4 h-4 text-white/80 ml-0.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="text-[10px] font-medium text-white/50 tracking-wide">
                Live Seminar
              </span>
            </div>

            {/* Live indicator */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[8px] font-medium text-white/40 uppercase tracking-wider">Live</span>
            </div>
          </div>

          {/* Timeline Steps */}
          <div className="flex items-center gap-2">
            {['Intro', 'Poll', 'Discuss', 'Q&A'].map((step, i) => (
              <div
                key={step}
                className={`flex-1 h-7 rounded-md border border-white/[0.06] flex items-center justify-center ${
                  i === 0 ? 'bg-[#8A0000]/20 border-[#8A0000]/20' : 'bg-white/[0.02]'
                }`}
              >
                <span className={`text-[8px] font-medium ${i === 0 ? 'text-[#8A0000]' : 'text-white/25'}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>

          {/* Chat Messages Floating In */}
          <div className="space-y-2">
            <div
              className="animate-chat-slide-in opacity-0"
              style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
            >
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/60 shrink-0" />
                <div className="bg-white/[0.05] rounded-lg rounded-tl-none px-2.5 py-1.5 max-w-[70%]">
                  <p className="text-[9px] text-white/50 leading-relaxed">
                    I think the key insight here is about active recall...
                  </p>
                </div>
              </div>
            </div>

            <div
              className="animate-chat-slide-in opacity-0"
              style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}
            >
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-sky-500/60 shrink-0" />
                <div className="bg-white/[0.05] rounded-lg rounded-tl-none px-2.5 py-1.5 max-w-[65%]">
                  <p className="text-[9px] text-white/50 leading-relaxed">
                    Great point! How does that connect to the reading?
                  </p>
                </div>
              </div>
            </div>

            <div
              className="animate-chat-slide-in opacity-0"
              style={{ animationDelay: '2.5s', animationFillMode: 'forwards' }}
            >
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-[#8A0000]/70 shrink-0" />
                <div className="bg-[#8A0000]/10 rounded-lg rounded-tl-none px-2.5 py-1.5 max-w-[60%] border border-[#8A0000]/10">
                  <p className="text-[9px] text-white/50 leading-relaxed">
                    That&apos;s exactly the right question 🎯
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline Keyframes */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes chat-slide-in {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
        }

        .animate-chat-slide-in {
          animation: chat-slide-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
