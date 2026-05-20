'use client';

import { useState, useEffect, useRef } from "react";
import { Play, X } from "lucide-react";
import { SectionHeading, HeroHeader, ExploreAnotherFuture, Timeline, HeadlinesFrom2100 } from "../Shared";
import type { TimelineEvent } from "../Shared";

interface Props {
  goTo: (page: string) => void;
}

/* ─── Learner Profiles for Neural Constellation ─── */
const learnerProfiles = [
  {
    name: "Amara Okafor",
    location: "Lagos, 2074",
    values: [92, 65, 88, 95, 72], // CT, TM, CI, CA, CS
    tagline: "Civic engineer and community financier",
    specializations: ["Data & Policy", "Urban Systems", "Community Finance"],
    evidence: [
      { title: "Designed floating school in Lagos", skills: "CI +12 · CA +8" },
      { title: "Deployed microfinance platform in Medellín", skills: "CF spec · TM +6" },
    ],
  },
  {
    name: "Kenji Tanaka",
    location: "Osaka, 2068",
    values: [71, 94, 60, 55, 89],
    tagline: "Computational artist and systems architect",
    specializations: ["Quantum Computing", "Generative Art", "Systems Design"],
    evidence: [
      { title: "Built quantum circuit visualizer for 12 research labs", skills: "TM +15 · CS +9" },
      { title: "Composed algorithmic symphony performed by Osaka Philharmonic", skills: "CS spec · CT +4" },
    ],
  },
  {
    name: "Elena Vasquez",
    location: "Bogotá, 2081",
    values: [78, 73, 82, 80, 85],
    tagline: "Transdisciplinary bridge-builder and civic innovator",
    specializations: ["Civic Innovation", "Andean Ecology", "Narrative Design"],
    evidence: [
      { title: "Mapped indigenous knowledge systems across 3 Andean communities", skills: "CI +10 · CA +7" },
      { title: "Designed participatory governance toolkit for 14 municipalities", skills: "CA spec · CS +5" },
    ],
  },
];

const axisLabels = [
  "Critical Thinking",
  "Technical Mastery",
  "Collaborative Impact",
  "Civic Adaptability",
  "Creative Synthesis",
];

/* ─── Constellation node positions (5 competency nodes in a circle) ─── */
const nodeBasePositions = [
  { x: 0, y: -130 },     // Critical Thinking (top)
  { x: 124, y: -40 },    // Technical Mastery (top-right)
  { x: 76, y: 105 },     // Collaborative Impact (bottom-right)
  { x: -76, y: 105 },    // Civic Adaptability (bottom-left)
  { x: -124, y: -40 },   // Creative Synthesis (top-left)
];

// Evidence particles orbit around each node
const evidenceParticles: { nodeIdx: number; angle: number; dist: number }[] = [
  { nodeIdx: 0, angle: 0.4, dist: 28 },
  { nodeIdx: 0, angle: 1.8, dist: 22 },
  { nodeIdx: 0, angle: 3.2, dist: 30 },
  { nodeIdx: 1, angle: 0.8, dist: 25 },
  { nodeIdx: 1, angle: 2.5, dist: 32 },
  { nodeIdx: 1, angle: 4.1, dist: 20 },
  { nodeIdx: 2, angle: 0.3, dist: 26 },
  { nodeIdx: 2, angle: 2.0, dist: 30 },
  { nodeIdx: 3, angle: 1.1, dist: 28 },
  { nodeIdx: 3, angle: 3.5, dist: 22 },
  { nodeIdx: 4, angle: 0.6, dist: 24 },
  { nodeIdx: 4, angle: 2.8, dist: 32 },
  { nodeIdx: 4, angle: 4.4, dist: 18 },
];

/* ─── Timeline data ─── */
const skillPrintTimeline: TimelineEvent[] = [
  { year: "2025", title: "The SkillPrint Concept", desc: "Artemis proposes replacing transcripts with living competency portraits" },
  { year: "2032", title: "Neural Mapping Breakthrough", desc: "Graphene-based sensors make real-time cognitive mapping possible" },
  { year: "2038", title: "First SkillPrints Issued", desc: "12 pilot universities issue SkillPrints alongside traditional diplomas" },
  { year: "2045", title: "The Transcript Abolished", desc: "Major employers announce they will no longer accept traditional transcripts" },
  { year: "2055", title: "Global SkillPrint Standard", desc: "ISO 2100-SK establishes universal SkillPrint format across 140 nations" },
  { year: "2070", title: "SkillPrint AI Integration", desc: "SkillPrints become predictive, mapping growth trajectories and learning recommendations" },
  { year: "2088", title: "The Universal Learner Profile", desc: "Every human on Earth receives a SkillPrint at birth, updated continuously through life" },
];

/* ─── Headlines data ─── */
const skillPrintHeadlines = [
  "Global SkillPrint Registry surpasses 4 billion active profiles",
  "Neural Skill Mapping detects previously unrecognized talent in 12% of assessed learners",
  "Last traditional university transcript issued in Northern Europe — era officially over",
  "SkillPrint-based hiring now mandatory in 89 countries; GPA references drop to zero",
  "Artemis learner's SkillPrint reveals cross-disciplinary genius missed by 3 traditional institutions",
];

/* ─── Specimen Cabinet Data ─── */
const specimenData = [
  {
    specimenNo: "SKP-4471",
    date: "2068.09.14",
    classification: "Civic Engineering",
    title: "Amara Okafor — Lagos Node",
    brief: "Floating infrastructure designer and community financier. First SkillPrint to achieve dual specializations in Urban Systems and Community Finance.",
    bars: [
      { label: "Critical Thinking", pct: 92 },
      { label: "Technical Mastery", pct: 65 },
      { label: "Collaborative Impact", pct: 88 },
      { label: "Civic Adaptability", pct: 95 },
      { label: "Creative Synthesis", pct: 72 },
    ],
    impact: "Designed floating school in Lagos · Deployed microfinance platform in Medellín",
    specializations: ["Data & Policy", "Urban Systems", "Community Finance"],
  },
  {
    specimenNo: "SKP-8934",
    date: "2074.03.22",
    classification: "Computational Art",
    title: "Kenji Tanaka — Osaka Node",
    brief: "Quantum circuit visualizer and algorithmic composer. Only SkillPrint with verified mastery in both quantum computing and generative art.",
    bars: [
      { label: "Critical Thinking", pct: 71 },
      { label: "Technical Mastery", pct: 94 },
      { label: "Collaborative Impact", pct: 60 },
      { label: "Civic Adaptability", pct: 55 },
      { label: "Creative Synthesis", pct: 89 },
    ],
    impact: "Built quantum circuit visualizer for 12 labs · Composed algorithmic symphony for Osaka Philharmonic",
    specializations: ["Quantum Computing", "Generative Art", "Systems Design"],
  },
  {
    specimenNo: "SKP-12671",
    date: "2081.11.07",
    classification: "Transdisciplinary Bridge",
    title: "Elena Vasquez — Bogotá Node",
    brief: "Indigenous knowledge cartographer and participatory governance architect. The most balanced SkillPrint in the 2081 cohort.",
    bars: [
      { label: "Critical Thinking", pct: 78 },
      { label: "Technical Mastery", pct: 73 },
      { label: "Collaborative Impact", pct: 82 },
      { label: "Civic Adaptability", pct: 80 },
      { label: "Creative Synthesis", pct: 85 },
    ],
    impact: "Mapped indigenous knowledge across 3 Andean communities · Designed governance toolkit for 14 municipalities",
    specializations: ["Civic Innovation", "Andean Ecology", "Narrative Design"],
  },
  {
    specimenNo: "SKP-00442",
    date: "2091.02.28",
    classification: "Polar Systems",
    title: "Ingrid Solberg — Svalbard Node",
    brief: "The last legacy SkillPrint issued before the Universal Learner Profile made individual specimens obsolete. A transitional artifact.",
    bars: [
      { label: "Critical Thinking", pct: 88 },
      { label: "Technical Mastery", pct: 76 },
      { label: "Collaborative Impact", pct: 90 },
      { label: "Civic Adaptability", pct: 94 },
      { label: "Creative Synthesis", pct: 68 },
    ],
    impact: "Polar governance framework adopted by 14 climate-vulnerable regions · Antarctic Treaty renewal architect",
    specializations: ["Polar Governance", "Climate Systems", "Memory Architecture"],
  },
];

function SpecimenCabinet() {
  const [openDrawer, setOpenDrawer] = useState<number | null>(null);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {specimenData.map((specimen, idx) => (
        <div
          key={specimen.specimenNo}
          className="border border-gray-300 bg-[#faf8f5] overflow-hidden transition-all duration-500"
        >
          {/* Drawer pull — crimson bar at top */}
          <div className="h-1.5 bg-[#8A0000]" />

          {/* Label plate */}
          <div className="px-5 pt-4 pb-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                Specimen No. {specimen.specimenNo}
              </span>
              <span className="text-[9px] text-gray-300">|</span>
              <span className="text-[9px] font-mono text-gray-400">{specimen.date}</span>
            </div>
            <span className="text-[8px] font-mono uppercase tracking-widest text-[#8A0000]/60 border border-[#8A0000]/20 px-2 py-0.5">
              {specimen.classification}
            </span>
          </div>

          {/* Collapsed view: title + brief */}
          <div className="px-5 pb-4">
            <h4 className="font-bold text-sm text-gray-900 mb-2">{specimen.title}</h4>
            <p className="text-xs text-gray-500 leading-relaxed">{specimen.brief}</p>

            {/* Open / close toggle */}
            <button
              onClick={() => setOpenDrawer(openDrawer === idx ? null : idx)}
              className="mt-3 text-[10px] font-mono uppercase tracking-widest text-[#8A0000] hover:text-[#6A0000] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {openDrawer === idx ? (
                <>
                  <X className="w-3 h-3" /> Close Drawer
                </>
              ) : (
                <>
                  <span className="inline-block w-4 h-0.5 bg-[#8A0000]" /> Pull Open
                </>
              )}
            </button>
          </div>

          {/* Expanded drawer content */}
          {openDrawer === idx && (
            <div className="border-t border-gray-200 bg-white px-5 py-5 space-y-5 animate-in fade-in duration-300">
              {/* Mini SkillPrint visualization — horizontal bars */}
              <div className="space-y-3">
                <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400 mb-2">Competency Map</p>
                {specimen.bars.map((bar) => (
                  <div key={bar.label} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-700 font-medium">{bar.label}</span>
                      <span className="font-bold text-[#8A0000]">{bar.pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#8A0000] rounded-full transition-all duration-500"
                        style={{ width: `${bar.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Verified Impact */}
              <div className="space-y-2">
                <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400">Verified Impact</p>
                {specimen.impact.split(" · ").map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[#8A0000] mt-0.5 shrink-0">&#9654;</span>
                    <p className="text-[11px] font-bold text-gray-800">{item}</p>
                  </div>
                ))}
              </div>

              {/* Specializations */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400">Specializations</p>
                <div className="flex flex-wrap gap-1.5">
                  {specimen.specializations.map((spec) => (
                    <span
                      key={spec}
                      className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider border border-[#8A0000]/30 text-[#8A0000] bg-[#8A0000]/5"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function AxisFlipPage({ goTo }: Props) {
  /* ─── Interactive Radar State ─── */
  const [activeProfile, setActiveProfile] = useState(0);
  const [displayValues, setDisplayValues] = useState<number[]>(learnerProfiles[0].values);
  const prevValuesRef = useRef<number[]>([...learnerProfiles[0].values]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const startValues = [...prevValuesRef.current];
    const targetValues = learnerProfiles[activeProfile].values;
    const duration = 600;
    const startTime = performance.now();

    cancelAnimationFrame(rafRef.current);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      // easeInOutQuad
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      const current = startValues.map((s, i) => s + (targetValues[i] - s) * eased);
      setDisplayValues(current);
      prevValuesRef.current = current;

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [activeProfile]);

  return (
    <>
      <HeroHeader
        title="SkillPrints"
        description="In 2100, we examine the era when Artemis replaced the traditional transcript with biometric, AI-powered SkillPrints — dynamic portraits of capability that evolve alongside the learner."
        bgGradientClass="bg-[#8A0000]"
        bgImage="https://images.pexels.com/photos/6147082/pexels-photo-6147082.jpeg?auto=compress&cs=tinysrgb&w=2000"
      />
      <div className="max-w-[1400px] mx-auto w-full px-5 sm:px-8 lg:px-20 py-16 lg:py-24 space-y-24">

        {/* ═══ The Summary ═══ */}
        <section className="space-y-6">
          <SectionHeading>The Summary</SectionHeading>
          <p className="text-sm text-gray-600">
            Step into a virtual time capsule to discover how Artemis transformed qualifications worldwide through SkillPrints — replacing static disciplinary silos and paper transcripts with a dynamic, biometric, AI-powered system for mapping human capability.
          </p>
          <div className="w-full aspect-video bg-gray-200 relative group cursor-pointer overflow-hidden max-w-4xl border border-gray-300">
            <img
              src="https://images.pexels.com/photos/6147082/pexels-photo-6147082.jpeg?auto=compress&cs=tinysrgb&w=2500"
              alt="Video Thumbnail"
              className="w-full h-full object-cover filter grayscale opacity-70 group-hover:opacity-90 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-black/60 rounded flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-black/80 transition-colors">
                 <Play className="w-8 h-8 ml-1" />
              </div>
            </div>
          </div>
        </section>

        {/* ═══ The SkillPrint — Neural Constellation (#5) ═══ */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>The SkillPrint</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>
          <p className="text-sm text-gray-600 max-w-2xl">A SkillPrint is not a transcript — it is a living neural portrait of capability. Where transcripts list courses, SkillPrints map competencies as constellations of demonstrated ability: each node a skill cluster, each particle a verified achievement, each connection a relationship between domains.</p>

          {/* Profile selector cards */}
          <div className="grid md:grid-cols-3 gap-4">
            {learnerProfiles.map((profile, i) => (
              <button
                key={i}
                onClick={() => setActiveProfile(i)}
                className={`text-left p-5 border-2 cursor-pointer transition-all duration-500 ${
                  activeProfile === i
                    ? "border-[#8A0000] bg-[#8A0000]/5 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 flex items-center justify-center text-xs font-bold italic ${
                    activeProfile === i ? "bg-[#8A0000] text-white" : "bg-gray-200 text-gray-500"
                  } transition-colors duration-300`}>
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className={`text-sm font-bold transition-colors duration-300 ${activeProfile === i ? "text-[#8A0000]" : "text-gray-900"}`}>
                      {profile.name}
                    </div>
                    <div className="text-[10px] font-mono text-gray-400">{profile.location}</div>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 italic leading-snug">{profile.tagline}</p>
                {activeProfile === i && (
                  <div className="mt-3 pt-3 border-t border-[#8A0000]/20 flex flex-wrap gap-1.5">
                    {profile.specializations.map((spec) => (
                      <span key={spec} className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border border-[#8A0000]/30 text-[#8A0000] bg-[#8A0000]/5">
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Neural Constellation visualization */}
          <div className="w-full max-w-3xl mx-auto border border-gray-200 bg-gray-50/50 p-4">
            <svg viewBox="0 0 500 400" className="w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                {/* Glow filter for active nodes */}
                <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {/* Subtle pulse animation */}
                <radialGradient id="centerGrad">
                  <stop offset="0%" stopColor="#8A0000" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#8A0000" stopOpacity="0.2" />
                </radialGradient>
              </defs>

              <g transform="translate(250,190)">
                {/* Subtle background rings */}
                <circle cx="0" cy="0" r="140" fill="none" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4,6" />
                <circle cx="0" cy="0" r="95" fill="none" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4,6" />
                <circle cx="0" cy="0" r="50" fill="none" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4,6" />

                {/* Cross-connections between competency nodes (dashed) */}
                {displayValues.map((_, i) => {
                  const next = (i + 2) % 5;
                  const from = nodeBasePositions[i];
                  const to = nodeBasePositions[next];
                  return (
                    <line
                      key={`cross-${i}`}
                      x1={from.x} y1={from.y}
                      x2={to.x} y2={to.y}
                      stroke="#8A0000"
                      strokeWidth="0.5"
                      strokeDasharray="3,5"
                      opacity="0.12"
                    />
                  );
                })}

                {/* Connection lines from center to each node */}
                {displayValues.map((v, i) => {
                  const pct = v / 100;
                  const nodePos = { x: nodeBasePositions[i].x * pct, y: nodeBasePositions[i].y * pct };
                  return (
                    <line
                      key={`line-${i}`}
                      x1="0" y1="0"
                      x2={nodePos.x} y2={nodePos.y}
                      stroke="#8A0000"
                      strokeWidth="1.5"
                      opacity={0.15 + (pct * 0.35)}
                    />
                  );
                })}

                {/* Connection lines between adjacent nodes */}
                {displayValues.map((v, i) => {
                  const next = (i + 1) % 5;
                  const pct1 = v / 100;
                  const pct2 = displayValues[next] / 100;
                  const from = { x: nodeBasePositions[i].x * pct1, y: nodeBasePositions[i].y * pct1 };
                  const to = { x: nodeBasePositions[next].x * pct2, y: nodeBasePositions[next].y * pct2 };
                  return (
                    <line
                      key={`adj-${i}`}
                      x1={from.x} y1={from.y}
                      x2={to.x} y2={to.y}
                      stroke="#8A0000"
                      strokeWidth="1"
                      opacity="0.15"
                    />
                  );
                })}

                {/* Evidence particles orbiting each node */}
                {evidenceParticles.map((p, idx) => {
                  const pct = displayValues[p.nodeIdx] / 100;
                  const nodeX = nodeBasePositions[p.nodeIdx].x * pct;
                  const nodeY = nodeBasePositions[p.nodeIdx].y * pct;
                  const px = nodeX + Math.cos(p.angle) * p.dist * pct;
                  const py = nodeY + Math.sin(p.angle) * p.dist * pct;
                  return (
                    <circle
                      key={`particle-${idx}`}
                      cx={px} cy={py}
                      r={1.5 + pct}
                      fill="#8A0000"
                      opacity={0.15 + pct * 0.25}
                    />
                  );
                })}

                {/* Competency nodes — size and distance based on proficiency */}
                {displayValues.map((v, i) => {
                  const pct = v / 100;
                  const nx = nodeBasePositions[i].x * pct;
                  const ny = nodeBasePositions[i].y * pct;
                  const nodeRadius = 6 + pct * 14;
                  return (
                    <g key={`node-${i}`}>
                      {/* Outer glow ring */}
                      <circle
                        cx={nx} cy={ny}
                        r={nodeRadius + 6}
                        fill="#8A0000"
                        opacity={0.04 + pct * 0.06}
                      />
                      {/* Node body */}
                      <circle
                        cx={nx} cy={ny}
                        r={nodeRadius}
                        fill="white"
                        stroke="#8A0000"
                        strokeWidth="2"
                        filter="url(#nodeGlow)"
                      />
                      {/* Percentage inside node */}
                      <text
                        x={nx} y={ny + 1}
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{fontSize: `${8 + pct * 4}px`, fontWeight: 'bold', fill: '#8A0000'}}
                      >
                        {Math.round(v)}
                      </text>
                    </g>
                  );
                })}

                {/* Center node — the learner */}
                <circle cx="0" cy="0" r="16" fill="url(#centerGrad)" />
                <circle cx="0" cy="0" r="10" fill="#8A0000" />
                <text x="0" y="1" textAnchor="middle" dominantBaseline="central" style={{fontSize:'7px', fontWeight:'bold', fill:'white', letterSpacing:'0.05em'}}>YOU</text>
              </g>

              {/* Axis labels — positioned outside the constellation */}
              <text x="250" y="32" textAnchor="middle" style={{fontSize:'10px', fontWeight:'bold', letterSpacing:'0.08em'}} className="fill-gray-700">CRITICAL THINKING</text>
              <text x="440" y="158" textAnchor="start" style={{fontSize:'10px', fontWeight:'bold', letterSpacing:'0.08em'}} className="fill-gray-700">TECHNICAL MASTERY</text>
              <text x="378" y="340" textAnchor="start" style={{fontSize:'10px', fontWeight:'bold', letterSpacing:'0.08em'}} className="fill-gray-700">COLLABORATIVE IMPACT</text>
              <text x="122" y="340" textAnchor="end" style={{fontSize:'10px', fontWeight:'bold', letterSpacing:'0.08em'}} className="fill-gray-700">CIVIC ADAPTABILITY</text>
              <text x="60" y="158" textAnchor="end" style={{fontSize:'10px', fontWeight:'bold', letterSpacing:'0.08em'}} className="fill-gray-700">CREATIVE SYNTHESIS</text>

              {/* Footer label */}
              <text x="250" y="392" textAnchor="middle" style={{fontSize:'9px', letterSpacing:'0.15em'}} className="fill-gray-400 font-mono uppercase">
                Neural Constellation · {learnerProfiles[activeProfile].name.toUpperCase()} · {learnerProfiles[activeProfile].location.toUpperCase()}
              </text>
            </svg>
          </div>

          {/* Competency bars + profile details */}
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Left: Animated competency bars */}
            <div className="space-y-4">
              <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400 mb-2">Competency Map</p>
              {displayValues.map((v, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-gray-700 font-medium">{axisLabels[i]}</span>
                    <span className="font-bold text-[#8A0000]">{Math.round(v)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#8A0000] rounded-full transition-all duration-500"
                      style={{ width: `${Math.round(v)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Verified evidence for active profile */}
            <div className="space-y-4">
              <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400 mb-2">Verified Impact</p>
              {learnerProfiles[activeProfile].evidence.map((ev, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[#8A0000] mt-1 shrink-0 text-xs">&#9654;</span>
                  <div>
                    <p className="text-[11px] font-bold text-gray-800">{ev.title}</p>
                    <p className="text-[9px] text-gray-400 font-mono">{ev.skills}</p>
                  </div>
                </div>
              ))}

              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400">Specializations</p>
                <div className="flex flex-wrap gap-1.5">
                  {learnerProfiles[activeProfile].specializations.map((spec) => (
                    <span key={spec} className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider border border-[#8A0000]/30 text-[#8A0000] bg-[#8A0000]/5">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Historical Notes ═══ */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>Historical Notes</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h4 className="font-bold italic uppercase tracking-wider text-sm">The Setting</h4>
              <p className="font-bold italic text-sm text-gray-800 leading-relaxed">
                Memorize, test, forget, repeat: this was the typical experience of students worldwide at the dawn of the 21st century. The global economy was evolving at an unprecedented pace, with emerging technologies and shifting job markets creating a skills gap that traditional education struggled to bridge.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Students were increasingly finding their degrees obsolete before they even entered the workforce. Education systems varied wildly across countries, creating uneven opportunities and hindering global collaboration. The world needed a unified approach that could adapt to rapid change while celebrating cultural diversity.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold italic uppercase tracking-wider text-sm">From Transcript to SkillPrint</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                The traditional academic transcript — a static list of courses and grades — was a 19th-century invention that persisted well into the 21st. It told employers almost nothing about what a graduate could actually do. SkillPrints replaced this relic: a dynamic, evolving record of a learner&apos;s abilities, experiences, and potential, powered by neural mapping and AI analysis.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Where transcripts captured what you studied, SkillPrints captured what you could do — and what you were capable of becoming. They emphasized skills over grades, competencies over credit hours, and growth over static achievement.
              </p>
            </div>
          </div>
        </section>

        {/* ═══ Neural Skill Mapping ═══ */}
        <section className="space-y-12">
          <SectionHeading>Neural Skill Mapping</SectionHeading>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-sm text-gray-600 leading-relaxed space-y-4">
              <p>
                The backbone of SkillPrints was Neural Skill Mapping — a revolutionary system that used advanced brain-computer interfaces to create a real-time map of a learner&apos;s neural pathways. Students wore non-invasive, graphene-based sensors that monitored brain activity during learning and problem-solving tasks.
              </p>
              <p>
                The data was processed by quantum computers, creating a dynamic, three-dimensional representation of the student&apos;s evolving skill set — a living portrait of capability that grew and shifted with every new experience. This allowed educators and AI mentors to provide precisely targeted interventions, helping students strengthen weak areas and leverage their natural aptitudes more effectively.
              </p>
              <p>
                Neural Skill Mapping provided a highly visual and futuristic way to think about qualifications. No longer were students reduced to a GPA or a degree title. Their entire cognitive landscape — strengths, connections, growth edges, and untapped potential — was rendered visible and actionable.
              </p>
            </div>
            <div>
               <img src="https://images.pexels.com/photos/8294554/pexels-photo-8294554.jpeg?auto=compress&cs=tinysrgb&w=800" className="w-full h-full object-cover" alt="Neural Skill Mapping Visualization" />
            </div>
          </div>
        </section>

        {/* ═══ The Matrix Dimensions ═══ */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>The Matrix Dimensions</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 pt-8">
            <div className="space-y-4">
              <h4 className="font-bold italic uppercase tracking-wider text-sm text-gray-900">Core Competencies (6-12 months)</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Students began by developing a strong foundation in universal skills — critical thinking, digital literacy, and cross-cultural communication. This phase used advanced AI tutors and virtual reality simulations to provide personalized, immersive learning experiences. Learners engaged in global micro-projects, collaborating with peers from different continents to solve real-world challenges.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                This approach not only built core skills but fostered a sense of global citizenship from the outset. By working alongside teammates from diverse backgrounds, students developed the empathy, adaptability, and communication abilities that would serve as the bedrock of their entire journey.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold italic uppercase tracking-wider text-sm text-gray-900">Specialization Pathways (12-24 months)</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Based on their interests, aptitudes, and global demand, students chose multiple specialization pathways — not traditional majors, but flexible routes through the Skills Matrix that combined knowledge areas in unique ways. A student might blend environmental science, blockchain technology, and indigenous wisdom to create innovative solutions for climate change.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                The AI-driven system continuously suggested new connections and learning opportunities based on the student&apos;s progress and emerging global trends. No two students followed the same trajectory, yet all emerged with complementary skill sets that could interlock in powerful ways.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 pt-8">
            <div className="space-y-4">
              <h4 className="font-bold italic uppercase tracking-wider text-sm text-gray-900">Global Implementation (12-18 months)</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Students applied their unique skill combinations to real-world projects across the globe. Using Artemis&apos;s network of partner organizations, they engaged in international internships, research projects, and entrepreneurial ventures. Advanced augmented reality tools ensured solutions were culturally appropriate and truly impactful.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Projects ranged from designing sustainable water systems in sub-Saharan Africa to developing AI-driven healthcare diagnostics in Southeast Asia, each leaving a tangible mark on the world while shaping the student into a versatile, globally-minded professional.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold italic uppercase tracking-wider text-sm text-gray-900">The SkillPrint</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                The SkillPrint replaced traditional academic transcripts as a dynamic, evolving record of a student&apos;s abilities, experiences, and potential. Unlike static transcripts, SkillPrints captured academic achievements, co-curricular activities, work experiences, personal projects, and micro-credentials — all mapped through neural analysis and verified through AI-driven competency assessment.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Powered by sophisticated algorithms, SkillPrints emphasized skills over grades, highlighting competencies such as critical thinking, creativity, collaboration, and leadership. They grew and evolved alongside the learner, providing a living portrait of capabilities that employers, collaborators, and institutions could access and interpret in real-time.
              </p>
            </div>
          </div>
        </section>

        {/* ═══ Transcript vs SkillPrint (#6) ═══ */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>Transcript vs SkillPrint</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* LEFT — The Old Model */}
            <div className="bg-gray-100 border border-gray-300 p-6 space-y-5">
              <div className="text-center border-b border-gray-300 pb-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">Office of the Registrar</p>
                <h4 className="font-mono text-base font-bold text-gray-700">State University — Official Transcript</h4>
                <p className="text-[9px] font-mono text-gray-400 mt-1">Document ID: SU-2025-04781 · Issued: May 15, 2025</p>
              </div>

              <div className="space-y-1 text-xs font-mono text-gray-600">
                <p><span className="text-gray-400">Name:</span> Doe, Jane M.</p>
                <p><span className="text-gray-400">Student ID:</span> 4781-2930</p>
                <p><span className="text-gray-400">Program:</span> B.A. Economics</p>
                <p><span className="text-gray-400">Cumulative GPA:</span> <span className="font-bold text-gray-800">3.47</span></p>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <p className="text-[9px] font-mono uppercase tracking-wider text-gray-400 mb-2">Course History</p>
                <div className="space-y-1.5 text-[11px] font-mono">
                  <div className="flex justify-between text-gray-600">
                    <span>Intro to Economics</span><span className="text-gray-800">B+</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Statistics 101</span><span className="text-gray-800">A-</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Microeconomics</span><span className="text-gray-800">B</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Macroeconomics</span><span className="text-gray-800">B+</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Calculus I</span><span className="text-gray-800">C+</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Political Science</span><span className="text-gray-800">B-</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Accounting Principles</span><span className="text-gray-800">B</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Senior Seminar</span><span className="text-gray-800">A-</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <p className="text-[11px] font-mono text-gray-500">
                  <span className="text-gray-400">Degree Conferred:</span> B.A. Economics, 2025
                </p>
                <p className="text-[9px] font-mono text-gray-400 mt-2">This document is official only if bearing the seal of State University.</p>
              </div>

              <div className="text-center pt-2">
                <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400">The Old Model</p>
              </div>
            </div>

            {/* RIGHT — The New Model */}
            <div className="bg-white border-2 border-[#8A0000]/20 p-6 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#8A0000]/15 pb-4">
                <div>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-[#8A0000]/60">Artemis SkillPrint</p>
                  <h4 className="text-base font-bold text-gray-900">Jane Doe</h4>
                </div>
                <div className="w-10 h-10 border-2 border-[#8A0000] flex items-center justify-center">
                  <span className="text-[10px] font-bold italic text-[#8A0000]">A</span>
                </div>
              </div>

              {/* Mini radar + percentage bars */}
              <div className="space-y-3">
                <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400">Competency Map</p>
                {[
                  { label: "Critical Thinking", pct: 88 },
                  { label: "Technical Mastery", pct: 62 },
                  { label: "Collaborative Impact", pct: 79 },
                  { label: "Civic Adaptability", pct: 91 },
                  { label: "Creative Synthesis", pct: 74 },
                ].map((c) => (
                  <div key={c.label} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-700 font-medium">{c.label}</span>
                      <span className="font-bold text-[#8A0000]">{c.pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#8A0000] rounded-full"
                        style={{ width: `${c.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Specialization Badges */}
              <div className="space-y-2">
                <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400">Specializations</p>
                <div className="flex flex-wrap gap-2">
                  {["Data & Policy", "Urban Systems", "Community Finance"].map((badge) => (
                    <span
                      key={badge}
                      className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider border border-[#8A0000]/30 text-[#8A0000] bg-[#8A0000]/5"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Impact Records */}
              <div className="space-y-2">
                <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400">Verified Impact</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-[#8A0000] mt-0.5 shrink-0">&#9654;</span>
                    <div>
                      <p className="text-[11px] font-bold text-gray-800">Designed floating school in Lagos</p>
                      <p className="text-[9px] text-gray-400">Verified · Collaborative Impact +12 · Civic Adaptability +8</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#8A0000] mt-0.5 shrink-0">&#9654;</span>
                    <div>
                      <p className="text-[11px] font-bold text-gray-800">Deployed microfinance platform in Medellín</p>
                      <p className="text-[9px] text-gray-400">Verified · Community Finance spec · Technical Mastery +6</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2 border-t border-[#8A0000]/10">
                <p className="text-[9px] font-mono uppercase tracking-widest text-[#8A0000]/60">The New Model</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 italic text-center max-w-2xl mx-auto">
            One person. Two records. The transcript reduced Jane Doe to a 3.47 and eight letter grades. The SkillPrint revealed a civic engineer, a community financier, a cross-disciplinary thinker the old system never thought to look for.
          </p>
        </section>

        {/* ═══ The Achievement ═══ */}
        <section className="space-y-8">
          <SectionHeading>The Achievement</SectionHeading>
          <div className="space-y-6 text-gray-600 leading-relaxed text-sm md:text-base">
            <p>SkillPrints did not merely update the transcript — they redefined what it meant to be qualified, replacing static records of coursework with living portraits of capability.</p>
          </div>
          <ul className="space-y-4 text-gray-700 text-sm md:text-base">
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">Rigid disciplines dissolved (2038–2055):</strong> Artemis replaced fixed majors with a flexible, AI-powered system that adapted to global needs in real-time. By 2050, the very concept of a &ldquo;major&rdquo; had become archaic — a relic of the industrial sorting mindset that had outlived its usefulness by at least half a century.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">Qualifications became visual (2040–2065):</strong> Neural Skill Mapping made competencies dynamic, deeply personal, and instantly communicable. Employers stopped asking for transcripts and started requesting SkillPrint access — a shift that eliminated the information asymmetry that had plagued hiring for generations.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">Unique skill portfolios (2042–2070):</strong> Students graduated with a portfolio of transferable skills rather than a traditional degree — no two SkillPrints alike. This diversity of capability became one of Artemis&apos;s most celebrated outcomes: a community where every member brought a genuinely irreplaceable combination of strengths.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">Education-employment gap eliminated (2035–2055):</strong> Learning became directly tied to evolving global challenges, making graduation synonymous with readiness. The phrase &ldquo;entry-level job requiring three years of experience&rdquo; — once a cruel paradox — became unimaginable when every graduate carried a verified, evolving record of demonstrable capability.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">Cultural intelligence at the core (2045–2075):</strong> Adaptability and cross-cultural competence became essential components of every educational journey. By 2070, SkillPrints included a &ldquo;Cultural Fluency&rdquo; dimension that employers ranked above technical mastery — a reversal that would have stunned the hiring managers of the 2020s.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">Transcripts replaced (2050–2080):</strong> Dynamic, biometric, evolving SkillPrints became the new global standard for recording each learner&apos;s journey. By 2080, the last university still issuing paper transcripts was profiled in an academic journal as a &ldquo;living museum&rdquo; — a cautionary tale about institutional inertia.</span>
            </li>
          </ul>
          <div className="mt-8">
            <blockquote className="border-l-4 border-[#8A0000] pl-6 space-y-4">
              <p className="font-serif italic text-2xl text-gray-800 leading-snug">
                &ldquo;My transcript said I took Economics 301. My SkillPrint said I could restructure a failing municipal budget while navigating three stakeholder languages. Which would you hire?&rdquo;
              </p>
              <footer className="text-sm text-gray-500 font-bold uppercase tracking-widest">
                &mdash; Catalyst, Class of 2084
              </footer>
            </blockquote>
          </div>
        </section>

        {/* ═══ Timeline (#7) ═══ */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>The SkillPrint Timeline</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>
          <p className="text-sm text-gray-600 max-w-2xl">
            From radical proposal to universal standard — the eight-decade journey that consigned the academic transcript to history and gave every learner a living portrait of capability.
          </p>
          <Timeline events={skillPrintTimeline} />
        </section>

        {/* ═══ Dispatches from 2100 (#16) ═══ */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>Dispatches from 2100</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>
          <p className="text-sm text-gray-600 max-w-2xl">
            Intercepted transmissions from the global SkillPrint network — proof that the future of qualification is not a document, but a dialogue.
          </p>
          <HeadlinesFrom2100 headlines={skillPrintHeadlines} />
        </section>

        {/* ═══ Exhibit Article Archive ═══ */}
        <section className="space-y-24">
          <div>
            <hr className="border-t border-gray-200 mb-12" />
            <SectionHeading>Exhibit Article Archive</SectionHeading>
            <p className="text-sm text-gray-600 mt-4">Browse below to search through video archives of the exhibits displayed on May 1st, 2100.</p>
          </div>

          <div className="space-y-24">
            <div className="space-y-12">
              <h3 className="text-center font-bold text-xl uppercase tracking-widest text-gray-900">Article 42</h3>
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h4 className="font-bold italic uppercase tracking-wider text-sm">Neural Skill Mapping: The Technology</h4>
                  <p className="italic text-xs text-gray-500">Holographic interface, quantum computing core, bio-neural feedback sensors</p>
                  <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                    <p>Neural Skill Mapping was the backbone of SkillPrints. This revolutionary system used advanced brain-computer interfaces to create a real-time map of a learner&apos;s neural pathways, identifying strengths, potential connections, and areas for growth. Students wore non-invasive, graphene-based sensors that monitored brain activity during learning and problem-solving tasks.</p>
                    <p>The data was processed by quantum computers, creating a dynamic, three-dimensional representation of the student&apos;s evolving skill set. This allowed educators and AI mentors to provide precisely targeted interventions, helping students strengthen weak areas and leverage their natural aptitudes more effectively.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="aspect-video bg-gray-900 flex items-center justify-center relative group cursor-pointer text-white">
                    <span className="text-sm">Video unavailable<br/><span className="text-xs text-gray-400">This video is private</span></span>
                  </div>
                  <p className="text-xs text-gray-500 italic">Watch the Neural Skill Mapping demonstration.</p>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <h3 className="text-center font-bold text-xl uppercase tracking-widest text-gray-900">Article 78</h3>
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h4 className="font-bold italic uppercase tracking-wider text-sm">Global Challenge Simulator</h4>
                  <p className="italic text-xs text-gray-500">Immersive holodeck, swarm intelligence algorithms, haptic feedback suits</p>
                  <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                    <p>The Global Challenge Simulator was a cornerstone of the Core Competencies phase. This advanced facility allowed students to tackle complex, multifaceted global issues in a safe, simulated environment. Using holographic technology, haptic feedback, and swarm intelligence algorithms, the simulator created realistic scenarios that adapted in real-time to students&apos; decisions.</p>
                    <p>Scenarios ranged from pandemic response coordination to climate adaptation planning, giving students a depth of experiential learning that would have been impossible in the physical world alone. The system&apos;s AI moderator ensured balanced teams and meaningful participation for every student.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="aspect-video bg-gray-900 flex items-center justify-center relative group cursor-pointer text-white">
                    <span className="text-sm">Video unavailable<br/><span className="text-xs text-gray-400">This video is private</span></span>
                  </div>
                  <p className="text-xs text-gray-500 italic">Watch the Global Challenge Simulator in action.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Specimen Cabinet ═══ */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>Specimen Cabinet</SectionHeading>
            <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">Open each drawer to examine a SkillPrint specimen — a living portrait of capability captured at a moment in time.</p>
            <hr className="border-t border-gray-200" />
          </div>

          <SpecimenCabinet />
        </section>

      </div>
      <ExploreAnotherFuture currentPage="global-skills-matrix" goTo={goTo} />
    </>
  );
}
