'use client';

import { useState } from "react";
import { Play, ChevronLeft, ChevronRight, BookOpen, Mic, Mail, FileText, Video, Volume2, X } from "lucide-react";
import { SectionHeading, HeroHeader, ExploreAnotherFuture, Timeline, HeadlinesFrom2100 } from "../Shared";
import type { TimelineEvent } from "../Shared";

/* ─── Timeline Events ─── */
const timelineEvents: TimelineEvent[] = [
  {year: "2025", title: "Open Loop Proposed", desc: "Artemis challenges the closed loop of admission-to-graduation"},
  {year: "2030", title: "Alumni Return Policy", desc: "Graduates can return for new credentials at no additional tuition"},
  {year: "2035", title: "Credential Unbundling", desc: "Degrees replaced by micro-credentials that stack and combine freely"},
  {year: "2042", title: "Corporate Partnership Act", desc: "Employers fund employee returns to learning; tax incentives enacted"},
  {year: "2055", title: "Lifelong Learning Mandate", desc: "30 nations require employers to provide paid learning leave"},
  {year: "2075", title: "The 5-Life Arc", desc: "Average person completes 5 distinct learning phases across their lifetime"},
];

/* ─── Headlines from 2100 ─── */
const headlines = [
  "Average learner now enrolls 5.3 times across lifetime — up from 1.2 in 2020",
  "Corporate Learning Leave reaches 40 days per year in 67 countries",
  "Micro-credential market surpasses $4 trillion as degrees become relics",
  "Artemis alumna returns at age 71 to study quantum biology — her 4th enrollment",
  "Lifelong learning tax incentives credited with 15% increase in workforce adaptability",
];

/* ─── Artifact Data ─── */
const artifacts = [
  {
    type: "DIARY ENTRY",
    icon: BookOpen,
    title: "The Day I Looped Out",
    date: "March 14, 2042",
    teaser: "A Pathfinder's handwritten account of the moment they chose to leave — and why coming back mattered.",
    full: "I remember the exact bench. Third floor of the Athenaeum, overlooking the courtyard where Catalysts held their morning councils. My advisor said looping out wasn't failure — it was data. She was right. I spent eleven months in Kigali working with community health workers, and when I returned, I understood epidemiology not as a subject but as a practice. The Continuum didn't break. It breathed."
  },
  {
    type: "AUDIO LOG",
    icon: Mic,
    title: "Populi Network Dispatch #447",
    date: "January 8, 2071",
    teaser: "A recorded dispatch from the global populi network — 4.2 million learners, one signal.",
    full: "This is Populi Dispatch 447, coming to you from the Nairobi Node. This week: a Navigator in Osaka shares how her third return to Artemis led to the development of a quantum-resistant cryptography standard now used by 14 central banks. A Catalyst in Valletta publishes his 40th paper — at age 78 — proving that institutional memory is not a burden but a catalyst for innovation. The network is alive. The Continuum continues."
  },
  {
    type: "POSTCARD",
    icon: Mail,
    title: "From the Calibrate Phase",
    date: "Summer, 2038",
    teaser: "A digital postcard from a first-year Pathfinder discovering the Continuum for the first time.",
    full: "Dear Future Me — I'm writing this from the observation deck of the Helsinki Node. It's 2am and the sky is the color of old silver. I came here to study architecture, but tonight I attended a Catalyst's lecture on the mathematics of trust networks, and I can't stop thinking about it. The Continuum says I don't have to choose. I can study architecture AND trust networks. I can loop out and loop back. For the first time in my life, learning doesn't feel like a hallway with locked doors. It feels like an open field."
  },
  {
    type: "POLICY DOC",
    icon: FileText,
    title: "The Lifelong Learning Mandate",
    date: "November 3, 2055",
    teaser: "The landmark legislation that made paid learning leave a universal right.",
    full: "THIRTY NATIONS SIGN THE LIFELONG LEARNING MANDATE — In a ceremony at the Artemis Geneva Node, representatives from thirty nations signed the Mandate into international law, requiring all employers with more than 50 employees to provide a minimum of 40 days of paid learning leave per year. The Mandate was directly influenced by Artemis's Infinite Learning Continuum, which demonstrated that learners who returned to education mid-career were 3.7 times more likely to produce breakthrough innovations than those who did not."
  },
  {
    type: "VIDEO ARCHIVE",
    icon: Video,
    title: "The Last Graduation Ceremony",
    date: "May 1, 2033",
    teaser: "Footage from the final traditional graduation at Artemis — the event that ended all endings.",
    full: "The Last Graduation was not a funeral. It was a transformation. When Chancellor Adebayo declared 'There will be no more graduates at Artemis — only populi,' the audience of 4,000 fell silent for exactly seven seconds before erupting into the longest standing ovation in the university's history. The caps were thrown. The degrees were conferred. And then the ceremony dissolved into a sign-up for the Continuum's first return cycle. Nobody left. Everyone simply... continued."
  },
  {
    type: "SOUND BITE",
    icon: Volume2,
    title: "Legacy Builder Testimonial",
    date: "April 22, 2091",
    teaser: "A 94-year-old populi reflects on 73 years of continuous learning.",
    full: "I've been part of Artemis for seventy-three years. I entered as a Pathfinder in 2018 — before the Continuum even existed. I became a Navigator, then a Catalyst, and now I am a Legacy Builder. People ask me if I'm tired of learning. I tell them: I am tired the way a river is tired of flowing. The Continuum didn't extend my education. It revealed that education was never supposed to end. It was supposed to deepen."
  }
];

/* ─── Carousel Photos ─── */
const carouselPhotos = [
  { src: "https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Children engaged in early exploratory learning" },
  { src: "https://images.pexels.com/photos/8195369/pexels-photo-8195369.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Young adults studying in a collaborative environment" },
  { src: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Professionals collaborating on innovative projects" },
  { src: "https://images.pexels.com/photos/6147082/pexels-photo-6147082.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Mature mentor guiding the next generation" },
  { src: "https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Elder learner in a continued education context" },
  { src: "https://images.pexels.com/photos/7176045/pexels-photo-7176045.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Community of lifelong learners gathering together" },
];

/* ─── Stage Data ─── */
const stages = [
  {
    symbol: "α",
    name: "Early Explorers",
    ages: "5–17",
    image: "https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "The Continuum begins before university. Young learners engage with Artemis through immersive digital camps, mentorship circles, and curiosity-driven micro-courses. These aren\u2019t pre-college prep programs \u2014 they\u2019re genuine encounters with interdisciplinary thinking, designed to ignite purpose and wonder early. Early Explorers discover what questions excite them, building a foundation of intrinsic motivation that shapes their entire learning journey."
  },
  {
    symbol: "β",
    name: "Pathfinders",
    ages: "18–25",
    image: "https://images.pexels.com/photos/8195369/pexels-photo-8195369.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "The traditional \u201Cundergraduate\u201D phase was reconceived entirely. Pathfinders navigate through Calibrate, Elevate, and Activate cycles (as described in Adaptive Paced Learning), entering and exiting as their life demands. They declare missions, not majors. They move between Centers of Inquiry rather than departments. Some loop out for real-world immersion and loop back with fresh perspective. The fixed four-year window dissolved into a flexible, purpose-driven arc."
  },
  {
    symbol: "γ",
    name: "Navigators",
    ages: "25–45",
    image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Working professionals return to Artemis \u2014 not as \u201Calumni\u201D visiting their past, but as Navigators charting new territory. They loop back for mid-career accelerators, specialized micro-credentials, and collaborative sabbaticals. Navigators bring real-world complexity into the classroom, enriching discourse and bridging theory with practice. Their presence transforms Artemis from a place of preparation into a living laboratory of applied wisdom."
  },
  {
    symbol: "δ",
    name: "Catalysts",
    ages: "45–65",
    image: "https://images.pexels.com/photos/6147082/pexels-photo-6147082.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Later-career practitioners return as Catalysts \u2014 part mentor, part co-learner, part provocateur. They teach in Centers of Inquiry, lead transdisciplinary research pods, and guide the next generation of Pathfinders. But they also learn: emerging fields, new methodologies, and the fresh perspectives that only young minds can provide. The Catalyst stage dissolves the boundary between teacher and student entirely, creating a community where expertise flows in every direction."
  },
  {
    symbol: "Ω",
    name: "Legacy Builders",
    ages: "65+",
    image: "https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "The Continuum\u2019s final stage is perhaps its most revolutionary. Legacy Builders remain engaged with Artemis as scholars-in-residence, community elders, and architects of institutional memory. They curate knowledge across generations, write the narratives that shape Artemis\u2019s evolving identity, and ensure that wisdom is never lost to time. Legacy Builders prove that the hunger for learning does not diminish with age \u2014 it only deepens."
  }
];

/* ─── Finite Loop Steps ─── */
const finiteSteps = ["School", "College", "Work", "Retire", "END"];

/* ─── Continuum Nodes ─── */
const continuumNodes = ["Explore", "Pathfind", "Navigate", "Catalyze", "Legacy"];

interface Props {
  goTo: (page: string) => void;
}

export default function OpenLoopPage({ goTo }: Props) {
  const [expandedArtifact, setExpandedArtifact] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () => setCurrentSlide((s) => (s === 0 ? carouselPhotos.length - 1 : s - 1));
  const nextSlide = () => setCurrentSlide((s) => (s === carouselPhotos.length - 1 ? 0 : s + 1));

  return (
    <>
      <HeroHeader
        title="The Infinite Learning Continuum"
        description="Open Loop Learning evolved from a radical idea into a cradle-to-grave model — where learning never ends, it only transforms. From Early Explorers to Legacy Builders, Artemis redefined what it means to be a lifelong learner."
        bgGradientClass="bg-gradient-to-tr from-[#8A0000] via-[#A50000] to-[#6B0000]"
        bgImage="https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=2000"
      />
      <div className="max-w-[1400px] mx-auto w-full px-5 sm:px-8 lg:px-20 py-16 lg:py-24 space-y-24">

        {/* ════════════════════════════════════════════════════════════════
            SUMMARY SECTION (kept as-is)
        ════════════════════════════════════════════════════════════════ */}
        <section className="space-y-6">
          <SectionHeading>A Summary</SectionHeading>
          <p className="text-sm text-gray-600">
            Step into a virtual time capsule to discover how Artemis reshaped education worldwide through the Infinite Learning Continuum — where learners of every age move fluidly through a lifetime of discovery, mastery, and contribution.
          </p>
          <div className="w-full aspect-video bg-gray-200 relative group cursor-pointer overflow-hidden max-w-4xl border border-gray-300">
            <img
              src="https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=2500"
              alt="Video Thumbnail"
              className="w-full h-full object-cover filter grayscale opacity-70 group-hover:opacity-90 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-black/60 rounded flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-black/80 transition-colors">
                 <Play className="w-8 h-8 ml-1" />
              </div>
            </div>
            <div className="absolute top-6 left-6 bg-white/90 px-4 py-2 text-xs font-mono border border-black/10">
              BOX_ID: ILC_2100.001<br/>
              CONTENTS:_INFINITE_CONTINUUM
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            THE FINITE LOOP vs THE INFINITE CONTINUUM (NEW)
        ════════════════════════════════════════════════════════════════ */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>The Finite Loop vs The Infinite Continuum</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* LEFT CARD: The Finite Loop */}
            <div className="bg-gray-100 border border-gray-200 p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-bold uppercase tracking-wider text-gray-500">The Finite Loop</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Education was segmented into distinct phases: primary, secondary, tertiary, then professional development. Learning had a clear beginning and end — a finite loop that closed the moment a degree was conferred.
              </p>

              {/* Conveyor belt visual */}
              <div className="py-6">
                <div className="flex items-center gap-0 overflow-x-auto">
                  {finiteSteps.map((step, i) => (
                    <div key={step} className="flex items-center shrink-0">
                      <div className={`px-4 py-3 border-2 text-xs font-bold uppercase tracking-wider ${
                        step === "END"
                          ? "bg-gray-300 border-gray-400 text-gray-600 line-through"
                          : "bg-gray-200 border-gray-300 text-gray-500"
                      }`}>
                        {step}
                      </div>
                      {i < finiteSteps.length - 1 && (
                        <div className="flex items-center text-gray-400 mx-1">
                          <div className="w-4 h-px bg-gray-400" />
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 6 10">
                            <path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                  {/* Dead-end block */}
                  <div className="flex items-center shrink-0 ml-1">
                    <div className="w-6 h-px bg-gray-400" />
                    <div className="w-6 h-6 border-2 border-gray-400 bg-gray-300 flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-500" />
                    </div>
                  </div>
                </div>
              </div>

              <ul className="text-xs text-gray-500 space-y-3 divide-y divide-gray-200">
                <li className="pt-2">Fixed 4-year degree window</li>
                <li className="pt-2">Learning confined to classroom years</li>
                <li className="pt-2">Limited access to academic settings later in life</li>
                <li className="pt-2">Adults returning to school overwhelmed by outdated curricula</li>
                <li className="pt-2">&ldquo;Lifelong learning&rdquo; discussed but rarely implemented</li>
              </ul>
            </div>

            {/* RIGHT CARD: The Infinite Continuum */}
            <div className="bg-white border border-[#8A0000]/20 p-6 sm:p-8 space-y-6 shadow-sm">
              <h3 className="text-lg font-bold uppercase tracking-wider text-[#8A0000]">The Infinite Continuum</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                The Infinite Learning Continuum discarded the idea of education as a finite process. Learning became a cradle-to-grave journey — an infinite loop where individuals evolve through distinct life stages, each with its own rhythm, purpose, and mode of engagement.
              </p>

              {/* Circular loop visual */}
              <div className="flex justify-center py-4">
                <div className="relative w-56 h-56 sm:w-64 sm:h-64">
                  {/* SVG circle path with arrows */}
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* Outer ring */}
                    <circle cx="100" cy="100" r="72" fill="none" stroke="#8A0000" strokeWidth="1.5" strokeDasharray="6 3" />
                    {/* Arrow markers on the ring */}
                    <path d="M 100 28 L 105 34 L 100 30 L 95 34 Z" fill="#8A0000" />
                    <path d="M 172 100 L 166 105 L 170 100 L 166 95 Z" fill="#8A0000" />
                    <path d="M 100 172 L 95 166 L 100 170 L 105 166 Z" fill="#8A0000" />
                    <path d="M 28 100 L 34 95 L 30 100 L 34 105 Z" fill="#8A0000" />
                  </svg>

                  {/* Nodes around the circle */}
                  {continuumNodes.map((node, i) => {
                    const angle = (i * 72 - 90) * (Math.PI / 180);
                    const x = 100 + 72 * Math.cos(angle);
                    const y = 100 + 72 * Math.sin(angle);
                    return (
                      <div
                        key={node}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${x}%`, top: `${y}%` }}
                      >
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#8A0000] bg-white flex items-center justify-center shadow-sm">
                          <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-[#8A0000] text-center leading-tight px-1">{node}</span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Center label */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-[9px] font-mono text-[#8A0000]/50 uppercase tracking-widest">∞</div>
                    </div>
                  </div>
                </div>
              </div>

              <ul className="text-xs text-gray-600 space-y-3 divide-y divide-gray-100">
                <li className="pt-2">Learning begins before university and continues beyond it</li>
                <li className="pt-2">Five life stages replace the traditional degree timeline</li>
                <li className="pt-2">Every return to Artemis deepens expertise and community</li>
                <li className="pt-2">Knowledge flows between generations in both directions</li>
                <li className="pt-2">&ldquo;Populi&rdquo; replace &ldquo;alumni&rdquo; — learners for life, not graduates for a day</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            HISTORICAL NOTES (kept as-is)
        ════════════════════════════════════════════════════════════════ */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>Historical Notes</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h4 className="font-bold italic uppercase tracking-wider text-sm">The Setting</h4>
              <p className="font-bold italic text-sm text-gray-800 leading-relaxed">
                In the early 21st century, education was segmented into distinct phases: primary, secondary, and tertiary, followed by professional development in the workforce. The assumption was that learning happened in sequential stages, with a clear beginning and end.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                The rapid pace of technological advancement and the increasing complexity of societal challenges demanded a more fluid approach. The rigid structures of the traditional system began to show their limitations, as individuals struggled to adapt to ever-changing career landscapes and evolving personal aspirations.
              </p>
            </div>

            <div className="space-y-4 mt-8 md:mt-0">
              <h4 className="font-bold italic uppercase tracking-wider text-sm">The Leap from Open Loop to Infinite Continuum</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Open Loop Learning began as a radical proposition: that learners should be able to enter and exit the university at any point. But it evolved into something far more ambitious — the Infinite Learning Continuum. Where Open Loop asked &ldquo;what if you could come back?&rdquo;, the Continuum asked &ldquo;what if learning never stopped?&rdquo; The model expanded from flexible undergraduate entry to a cradle-to-grave framework encompassing every stage of human development.
              </p>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            THE FIVE STAGES — IMAGE CARDS (NEW)
        ════════════════════════════════════════════════════════════════ */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>The Five Stages</SectionHeading>
          </div>

          <div className="space-y-8">
            {stages.map((stage, i) => {
              const isEven = i % 2 === 0;
              return (
                <div
                  key={stage.symbol}
                  className="group border-l-4 border-transparent hover:border-[#8A0000] transition-all duration-300 bg-white"
                >
                  <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-0`}>
                    {/* Image side */}
                    <div className="relative w-full md:w-1/2 aspect-[16/10] md:aspect-auto overflow-hidden">
                      <img
                        src={stage.image}
                        alt={stage.name}
                        className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-90 group-hover:grayscale-[50%] transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      {/* Stage name + age overlaid on image */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                        <div className="text-[9px] font-mono text-white/60 uppercase tracking-widest mb-1">Stage {stage.symbol}</div>
                        <h4 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">{stage.name}</h4>
                        <div className="text-sm text-white/70 font-mono mt-1">Ages {stage.ages}</div>
                      </div>
                    </div>

                    {/* Text side */}
                    <div className="relative w-full md:w-1/2 p-6 sm:p-8 lg:p-10 flex items-center">
                      {/* Large watermark symbol */}
                      <div className="absolute top-4 right-6 text-[120px] sm:text-[160px] font-serif italic text-gray-100 leading-none pointer-events-none select-none">
                        {stage.symbol}
                      </div>
                      <div className="relative z-10">
                        <div className="text-[9px] font-mono text-[#8A0000] uppercase tracking-widest mb-3">
                          {i === 0 ? 'Stage I' : i === 1 ? 'Stage II' : i === 2 ? 'Stage III' : i === 3 ? 'Stage IV' : 'Stage V'}
                        </div>
                        <h4 className="font-bold italic uppercase tracking-wider text-sm text-gray-900 mb-4">
                          {stage.name} (Ages {stage.ages})
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {stage.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Timeline (kept as-is) ── */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>Timeline</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>
          <Timeline events={timelineEvents} />
        </section>

        {/* ── Headlines from 2100 (kept as-is) ── */}
        <section className="space-y-12">
          <div className="space-y-4">
            <SectionHeading>Headlines from 2100</SectionHeading>
            <hr className="border-t border-gray-200" />
          </div>
          <HeadlinesFrom2100 headlines={headlines} />
        </section>

        {/* ════════════════════════════════════════════════════════════════
            THE ACHIEVEMENT (kept as-is)
        ════════════════════════════════════════════════════════════════ */}
        <section className="space-y-8">
          <SectionHeading>The Achievement</SectionHeading>
          <div className="space-y-6 text-gray-600 leading-relaxed text-sm md:text-base">
            <p>The Infinite Learning Continuum transformed the fundamental relationship between learners and institutions — not by extending the old model, but by replacing it entirely.</p>
          </div>
          <ul className="space-y-4 text-gray-700 text-sm md:text-base">
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">De-stigmatized alternative learning paths (2042–2055):</strong> By the mid-2040s, the stigma of &ldquo;non-traditional&rdquo; learning paths had all but vanished. Students who once felt pressured to conform to arbitrary timelines were cycling through the Continuum at their own rhythm — and producing outcomes that consistently outperformed their clock-bound predecessors. The data was irrefutable: flexibility was not indulgence; it was the precondition for excellence.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">Career pivoting with academic grounding (2035–2060):</strong> Adults at any stage could redirect their professional lives and reconnect with meaningful social contexts. By 2050, the average Artemis populi had pivoted careers 2.3 times — each return to the Continuum deepening both expertise and purpose, not restarting from zero.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">Revitalized the student body (2040–2065):</strong> On-ramps at many ages enabled populations traditionally underrepresented at elite institutions to gain greater access. The Continuum&apos;s flexible entry points drew learners from every demographic, transforming Artemis from a homogeneous institution into a genuine cross-section of global humanity.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">From alumni to populi (2032–2055):</strong> Transformed &ldquo;alumni&rdquo; into a lifelong community of learners who remain active, engaged, and evolving. The populi network became one of the most powerful intellectual and social ecosystems on the planet — a distributed brain trust that no graduation ceremony could ever dissolve.</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">Cradle-to-grave model (2030–2100):</strong> Established learning as an infinite human endeavor, not a finite transaction — 5 life stages replaced the traditional degree timeline. By the turn of the 22nd century, the Continuum had produced five generations of learners who never conceived of education as something that could be &ldquo;finished.&rdquo;</span>
            </li>
            <li className="flex gap-4">
              <span className="text-[#8A0000] font-bold mt-1 shrink-0">&#9632;</span>
              <span><strong className="text-gray-900">Expert practitioners return (2045–2080):</strong> Capitalized on the remarkable accomplishments of its populi through the invitation to return at every life stage. The returning-practitioner pipeline became Artemis&apos;s most distinctive competitive advantage — a perpetual flow of real-world insight that kept every Center of Inquiry tethered to the challenges that actually mattered.</span>
            </li>
          </ul>
          <div className="mt-8">
            <blockquote className="border-l-4 border-[#8A0000] pl-6 space-y-4">
              <p className="font-serif italic text-2xl text-gray-800 leading-snug">
                &ldquo;I looped out after two years to observe the role of nonviolent communication in international policy. When I returned, I understood what I was studying — and why it mattered.&rdquo;
              </p>
              <footer className="text-sm text-gray-500 font-bold uppercase tracking-widest">
                &mdash; Pathfinder Class of 2062, reflecting on the Continuum
              </footer>
            </blockquote>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            CONTINUUM CAPSULE (NEW — replaces Exhibit Article Archive + Gallery)
        ════════════════════════════════════════════════════════════════ */}
        <section className="space-y-16">
          <div>
            <hr className="border-t border-gray-200 mb-12" />
            <SectionHeading>Continuum Capsule</SectionHeading>
            <p className="text-sm text-gray-600 mt-4">Open each artifact to discover what the Continuum left behind.</p>
          </div>

          {/* Artifact Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {artifacts.map((artifact, i) => {
              const Icon = artifact.icon;
              const isExpanded = expandedArtifact === i;
              return (
                <div
                  key={i}
                  className="relative border border-gray-200 bg-white cursor-pointer transition-all duration-300 hover:border-[#8A0000]/40 hover:shadow-lg group overflow-hidden"
                  onClick={() => setExpandedArtifact(isExpanded ? null : i)}
                >
                  {/* Collapsed state */}
                  <div className={`p-5 sm:p-6 transition-all duration-300 ${isExpanded ? 'opacity-0 h-0 p-0 overflow-hidden' : 'opacity-100'}`}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 bg-[#8A0000]/10 flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5 text-[#8A0000]" />
                      </div>
                      <span className="text-[9px] font-mono font-bold text-[#8A0000] uppercase tracking-widest">{artifact.type}</span>
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 mb-2 leading-tight">{artifact.title}</h4>
                    <p className="text-[10px] font-mono text-gray-400 mb-3">{artifact.date}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{artifact.teaser}</p>
                    <div className="mt-4 text-[9px] font-mono text-[#8A0000] uppercase tracking-widest group-hover:underline">Tap to open →</div>
                  </div>

                  {/* Expanded state */}
                  {isExpanded && (
                    <div className="p-5 sm:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-[#8A0000]/10 flex items-center justify-center">
                            <Icon className="w-3.5 h-3.5 text-[#8A0000]" />
                          </div>
                          <span className="text-[9px] font-mono font-bold text-[#8A0000] uppercase tracking-widest">{artifact.type}</span>
                        </div>
                        <button
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          onClick={(e) => { e.stopPropagation(); setExpandedArtifact(null); }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <h4 className="font-bold text-sm text-gray-900 mb-1 leading-tight">{artifact.title}</h4>
                      <p className="text-[10px] font-mono text-gray-400 mb-4">{artifact.date}</p>
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-xs text-gray-700 leading-relaxed italic">{artifact.full}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Continuum Gallery Carousel ── */}
          <div className="space-y-8 pt-8">
            <div className="space-y-2">
              <SectionHeading>Continuum Gallery</SectionHeading>
              <p className="text-xs text-gray-400 font-mono mt-2">Artefact visuals from the Continuum archives</p>
            </div>

            <div className="relative w-full overflow-hidden bg-gray-50 border border-gray-200">
              {/* Slide container */}
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {carouselPhotos.map((photo, i) => (
                  <div key={i} className="w-full shrink-0">
                    <div className="relative w-full aspect-[16/9] sm:aspect-[21/9]">
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="w-full h-full object-cover grayscale opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <div className="absolute bottom-4 left-6 text-white/70 text-xs font-mono">
                        {String(i + 1).padStart(2, '0')} / {String(carouselPhotos.length).padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors z-10"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors z-10"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2">
              {carouselPhotos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === currentSlide
                      ? 'bg-[#8A0000] scale-110'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

      </div>
      <ExploreAnotherFuture currentPage="open-loop-learning" goTo={goTo} />
    </>
  );
}
