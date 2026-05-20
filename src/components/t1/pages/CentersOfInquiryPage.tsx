'use client';

import { useState } from "react";
import { Play } from "lucide-react";
import { SectionHeading, HeroHeader, ExploreAnotherFuture, Timeline, HeadlinesFrom2100 } from "../Shared";
import type { TimelineEvent } from "../Shared";

/* ─── Real Center Data (from Artemis University) ─── */
const centers = [
  { num: '01', name: 'Frontiers of Artemis Research', desc: 'The coordinating hub defining Artemis\'s research identity, seeding bold interdisciplinary inquiries.', nodes: 'Valletta — Tokyo — San Francisco', investigators: 10, fellows: 40 },
  { num: '02', name: 'Civilization Architecture', desc: 'Designing governance systems, legal frameworks, and social contracts for resilient civilizations.', nodes: 'Geneva — Singapore — Accra', investigators: 12, fellows: 44 },
  { num: '03', name: 'Planetary Systems', desc: 'Understanding Earth as an integrated system — and extending that understanding to other worlds.', nodes: 'Reykjavik — Sydney — São Paulo', investigators: 11, fellows: 42 },
  { num: '04', name: 'Space & Frontier Science', desc: 'Pushing human presence beyond Earth — orbital habitats, deep-space propulsion, cosmic expansion ethics.', nodes: 'Houston — Darmstadt — Tanegashima', investigators: 13, fellows: 48 },
  { num: '05', name: 'Emerging Technologies', desc: 'Tracking and shaping quantum computing, synthetic biology, neurotechnology, and their convergence.', nodes: 'Zurich — Seoul — Boston', investigators: 14, fellows: 50 },
  { num: '06', name: 'Next-Gen Education', desc: 'Reimagining learning with AI tutors, immersive environments, and lifelong learning continua.', nodes: 'Helsinki — Melbourne — Nairobi', investigators: 9, fellows: 36 },
  { num: '07', name: 'Materials, Matter & Manufacturing Futures', desc: 'Metamaterials, programmable matter, additive manufacturing at scale.', nodes: 'Munich — Shenzhen — Detroit', investigators: 11, fellows: 38 },
  { num: '08', name: 'Agriculture, Food Systems', desc: 'Precision agriculture, cellular agriculture, closed-loop food ecosystems.', nodes: 'Wageningen — Hyderabad — Davis', investigators: 10, fellows: 40 },
  { num: '09', name: 'Robotics, Mechatronics & Physical Autonomy', desc: 'From surgical micro-robots to autonomous construction crews and swarm logistics.', nodes: 'Tokyo — Zurich — Pittsburgh', investigators: 13, fellows: 46 },
  { num: '10', name: 'Gaming & Worldbuilding', desc: 'Play, simulation, and narrative worldbuilding as research and civic imagination tools.', nodes: 'Montreal — Kyoto — Stockholm', investigators: 8, fellows: 32 },
  { num: '11', name: 'Energy Systems', desc: 'Post-carbon energy infrastructure: fusion, orbital solar, microgrids, energy sovereignty.', nodes: 'Copenhagen — Abu Dhabi — Santiago', investigators: 12, fellows: 44 },
  { num: '12', name: 'Health & Bioethics', desc: 'Advancing health while examining moral dimensions of biomedical innovation.', nodes: 'Boston — Cape Town — Hyderabad', investigators: 14, fellows: 52 },
  { num: '13', name: 'Urban Futures', desc: 'Designing resilient, equitable, adaptive cities.', nodes: 'Copenhagen — Medellín — Singapore', investigators: 10, fellows: 38 },
  { num: '14', name: 'Biotech & Life Sciences', desc: 'Gene editing, synthetic organisms, ecosystem engineering, de-extinction.', nodes: 'Cambridge — Basel — Guangzhou', investigators: 15, fellows: 54 },
  { num: '15', name: 'Fintech, DeFi & Economics', desc: 'Rethinking money, markets, and economic governance for a decentralized world.', nodes: 'London — Singapore — Lagos', investigators: 11, fellows: 42 },
];

const pillars = [
  { title: 'Unified Knowledge', desc: 'Centers replace departments — knowledge as a cohesive whole, fostering a "philosophical habit of mind." When a biologist, a philosopher, and a computer scientist share a research agenda, the questions they ask become fundamentally different — and so do the answers they discover.' },
  { title: 'Junior Fellows', desc: 'Students join as full participants — not peripheral interns. Every capstone must align with a Center mission, evaluated against dual criteria: epistemic contribution and civic impact. Centers function as research institutes, think tanks, and innovation incubators simultaneously.' },
  { title: 'Core Investigators', desc: 'Long-term, renewable appointments free investigators from grant cycles. Intellectual risk-taking replaces short-term, outcome-predictable projects. Investigators anchor epistemic rigour, mentoring junior fellows and shaping research agendas that span years.' },
  { title: 'Translational Programs', desc: 'Bridge research → application: IP licensing, funding, entrepreneurial mentorship, ethical oversight. Every translational project is reviewed for social implications, ensuring application never compromises equity, sustainability, and human dignity.' },
  { title: 'Technology Centers', desc: 'The technological backbone — centralized innovation hub providing cutting-edge resources. Bio-fabrication labs, quantum computing cleanrooms, computational modelling infrastructure. Breakthrough tools developed for one domain are rapidly available across the entire network.' },
];

const guildLayers = [
  { layer: 'Inquiry', desc: 'Transdisciplinary research advancing foundational questions', icon: '◆' },
  { layer: 'Capstone Catalysts', desc: 'Student projects embedded in live Guild missions', icon: '◇' },
  { layer: 'Deployment Interfaces', desc: 'Field-testing tools in civic, planetary, industry settings', icon: '▲' },
  { layer: 'Commons Nodes', desc: 'Open-access outputs with modular remix licenses', icon: '○' },
  { layer: 'Challenge Engines', desc: 'Seasonal sprints (2-6 weeks) and residencies', icon: '△' },
];

/* ─── Node Network Map Data ─── */
const nodeLocations = [
  { city: "Accra", x: 485, y: 225, center: "Civilization Architecture", focus: "Governance & Social Contracts" },
  { city: "Nairobi", x: 555, y: 265, center: "Next-Gen Education", focus: "AI Tutors & Lifelong Learning" },
  { city: "Lagos", x: 488, y: 235, center: "Fintech, DeFi & Economics", focus: "Decentralized Economic Governance" },
  { city: "Johannesburg", x: 510, y: 330, center: "Health & Bioethics", focus: "Biomedical Innovation Ethics" },
  { city: "Cairo", x: 535, y: 170, center: "Space & Frontier Science", focus: "Deep-Space Propulsion Ethics" },
  { city: "Berlin", x: 495, y: 100, center: "Materials & Manufacturing", focus: "Programmable Matter" },
  { city: "London", x: 475, y: 95, center: "Fintech, DeFi & Economics", focus: "Decentralized Markets" },
  { city: "Athens", x: 520, y: 135, center: "Urban Futures", focus: "Resilient City Design" },
  { city: "Stockholm", x: 495, y: 70, center: "Gaming & Worldbuilding", focus: "Simulation & Civic Imagination" },
  { city: "São Paulo", x: 320, y: 310, center: "Planetary Systems", focus: "Earth Systems Understanding" },
  { city: "Bogotá", x: 280, y: 240, center: "Urban Futures", focus: "Equitable Adaptive Cities" },
  { city: "Santiago", x: 290, y: 360, center: "Energy Systems", focus: "Post-Carbon Infrastructure" },
  { city: "Mumbai", x: 630, y: 205, center: "Agriculture & Food Systems", focus: "Closed-Loop Food Ecosystems" },
  { city: "Kochi", x: 630, y: 225, center: "Health & Bioethics", focus: "Rural Healthcare Access" },
  { city: "Seoul", x: 755, y: 140, center: "Emerging Technologies", focus: "Quantum & Synthetic Biology" },
  { city: "Osaka", x: 775, y: 155, center: "Robotics & Mechatronics", focus: "Autonomous Systems" },
  { city: "Suva", x: 820, y: 310, center: "Planetary Systems", focus: "Climate & Ocean Systems" },
  { city: "Jakarta", x: 720, y: 270, center: "Agriculture & Food Systems", focus: "Tropical Agriculture" },
];

/* ─── Timeline Events ─── */
const timelineEvents: TimelineEvent[] = [
  {year: "2025", title: "Centers Proposed", desc: "15 disciplinary centers proposed as replacement for traditional departments"},
  {year: "2030", title: "First Centers Open", desc: "Centers for Bioethics, Climate Systems, and Computational Thought begin operations"},
  {year: "2038", title: "Pillar System Adopted", desc: "The 5 pillars (Inquiry, Craft, Bridge, Forge, Loom) formalized as organizational logic"},
  {year: "2045", title: "Guild Layers Introduced", desc: "Five mastery layers replace faculty ranks and student years"},
  {year: "2055", title: "45 Nodes Active", desc: "The global node network spans 45 locations across 6 continents"},
  {year: "2070", title: "Cycle System Refined", desc: "Residency-Sprint-Deployment becomes the universal operating rhythm"},
];

/* ─── Headlines from 2100 ─── */
const headlines = [
  "Center for Climate Systems deploys atmospheric carbon capture prototype from Santiago node",
  "Guild Layer promotions reach record high — 340 artisans elevated across 45 nodes",
  "Bridge Pillar facilitates unprecedented cross-center collaboration between Accra and Seoul",
  "Loom Pillar's integration of indigenous knowledge with quantum computing wins Global Innovation Prize",
  "45-node global network achieves 99.97% uptime — most resilient educational infrastructure ever built",
];

interface Props {
  goTo: (page: string) => void;
}

export default function CentersOfInquiryPage({ goTo }: Props) {
  const [activePillar, setActivePillar] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  return (
    <>
      <HeroHeader
        title="Centers of Inquiry"
        description="In 2100, we look back at the moment Artemis abolished the department and replaced it with interdisciplinary hubs organized around grand challenges — reimagining not just what students learn, but where learning happens, and who it happens with."
        bgGradientClass="bg-[#8A0000]"
        bgImage="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=2000"
      />
      <div className="max-w-[1400px] mx-auto w-full px-5 sm:px-8 lg:px-20 py-16 lg:py-24 space-y-24">

        {/* ── Summary ── */}
        <section className="space-y-6">
          <SectionHeading>A Summary</SectionHeading>
          <p className="text-sm text-gray-600">
            Step into a virtual time capsule to discover how Artemis replaced the department with 15 Centers of Inquiry — each organized around a grand challenge, each spanning three global nodes, each dissolving the boundaries between disciplines, generations, and geographies.
          </p>
          <div className="w-full aspect-video bg-gray-200 relative group cursor-pointer overflow-hidden max-w-4xl border border-gray-300">
            <img
              src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=2500"
              alt="Video Thumbnail"
              className="w-full h-full object-cover filter grayscale opacity-70 group-hover:opacity-90 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-black/60 rounded flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-black/80 transition-colors">
                 <Play className="w-8 h-8 ml-1" />
              </div>
            </div>
            <div className="absolute top-6 left-6 bg-white/90 px-4 py-2 text-xs font-mono border border-black/10">
              BOX_ID: COI_2100.005<br/>
              CONTENTS:_CENTERS_OF_INQUIRY
            </div>
          </div>
        </section>

        {/* ── Historical Notes ── */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>Historical Notes</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h4 className="font-bold italic uppercase tracking-wider text-sm">The Setting</h4>
              <p className="font-bold italic text-sm text-gray-800 leading-relaxed">
                The department was the atom of the university — the indivisible unit around which everything was organized. Faculty were hired, promoted, and protected by departments. Students were admitted, advised, and credentialed by departments. The entire architecture of higher education was departmental.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                But the world&apos;s great challenges — climate change, pandemics, inequality, democratic erosion — did not respect departmental boundaries. They were inherently interdisciplinary, requiring integration of knowledge that no single department could provide. The gap between how problems existed in the world and how universities were organized to address them had become a chasm.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold italic uppercase tracking-wider text-sm">The Shift</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Artemis abolished departments entirely, replacing them with 15 Centers of Inquiry — interdisciplinary hubs organized around grand challenges rather than historical divisions of academic knowledge. Where departments created silos, Centers created bridges. Where departments trained students to think within walls, Centers trained them to think across landscapes.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed italic">
                &ldquo;The department was a container built for a world that no longer existed — a world where knowledge sat neatly in labeled boxes. But the most important questions had already escaped those boxes and were roaming free.&rdquo; — Dr. Lena Vasquez, 2028
              </p>
            </div>
          </div>
        </section>

        {/* ── The 15 Centers (Visual Grid) ── */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>The 15 Centers</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>
          <p className="text-sm text-gray-600 max-w-3xl">Each Center spans three global nodes, houses a team of Core Investigators and Junior Fellows, and pursues research organized around a single grand challenge. Together, they form a complete map of the questions that matter most to humanity&apos;s future.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {centers.map((c) => (
              <div key={c.num} className="border border-gray-200 p-5 hover:border-[#8A0000] transition-colors group cursor-default">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-mono text-gray-900 font-bold">{c.num}</span>
                  <div className="flex gap-2 text-[10px] text-gray-400">
                    <span>{c.investigators} CI</span>
                    <span>·</span>
                    <span>{c.fellows} JF</span>
                  </div>
                </div>
                <h4 className="font-bold text-sm text-gray-900 leading-tight group-hover:text-[#8A0000] transition-colors">{c.name}</h4>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{c.desc}</p>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">{c.nodes}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── The 5 Pillars (Interactive Tabs) ── */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>The Five Pillars</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>
          <p className="text-sm text-gray-600 max-w-3xl">Every Center of Inquiry is built on five structural pillars — the organizational DNA that makes the model fundamentally different from the departmental system it replaced.</p>

          <div className="mt-8">
            {/* Pillar Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {pillars.map((p, i) => (
                <button
                  key={p.title}
                  onClick={() => setActivePillar(i)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                    activePillar === i
                      ? 'bg-[#8A0000] text-white border-[#8A0000]'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-[#8A0000] hover:text-[#8A0000]'
                  }`}
                >
                  {p.title}
                </button>
              ))}
            </div>

            {/* Active Pillar Content */}
            <div className="border border-gray-200 p-8 md:p-12 bg-gray-50">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 italic">{pillars[activePillar].title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">{pillars[activePillar].desc}</p>
            </div>
          </div>

          {/* Visual: Pillar Architecture */}
          <div className="relative w-full max-w-3xl mx-auto mt-12">
            <div className="flex items-end justify-center gap-1 h-48">
              {pillars.map((p, i) => (
                <button
                  key={p.title}
                  onClick={() => setActivePillar(i)}
                  className={`flex-1 max-w-[120px] transition-all duration-500 cursor-pointer flex flex-col items-center justify-end ${
                    activePillar === i ? 'bg-[#8A0000]' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  style={{ height: `${60 + (activePillar === i ? 40 : i * 10)}%` }}
                >
                  <span className={`text-[9px] font-bold uppercase tracking-wider mb-2 whitespace-nowrap ${
                    activePillar === i ? 'text-white' : 'text-gray-600'
                  }`} style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                    {p.title}
                  </span>
                </button>
              ))}
            </div>
            <div className="w-full h-2 bg-[#8A0000] mt-0" />
            <p className="text-center text-[10px] font-mono text-gray-400 uppercase tracking-widest mt-3">Foundation: Centers of Inquiry</p>
          </div>
        </section>

        {/* ── Guild Layers (Visual) ── */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>Guild Layers</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>
          <p className="text-sm text-gray-600 max-w-3xl">Each Center operates through five nested Guild Layers — from foundational inquiry to challenge-driven action. Together, they ensure that research doesn&apos;t stay in the lab but cycles through application, reflection, and iteration.</p>

          <div className="max-w-3xl mx-auto mt-8">
            <div className="relative">
              {/* Concentric layers visualization */}
              <div className="flex flex-col items-center gap-2">
                {guildLayers.map((g, i) => (
                  <div
                    key={g.layer}
                    className="w-full border border-gray-200 p-4 flex items-center gap-4 hover:border-[#8A0000] transition-colors"
                    style={{ marginLeft: `${i * 16}px`, marginRight: `${i * 16}px` }}
                  >
                    <span className="text-lg text-[#8A0000] font-serif">{g.icon}</span>
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900">{g.layer}</h4>
                      <p className="text-xs text-gray-500 mt-1">{g.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Cycles ── */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>Cycles</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>
          <p className="text-sm text-gray-600 max-w-3xl">Learning and research at the Centers move through three distinct cycles — each with its own rhythm, intensity, and output. Together, they ensure that inquiry is never static.</p>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="border border-gray-200 p-6 space-y-4">
              <div className="text-xs font-mono text-gray-900 font-bold">3–6 MONTHS</div>
              <h4 className="font-bold text-lg text-gray-900 italic">Residency Cycles</h4>
              <p className="text-xs text-gray-600 leading-relaxed">Immersive embeds in Guild missions. Students and fellows rotate across global nodes — from Nairobi for urban futures to Zurich for emerging tech — producing capstone prototypes tested in civic contexts.</p>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                  <span className="w-1.5 h-1.5 bg-[#8A0000] rounded-full" />
                  <span>CoI Proposal</span>
                  <span>→</span>
                  <span>Team Formation</span>
                  <span>→</span>
                  <span>Research</span>
                  <span>→</span>
                  <span>Field Lab</span>
                  <span>→</span>
                  <span>Deploy</span>
                </div>
              </div>
            </div>
            <div className="border border-gray-200 p-6 space-y-4">
              <div className="text-xs font-mono text-gray-900 font-bold">2–6 WEEKS</div>
              <h4 className="font-bold text-lg text-gray-900 italic">Sprint Cycles</h4>
              <p className="text-xs text-gray-600 leading-relaxed">High-intensity challenges drawn from CoI priorities. Open to junior fellows and external collaborators, culminating in hackathon-style deliverables. Mandatory for Year 3+ students.</p>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                  <span className="w-1.5 h-1.5 bg-[#8A0000] rounded-full" />
                  <span>Challenge</span>
                  <span>→</span>
                  <span>Team Up</span>
                  <span>→</span>
                  <span>Ideate</span>
                  <span>→</span>
                  <span>Prototype</span>
                  <span>→</span>
                  <span>Open IP</span>
                </div>
              </div>
            </div>
            <div className="border border-gray-200 p-6 space-y-4">
              <div className="text-xs font-mono text-gray-900 font-bold">ONGOING · QUARTERLY REVIEWS</div>
              <h4 className="font-bold text-lg text-gray-900 italic">Deployment Cycles</h4>
              <p className="text-xs text-gray-600 leading-relaxed">Real-world testing in planetary settings, with iterative feedback from civic advisors. Outputs loop back to Inquiry layers for refinement — capstones contribute to the Knowledge Core, not just the classroom.</p>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                  <span className="w-1.5 h-1.5 bg-[#8A0000] rounded-full" />
                  <span>Select</span>
                  <span>→</span>
                  <span>Field Test</span>
                  <span>→</span>
                  <span>Feedback</span>
                  <span>→</span>
                  <span>Refine</span>
                  <span>→</span>
                  <span>Archive</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Reimagining Place ── */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>Reimagining Place</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h4 className="font-bold italic uppercase tracking-wider text-sm text-gray-900">The Distributed Campus</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Every Center spans three global nodes — strategically chosen for cultural richness, challenge relevance, and community connection. A learner might begin in Valletta, deepen in Tokyo, and activate in San Francisco — all within a single Center of Inquiry. The distributed campus didn&apos;t just remove geographic barriers; it transformed them into opportunities for cultural immersion and local impact.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                With 15 Centers × 3 nodes each, Artemis maintains 45 physical locations worldwide — plus virtual environments, Synchrony Pods, and partner sites that extend the network to every inhabited continent.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold italic uppercase tracking-wider text-sm text-gray-900">Synchrony Pods & Virtual Spaces</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Synchrony Pods enable truly immersive collaboration regardless of time zones or language barriers. Advanced telepresence creates the illusion of physical co-presence, haptic feedback allows manipulation of virtual objects together, and real-time translation AI eliminates language barriers entirely.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Beyond the Pods, a rich ecosystem of virtual learning environments — holographic design studios, simulated field sites, meditative reflection gardens, high-intensity crisis simulations — expanded what &ldquo;place&rdquo; could mean. At Artemis, place is defined by purpose, not geography.
              </p>
            </div>
          </div>
        </section>

        {/* ── #3 Global Node Network Map ── */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>Global Node Network</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>
          <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">
            45 nodes across 6 continents — each a physical anchor where learners, investigators, and community partners converge. Hover over any node to discover which Center calls it home and what grand challenge it pursues.
          </p>

          <div className="w-full max-w-4xl mx-auto border border-gray-200 bg-gray-50 p-4">
            <svg viewBox="0 0 1000 500" className="w-full" xmlns="http://www.w3.org/2000/svg">
              {/* Background */}
              <rect width="1000" height="500" fill="#f9fafb" />

              {/* Grid lines */}
              {[100, 200, 300, 400].map(y => (
                <line key={`h${y}`} x1="0" y1={y} x2="1000" y2={y} stroke="#e5e7eb" strokeWidth="0.5" />
              ))}
              {[200, 400, 600, 800].map(x => (
                <line key={`v${x}`} x1={x} y1="0" x2={x} y2="500" stroke="#e5e7eb" strokeWidth="0.5" />
              ))}

              {/* Simplified continent shapes */}
              {/* Africa */}
              <path d="M 470,120 L 500,100 L 520,120 L 540,160 L 550,200 L 540,260 L 520,320 L 500,350 L 480,340 L 470,300 L 460,240 L 460,180 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
              {/* South America */}
              <path d="M 280,180 L 320,160 L 340,200 L 350,260 L 340,320 L 320,380 L 300,400 L 280,380 L 270,320 L 260,260 L 270,200 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
              {/* Europe */}
              <path d="M 460,60 L 500,50 L 540,60 L 550,80 L 530,100 L 500,110 L 470,100 L 460,80 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
              {/* Asia */}
              <path d="M 560,50 L 700,40 L 780,60 L 800,100 L 780,140 L 720,160 L 660,170 L 600,150 L 560,120 L 550,80 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
              {/* Australia */}
              <path d="M 760,280 L 820,270 L 860,290 L 870,330 L 840,360 L 800,360 L 770,340 L 750,310 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
              {/* North America */}
              <path d="M 120,60 L 220,40 L 280,60 L 300,100 L 280,140 L 240,160 L 200,170 L 160,160 L 130,130 L 110,100 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />

              {/* Node pins */}
              {nodeLocations.map((node, i) => (
                <g key={node.city}
                   onMouseEnter={() => setHoveredNode(i)}
                   onMouseLeave={() => setHoveredNode(null)}
                   className="cursor-pointer"
                >
                  {/* Glow effect */}
                  <circle cx={node.x} cy={node.y} r={hoveredNode === i ? 14 : 10} fill="#8A0000" opacity={hoveredNode === i ? 0.12 : 0.06} className="transition-all duration-300" />
                  {/* Dot */}
                  <circle cx={node.x} cy={node.y} r={hoveredNode === i ? 5 : 3.5} fill="#8A0000" className="transition-all duration-300" />
                  {/* City label */}
                  <text x={node.x} y={node.y - 10} textAnchor="middle" style={{fontSize:'7.5px', fontWeight:'bold', fill:'#8A0000'}}>{node.city}</text>

                  {/* Tooltip on hover */}
                  {hoveredNode === i && (
                    <g>
                      <rect x={node.x - 110} y={node.y + 10} width="220" height="42" rx="3" fill="white" stroke="#8A0000" strokeWidth="1" />
                      <text x={node.x} y={node.y + 26} textAnchor="middle" style={{fontSize:'8.5px', fontWeight:'bold', fill:'#8A0000'}}>{node.center}</text>
                      <text x={node.x} y={node.y + 40} textAnchor="middle" style={{fontSize:'7.5px', fill:'#6B7280'}}>{node.focus}</text>
                    </g>
                  )}
                </g>
              ))}

              {/* Legend */}
              <g transform="translate(30, 420)">
                <rect width="180" height="40" fill="white" stroke="#e5e7eb" strokeWidth="1" rx="2" />
                <circle cx="20" cy="20" r="3.5" fill="#8A0000" />
                <text x="35" y="24" style={{fontSize:'9px', fill:'#6B7280'}}>Center Node Location</text>
              </g>

              {/* Title */}
              <text x="970" y="485" textAnchor="end" style={{fontSize:'9px', letterSpacing:'0.15em', fill:'#9CA3AF'}} className="font-mono uppercase">Global Node Network — Artemis 2100</text>
            </svg>
          </div>
        </section>

        {/* ── Timeline ── */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>Timeline</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>
          <Timeline events={timelineEvents} />
        </section>

        {/* ── Headlines from 2100 ── */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>Headlines from 2100</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>
          <HeadlinesFrom2100 headlines={headlines} />
        </section>

        {/* ── The Achievement ── */}
        <section className="space-y-8">
          <SectionHeading>The Achievement</SectionHeading>
          <div className="space-y-6 text-gray-600 leading-relaxed text-sm md:text-base">
            <p>Centers of Inquiry did not just reorganize the university — they rewired how knowledge itself was produced, shared, and deployed in the world.</p>
          </div>
          <ul className="space-y-4 text-gray-700 text-sm md:text-base">
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">The department abolished (2027–2035):</strong> 15 interdisciplinary hubs replaced siloed disciplines, organized around grand challenges instead of historical divisions of knowledge. The Closure Ceremonies — part celebration, part mourning, part provocation — became iconic cultural moments that were studied and replicated by universities worldwide.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">Five structural pillars (2030–2050):</strong> Unified Knowledge, Junior Fellows, Core Investigators, Translational Programs, and Technology Centers form the organizational DNA of every Center. By mid-century, every major research university had adopted at least three of the five pillars — a testament to the model&apos;s structural integrity and adaptability.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">Research never stays in the lab (2035–2065):</strong> Guild Layers and Cycles ensure inquiry moves from foundational research through deployment — every discovery has a pathway to impact. The translational pipeline produced over 12,000 deployed innovations by 2065, ranging from drought-resistant crop systems to AI-assisted judicial review tools.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">45 global nodes (2032–2070):</strong> The campus became a distributed network spanning every inhabited continent — 15 Centers, 3 nodes each, plus virtual and partner environments. By 2070, the Kampala Hub alone had trained more civic engineers than the entire continent&apos;s traditional universities combined.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">Place reimagined (2040–2075):</strong> Defined by purpose, not geography — physical, virtual, and hybrid spaces shaped by the challenges they address. The Synchrony Pod network became so seamless that by 2070, students routinely collaborated across four continents in a single afternoon without ever leaving their local node.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">Global adoption by 2080 (2055–2080):</strong> The Centers of Inquiry model spread to 200+ universities worldwide, becoming the dominant framework for research organization. What began as a radical experiment at a single institution became the new normal — proof that structural imagination, once demonstrated, is contagious.</span>
            </li>
          </ul>
          <div className="mt-8">
            <blockquote className="border-l-4 border-[#8A0000] pl-6 space-y-4">
              <p className="font-serif italic text-2xl text-gray-800 leading-snug">
                &ldquo;The department was a container built for a world that no longer existed — a world where knowledge sat neatly in labeled boxes. But the most important questions had already escaped those boxes and were roaming free.&rdquo;
              </p>
              <footer className="text-sm text-gray-500 font-bold uppercase tracking-widest">
                &mdash; Dr. Lena Vasquez, 2028
              </footer>
            </blockquote>
          </div>
        </section>

        {/* ── Field Dispatches ── */}
        <section className="space-y-12">
          <div className="space-y-4">
            <hr className="border-t border-gray-200" />
            <SectionHeading>Field Dispatches</SectionHeading>
            <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">Live reports from the 45 global nodes — transmitted from the field, unedited, urgent.</p>
          </div>

          <div className="space-y-6 mt-8">
            {/* Dispatch 1 - Nairobi */}
            <div className="border-l-4 border-[#8A0000] bg-[#faf8f5] p-5 md:p-6" style={{ transform: 'rotate(-0.5deg)' }}>
              <div className="font-mono text-[10px] text-gray-500 space-y-1 mb-3">
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  <span>FROM: <span className="text-gray-900">Nairobi Node</span></span>
                  <span>CENTER: <span className="text-gray-900">Next-Gen Education</span></span>
                  <span>DATE: <span className="text-gray-900">2087.03.14</span></span>
                  <span>PRIORITY: <span className="text-gray-700">STANDARD</span></span>
                </div>
              </div>
              <div className="h-px bg-gray-200 mb-3" />
              <p className="text-sm text-gray-700 leading-relaxed">Third cohort of Junior Fellows completes Sprint Cycle on AI-assisted indigenous language preservation. 12 languages documented that had no written form. The Swahili NLP Engine has been deployed to 340 community centers across East Africa. Local collaborators report a 67% increase in youth engagement with heritage materials. Requesting extension for Phase II: oral tradition mapping.</p>
            </div>

            {/* Dispatch 2 - Accra */}
            <div className="border-l-4 border-[#8A0000] bg-[#faf8f5] p-5 md:p-6" style={{ transform: 'rotate(0.3deg)' }}>
              <div className="font-mono text-[10px] text-gray-500 space-y-1 mb-3">
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  <span>FROM: <span className="text-gray-900">Accra Node</span></span>
                  <span>CENTER: <span className="text-gray-900">Civilization Architecture</span></span>
                  <span>DATE: <span className="text-gray-900">2079.11.02</span></span>
                  <span>PRIORITY: <span className="text-[#8A0000] font-bold">HIGH</span></span>
                </div>
              </div>
              <div className="h-px bg-gray-200 mb-3" />
              <p className="text-sm text-gray-700 leading-relaxed">Constitutional design sprint completed. Working with 14 West African communities to develop governance frameworks that integrate traditional council structures with digital democracy tools. The key insight: technology should amplify existing decision-making traditions, not replace them. One community rejected our prototype entirely — they said their system had worked for 400 years and didn&apos;t need &lsquo;optimization.&rsquo; We listened. The result was better than anything we could have designed alone.</p>
            </div>

            {/* Dispatch 3 - Seoul (URGENT) */}
            <div className="border-l-4 border-[#8A0000] bg-[#fef2f2] p-5 md:p-6">
              <div className="font-mono text-[10px] text-gray-500 space-y-1 mb-3">
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  <span>FROM: <span className="text-gray-900">Seoul Node</span></span>
                  <span>CENTER: <span className="text-gray-900">Emerging Technologies</span></span>
                  <span>DATE: <span className="text-gray-900">2091.06.28</span></span>
                  <span>PRIORITY: <span className="text-[#8A0000] font-bold">URGENT</span></span>
                </div>
              </div>
              <div className="h-px bg-[#8A0000]/20 mb-3" />
              <p className="text-sm text-gray-700 leading-relaxed">Quantum-biological interface breakthrough. A team of 3 Core Investigators and 8 Junior Fellows has achieved stable quantum coherence at room temperature using a protein scaffold derived from deep-ocean organisms. This changes everything — quantum computing is no longer confined to cryogenic labs. Three Centers have already requested access for parallel research. Sprint Cycle initiated.</p>
            </div>

            {/* Dispatch 4 - Valletta */}
            <div className="border-l-4 border-[#8A0000] bg-[#faf8f5] p-5 md:p-6" style={{ transform: 'rotate(-0.3deg)' }}>
              <div className="font-mono text-[10px] text-gray-500 space-y-1 mb-3">
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  <span>FROM: <span className="text-gray-900">Valletta Node</span></span>
                  <span>CENTER: <span className="text-gray-900">Frontiers of Artemis Research</span></span>
                  <span>DATE: <span className="text-gray-900">2075.01.01</span></span>
                  <span>PRIORITY: <span className="text-gray-700">STANDARD</span></span>
                </div>
              </div>
              <div className="h-px bg-gray-200 mb-3" />
              <p className="text-sm text-gray-700 leading-relaxed">Annual report: The coordinating hub has seeded 47 interdisciplinary inquiries this year across all 15 Centers. The most promising: a collaboration between Civilization Architecture and Planetary Systems on &lsquo;governance for climate refugees&apos; — a project that began as a Sprint Cycle and has now become a full Residency Cycle spanning 6 nodes. The boundaries between Centers are dissolving faster than we planned. This is good.</p>
            </div>

            {/* Dispatch 5 - Santiago */}
            <div className="border-l-4 border-[#8A0000] bg-[#faf8f5] p-5 md:p-6" style={{ transform: 'rotate(0.5deg)' }}>
              <div className="font-mono text-[10px] text-gray-500 space-y-1 mb-3">
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  <span>FROM: <span className="text-gray-900">Santiago Node</span></span>
                  <span>CENTER: <span className="text-gray-900">Energy Systems</span></span>
                  <span>DATE: <span className="text-gray-900">2083.08.15</span></span>
                  <span>PRIORITY: <span className="text-[#8A0000] font-bold">HIGH</span></span>
                </div>
              </div>
              <div className="h-px bg-gray-200 mb-3" />
              <p className="text-sm text-gray-700 leading-relaxed">Post-carbon prototype passes field test. Modular solar micro-grids deployed in 14 Atacama Desert communities now operating at 99.7% autonomy. The innovation: each unit is assembled and maintained by local technicians with 3 days of training. Open-source schematics have been downloaded 12,000 times. A Legacy Builder from the Circumpolar Return adapted the design for Antarctic research stations. Knowledge flows in every direction.</p>
            </div>
          </div>
        </section>

      </div>
      <ExploreAnotherFuture currentPage="centers-of-inquiry" goTo={goTo} />
    </>
  );
}
