'use client';

import { useState, useEffect } from "react";
import { SectionHeading, HeroHeader } from "../Shared";

interface Props {
  goTo: (page: string) => void;
}

/* ─── Badge Definitions ─── */
const badges = [
  { id: 'explorer', name: 'Rift Explorer', icon: '◈', desc: 'Visited all 6 dimensions', requirement: 'Visit every provocation page', earned: false },
  { id: 'deep-diver', name: 'Deep Diver', icon: '▽', desc: 'Spent 2+ minutes on a dimension', requirement: 'Engage deeply with any dimension', earned: false },
  { id: 'oath-taker', name: 'Oath Taker', icon: '⚷', desc: 'Sealed your oath in the registry', requirement: 'Draft and seal an oath on the Purpose page', earned: false },
  { id: 'specimen-examiner', name: 'Specimen Examiner', icon: '◉', desc: 'Opened all specimen drawers', requirement: 'Open all 4 SkillPrint specimens', earned: false },
  { id: 'voyage-witness', name: 'Voyage Witness', icon: '✦', desc: 'Read all 5 voyage log entries', requirement: 'Read all captain\'s logs from the Voyage', earned: false },
  { id: 'pulse-reader', name: 'Pulse Reader', icon: '≋', desc: 'Expanded all pulse chamber recordings', requirement: 'Open all 4 biofeedback cards', earned: false },
  { id: 'field-correspondent', name: 'Field Correspondent', icon: '✉', desc: 'Read all field dispatches', requirement: 'Read all 5 dispatches from the global nodes', earned: false },
  { id: 'continuum-capsuler', name: 'Capsule Keeper', icon: '⬡', desc: 'Opened all Continuum Capsule artifacts', requirement: 'Open all 6 capsule artifacts', earned: false },
];

/* ─── Dimensions for Quest Tracker ─── */
const dimensions = [
  { slug: 'open-loop-learning', name: 'Infinite Learning Continuum', badge: 'continuum-capsuler' },
  { slug: 'adaptive-paced-learning', name: 'Adaptive Paced Learning', badge: 'pulse-reader' },
  { slug: 'global-skills-matrix', name: 'SkillPrints', badge: 'specimen-examiner' },
  { slug: 'purpose-learning', name: 'The Artemis Oath', badge: 'oath-taker' },
  { slug: 'centers-of-inquiry', name: 'Centers of Inquiry', badge: 'field-correspondent' },
  { slug: 'darwin-voyage', name: 'The World as Campus', badge: 'voyage-witness' },
];

/* ─── Certificate Templates ─── */
const certificateTypes = [
  {
    title: 'Rift Navigator',
    condition: 'Visit all 6 dimensions',
    desc: 'This certifies that the bearer has traversed every dimension of the Artemis 2100 exhibit — witnessing the Infinite Learning Continuum, walking the Adaptive Paced path, examining SkillPrint specimens, taking the Oath, reading dispatches from the Centers of Inquiry, and sailing the Voyage Rotation.',
  },
  {
    title: 'Future Architect',
    condition: 'Earn 4+ badges',
    desc: 'This certifies that the bearer has gone beyond observation and entered the realm of active engagement — opening specimens, reading dispatches, sealing oaths, and expanding artifacts. They have not merely visited the future; they have reached through the Rift and pulled back knowledge.',
  },
  {
    title: 'Continuum Guardian',
    condition: 'Earn all 8 badges',
    desc: 'This certifies that the bearer has completed the full Artemis 2100 experience — every dimension explored, every artifact examined, every oath considered, every dispatch read, every log entry witnessed. They stand as a Guardian of the Continuum, carrying the future forward into the present.',
  },
];

export default function BuildPage({ goTo }: Props) {
  const [earnedBadges, setEarnedBadges] = useState<Set<string>>(new Set());
  const [visitedDimensions, setVisitedDimensions] = useState<Set<string>>(new Set());
  const [showCertificate, setShowCertificate] = useState<string | null>(null);
  const [visitorName, setVisitorName] = useState('');
  const [nameSaved, setNameSaved] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('artemis2100-progress');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.badges) setEarnedBadges(new Set(data.badges));
        if (data.visited) setVisitedDimensions(new Set(data.visited));
        if (data.name) { setVisitorName(data.name); setNameSaved(true); }
      }
    } catch { /* ignore */ }
  }, []);

  // Save progress to localStorage
  const saveProgress = (badges: Set<string>, visited: Set<string>, name?: string) => {
    try {
      localStorage.setItem('artemis2100-progress', JSON.stringify({
        badges: Array.from(badges),
        visited: Array.from(visited),
        name: name || visitorName,
      }));
    } catch { /* ignore */ }
  };

  const toggleBadge = (id: string) => {
    const newBadges = new Set(earnedBadges);
    if (newBadges.has(id)) newBadges.delete(id);
    else newBadges.add(id);
    setEarnedBadges(newBadges);
    saveProgress(newBadges, visitedDimensions);
  };

  const markDimensionVisited = (slug: string) => {
    const newVisited = new Set(visitedDimensions);
    newVisited.add(slug);
    setVisitedDimensions(newVisited);
    saveProgress(earnedBadges, newVisited);
  };

  const handleSaveName = () => {
    if (visitorName.trim()) {
      setNameSaved(true);
      saveProgress(earnedBadges, visitedDimensions, visitorName.trim());
    }
  };

  const earnedCount = earnedBadges.size;
  const visitedCount = visitedDimensions.size;
  const allDimensionsVisited = visitedCount >= 6;
  const progressPct = Math.round((earnedCount / badges.length) * 100);

  return (
    <>
      <HeroHeader
        title="Design a Future"
        description="A Rift in Spacetime has opened — and you are the architect of what comes through it. Step into an immersive design exercise to shape the future of learning where you are."
        bgGradientClass="bg-[#d92231]"
        bgImage="https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=2000"
      />
      <div className="max-w-[1400px] mx-auto w-full px-5 sm:px-8 lg:px-20 py-16 lg:py-24 space-y-24">

        {/* ═══ Rift Introduction ═══ */}
        <section className="space-y-6 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 border-b pb-2 w-fit italic">A Rift in Spacetime</h2>
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed font-serif">
             <p className="italic">Imagine that a Rift has torn through the fabric of conventional time. On the other side, you glimpse a world where education has been completely reimagined — where the boundaries between disciplines, institutions, and eras have dissolved. The Rift is unstable. It won&apos;t stay open for long. Your mission: reach through, pull back what you can, and build it here.</p>
             <p>Design a Future is an immersive, gamified exercise that equips you — whether you are a student, educator, policymaker, or innovator — with the tools to experiment toward a new paradigm of learning and living. As you explore the Artemis 2100 exhibit, you earn badges, unlock achievements, and qualify for certificates that testify to your journey through the future of education.</p>
          </div>
        </section>

        {/* ═══ Explorer Identity ═══ */}
        <section className="space-y-8">
          <SectionHeading>Explorer Identity</SectionHeading>
          <div className="max-w-md space-y-4">
            {!nameSaved ? (
              <div className="flex gap-3">
                <input
                  type="text"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="Enter your name, Explorer..."
                  className="flex-1 border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#8A0000] transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                />
                <button
                  onClick={handleSaveName}
                  className="px-6 py-3 bg-[#8A0000] text-white text-sm font-bold uppercase tracking-wider hover:bg-[#6A0000] transition-colors cursor-pointer"
                >
                  Enter
                </button>
              </div>
            ) : (
              <div className="border border-[#8A0000]/20 bg-[#8A0000]/5 p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-[#8A0000] flex items-center justify-center text-white text-sm font-bold italic">
                  {visitorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{visitorName}</p>
                  <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Explorer · Badge Level: {earnedCount}/{badges.length}</p>
                </div>
                <button
                  onClick={() => setNameSaved(false)}
                  className="ml-auto text-[10px] font-mono text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  EDIT
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ═══ Progress Dashboard ═══ */}
        <section className="space-y-12">
          <SectionHeading>Expedition Progress</SectionHeading>

          {/* Progress bar */}
          <div className="max-w-2xl space-y-3">
            <div className="flex justify-between text-xs font-mono text-gray-400 uppercase tracking-wider">
              <span>Exhibit Engagement</span>
              <span>{progressPct}% Complete</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8A0000] rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>{earnedCount} of {badges.length} badges earned</span>
              <span>{visitedCount} of 6 dimensions visited</span>
            </div>
          </div>

          {/* Dimension checklist */}
          <div className="grid md:grid-cols-2 gap-4">
            {dimensions.map((dim) => {
              const isVisited = visitedDimensions.has(dim.slug);
              return (
                <div
                  key={dim.slug}
                  className={`border p-4 flex items-center gap-4 transition-all cursor-pointer ${
                    isVisited ? 'border-[#8A0000]/30 bg-[#8A0000]/5' : 'border-gray-200 hover:border-gray-400'
                  }`}
                  onClick={() => {
                    markDimensionVisited(dim.slug);
                    goTo(dim.slug);
                  }}
                >
                  <div className={`w-8 h-8 flex items-center justify-center text-xs font-bold shrink-0 ${
                    isVisited ? 'bg-[#8A0000] text-white' : 'bg-gray-200 text-gray-400'
                  } transition-colors`}>
                    {isVisited ? '✓' : (dimensions.indexOf(dim) + 1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${isVisited ? 'text-gray-900' : 'text-gray-500'}`}>
                      {dim.name}
                    </p>
                    <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                      {isVisited ? 'Explored' : 'Not yet visited'}
                    </p>
                  </div>
                  {!isVisited && (
                    <span className="text-[10px] font-mono text-[#8A0000] uppercase tracking-wider shrink-0">Go →</span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══ Badge Collection ═══ */}
        <section className="space-y-12">
          <SectionHeading>Badge Collection</SectionHeading>
          <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">
            Earn badges by engaging with the Artemis 2100 exhibit. Visit dimensions, open artifacts, read dispatches, and seal oaths to build your collection. Click any badge to mark it as earned (simulating your journey through the exhibit).
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {badges.map((badge) => {
              const isEarned = earnedBadges.has(badge.id);
              return (
                <button
                  key={badge.id}
                  onClick={() => toggleBadge(badge.id)}
                  className={`p-5 border-2 text-center transition-all duration-300 cursor-pointer ${
                    isEarned
                      ? 'border-[#8A0000] bg-[#8A0000]/5 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-400 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className={`text-3xl mb-2 transition-all ${isEarned ? 'text-[#8A0000]' : 'text-gray-300'}`}>
                    {badge.icon}
                  </div>
                  <p className={`text-xs font-bold uppercase tracking-wider ${isEarned ? 'text-gray-900' : 'text-gray-400'}`}>
                    {badge.name}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 leading-snug">{badge.desc}</p>
                  <div className={`mt-3 text-[9px] font-mono uppercase tracking-widest ${isEarned ? 'text-[#8A0000]' : 'text-gray-300'}`}>
                    {isEarned ? '✓ EARNED' : 'LOCKED'}
                  </div>
                </button>
              );
            })}
          </div>

          {allDimensionsVisited && (
            <div className="border-2 border-[#8A0000] bg-[#8A0000]/5 p-6 text-center">
              <p className="text-[#8A0000] font-bold text-sm uppercase tracking-wider">All Dimensions Explored!</p>
              <p className="text-xs text-gray-500 mt-1">You&apos;ve visited every provocation. The Rift is wide open.</p>
            </div>
          )}
        </section>

        {/* ═══ Try-Imagine-Act Cards ═══ */}
        <section className="space-y-12">
           <h2 className="text-3xl font-bold text-gray-900 border-b pb-2 w-fit italic">The Try-Imagine-Act Cards</h2>
           <p className="text-gray-600 max-w-2xl">Reach through the Rift and pull back tools for building the future. Each card deck guides you through a different phase of the design exercise — from exploration to imagination to action.</p>

           <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4 text-center">
                 <div className="bg-gray-100 aspect-[4/3] flex items-center justify-center p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-60" />
                    <div className="w-full h-full bg-white border border-gray-300 shadow-sm flex items-center justify-center text-4xl font-serif italic text-[#d92231] relative z-10">T</div>
                 </div>
                 <h3 className="font-bold text-xl text-gray-900 italic">Try</h3>
                 <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Reach Through the Rift</p>
                 <p className="text-xs text-gray-600">The Try cards invite you to step into the unknown. Each card presents a dimension from the Artemis 2100 exhibit — a fragment of a possible future pulled through the Rift. <strong>Reflection Worksheets</strong> encourage you to engage deeply: What would this future feel like? Who would it serve? What would it require?</p>
                 <button className="text-sm font-bold uppercase tracking-wider hover:text-red-600 transition-colors cursor-pointer">Download Try Cards &gt;</button>
              </div>
              <div className="space-y-4 text-center">
                 <div className="bg-gray-100 aspect-[4/3] flex items-center justify-center p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-60" />
                    <div className="w-full h-full bg-white border border-gray-300 shadow-sm flex items-center justify-center text-4xl font-serif italic text-[#461e68] relative z-10">I</div>
                 </div>
                 <h3 className="font-bold text-xl text-gray-900 italic">Imagine</h3>
                 <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Craft Your Vision</p>
                 <p className="text-xs text-gray-600">The Imagine cards are spark plugs for creativity. Each one contains a thought-provoking prompt designed to stretch your thinking beyond the boundaries of what education currently is. <strong>Inspiration Cards</strong> help you envision new paradigms: What if universities had no walls? What if learning had no end date? What if every skill was visible?</p>
                 <button className="text-sm font-bold uppercase tracking-wider hover:text-red-600 transition-colors cursor-pointer">Download Imagine Cards &gt;</button>
              </div>
              <div className="space-y-4 text-center">
                 <div className="bg-gray-100 aspect-[4/3] flex items-center justify-center p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent opacity-60" />
                    <div className="w-full h-full bg-white border border-gray-300 shadow-sm flex items-center justify-center text-4xl font-serif italic text-[#f2b90f] relative z-10">A</div>
                 </div>
                 <h3 className="font-bold text-xl text-gray-900 italic">Act</h3>
                 <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Build It Here</p>
                 <p className="text-xs text-gray-600">The Act cards turn vision into reality. Each card provides a concrete micro-action — an experiment you can run in your own context, whether a classroom, a community, or an institution. The <strong>Action Playbook</strong> guides you from prototype to implementation, with strategies for measuring impact and scaling what works.</p>
                 <button className="text-sm font-bold uppercase tracking-wider hover:text-red-600 transition-colors cursor-pointer">Download Playbook &gt;</button>
              </div>
           </div>
        </section>

        {/* ═══ How to Play ═══ */}
        <section className="space-y-12">
           <h2 className="text-3xl font-bold text-gray-900 border-b pb-2 w-fit italic">How to Play</h2>
           <div className="grid md:grid-cols-2 gap-12 text-sm text-gray-600 leading-relaxed">
              <div className="space-y-4">
                 <h4 className="font-bold italic uppercase tracking-wider text-sm text-gray-900">Step 1: Encounter the Rift</h4>
                 <p>Begin by exploring the dimensions on this site — the Infinite Learning Continuum, Adaptive Paced Learning, SkillPrints, and The Artemis Oath. Let them challenge your assumptions. As you read, note the moments that surprise, provoke, or inspire you. These are your signals from the other side.</p>
              </div>
              <div className="space-y-4">
                 <h4 className="font-bold italic uppercase tracking-wider text-sm text-gray-900">Step 2: Draw Your Cards</h4>
                 <p>Select one Try card, one Imagine card, and one Act card. Use the Try card to ground yourself in a specific dimension. Let the Imagine card push your thinking further. Then use the Act card to design a micro-experiment — something small enough to try this week, but bold enough to matter.</p>
              </div>
              <div className="space-y-4">
                 <h4 className="font-bold italic uppercase tracking-wider text-sm text-gray-900">Step 3: Run Your Experiment</h4>
                 <p>Execute your micro-action. Document what happens — the surprises, the failures, the unexpected connections. Share your findings with the Artemis community. Every experiment, no matter how small, contributes to a growing body of evidence that another future is not only possible, but already emerging.</p>
              </div>
              <div className="space-y-4">
                 <h4 className="font-bold italic uppercase tracking-wider text-sm text-gray-900">Step 4: Feed the Rift</h4>
                 <p>Your insights become new cards for others. The Rift is not a one-way portal — it&apos;s a living exchange between the future and the present. By sharing what you&apos;ve learned, you expand the deck, deepen the dialogue, and help others reach through the Rift with greater clarity and courage.</p>
              </div>
           </div>
        </section>

        {/* ═══ Certificates ═══ */}
        <section className="space-y-12">
          <SectionHeading>Certificates</SectionHeading>
          <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">
            As you explore the exhibit and earn badges, you qualify for certificates that testify to your journey. Each certificate is a record of your engagement with the future of education — and a challenge to carry what you&apos;ve learned into the present.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {certificateTypes.map((cert) => {
              const isQualified =
                (cert.title === 'Rift Navigator' && allDimensionsVisited) ||
                (cert.title === 'Future Architect' && earnedCount >= 4) ||
                (cert.title === 'Continuum Guardian' && earnedCount >= 8);

              return (
                <div key={cert.title} className={`border-2 p-6 space-y-4 transition-all ${
                  isQualified ? 'border-[#8A0000] bg-[#8A0000]/5' : 'border-gray-200 bg-white opacity-60'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 flex items-center justify-center text-lg ${
                      isQualified ? 'bg-[#8A0000] text-white' : 'bg-gray-200 text-gray-400'
                    } transition-colors`}>
                      {isQualified ? '★' : '?'}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{cert.title}</h4>
                      <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">{cert.condition}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{cert.desc}</p>

                  {isQualified ? (
                    <button
                      onClick={() => setShowCertificate(cert.title)}
                      className="w-full py-2 bg-[#8A0000] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#6A0000] transition-colors cursor-pointer"
                    >
                      View Certificate
                    </button>
                  ) : (
                    <div className="w-full py-2 bg-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider text-center">
                      Locked — {cert.condition}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══ Certificate Modal ═══ */}
        {showCertificate && (
          <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4" onClick={() => setShowCertificate(null)}>
            <div
              className="bg-[#faf8f5] border-2 border-[#8A0000] max-w-2xl w-full p-8 md:p-12 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowCertificate(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer text-xl"
              >
                ×
              </button>

              {/* Certificate content */}
              <div className="text-center space-y-6">
                {/* Seal */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 border-2 border-[#8A0000] rounded-full flex items-center justify-center">
                    <div className="w-14 h-14 border border-[#8A0000]/50 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold italic text-[#8A0000]">A</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#8A0000]/60">The University of Artemis</p>
                  <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-gray-400 mt-1">Office of the Continuum · Est. 2025</p>
                </div>

                <div className="border-t border-b border-[#8A0000]/20 py-6">
                  <p className="text-xs font-mono uppercase tracking-[0.2em] text-gray-500 mb-4">This Certifies That</p>
                  <p className="text-2xl md:text-3xl font-serif italic text-gray-900">
                    {visitorName || 'Anonymous Explorer'}
                  </p>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed max-w-lg mx-auto">
                  {certificateTypes.find(c => c.title === showCertificate)?.desc}
                </p>

                <div className="pt-4 border-t border-[#8A0000]/10">
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A0000]">{showCertificate}</p>
                  <p className="text-[9px] font-mono text-gray-400 mt-1">Issued: May 1, 2100 · Certificate ID: ART-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
