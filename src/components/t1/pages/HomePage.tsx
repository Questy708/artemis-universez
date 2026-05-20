'use client';

import { useEffect, useState } from 'react';
import { cn, SectionHeading } from '../Shared';
import { Play } from 'lucide-react';

const SECTIONS = [
  { id: "intro", title: "Learning & Living at Artemis", desc: "An exploration of educational experiences for the future", img: "https://images.pexels.com/photos/5940713/pexels-photo-5940713.jpeg?auto=compress&cs=tinysrgb&w=2000" },
  { id: "context-1", title: "A Complex and Special Moment", desc: "", img: "https://images.pexels.com/photos/31367498/pexels-photo-31367498.jpeg?auto=compress&cs=tinysrgb&w=2000" },
  { id: "context-3-1-1", title: "Our Process", desc: "", img: "https://images.pexels.com/photos/5940844/pexels-photo-5940844.jpeg?auto=compress&cs=tinysrgb&w=2000" },
  { id: "context-3-1-1-1", title: "Dimensions to Spark Experiments", desc: "", img: "https://images.pexels.com/photos/6238029/pexels-photo-6238029.jpeg?auto=compress&cs=tinysrgb&w=2000" },
  { id: "context-4", title: "Moments in Time", desc: "", img: "https://images.pexels.com/photos/8872466/pexels-photo-8872466.jpeg?auto=compress&cs=tinysrgb&w=2000" },
  { id: "fast-forward", title: "Let's fast forward to a possible future...", desc: "What might the university experience be then?", img: "https://images.pexels.com/photos/7235894/pexels-photo-7235894.jpeg?auto=compress&cs=tinysrgb&w=2000" },
];

interface HomePageProps {
  goTo: (page: string) => void;
}

export default function HomePage({ goTo }: HomePageProps) {
  const [activeSection, setActiveSection] = useState("intro");

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = SECTIONS.map(s => document.getElementById(s.id));
      let currentSection = "intro";
      for (const el of sectionElements) {
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) {
            currentSection = el.id;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full relative bg-white">
      {/* Side Dots Navigation */}
      <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="relative group w-3 h-3 flex items-center justify-end"
            aria-label={`Scroll to ${s.title}`}
          >
            <div className={cn(
              "w-2 h-2 rounded-full transition-all duration-300 md:w-3 md:h-3",
              activeSection === s.id ? "bg-gray-800 scale-125" : "bg-gray-400 group-hover:bg-gray-600"
            )} />
            <span className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] uppercase font-bold tracking-widest px-2 py-1 whitespace-nowrap hidden md:block">
              {s.title}
            </span>
          </a>
        ))}
      </nav>

      {/* Intro */}
      <ParallaxSection section={SECTIONS[0]}>
        <div className="space-y-12">
          <SectionHeading>This is a pivotal moment for the future of learning.</SectionHeading>
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-6 text-gray-600 leading-relaxed max-w-lg text-sm md:text-base">
              <p>The Artemis Project dares to re-engineer the way humanity learns. We recognize the advent of the &lsquo;Homo Eruditus&rsquo; — the learned, adaptable human — and the urgent need to transition from Industrial Revolution-era educational models to dynamic, globally collaborative frameworks.</p>
              <p>Higher education stands at a critical juncture. Student debt burdens millions. The skills gap widens: 49% of entry-level jobs require digital skills, yet only 23% of graduates possess them. A landmark study revealed that 36% of college students showed no significant improvement in critical thinking after four years. These are not merely statistics — they are a summons.</p>
            </div>
            <div>
              <blockquote className="border-l-4 border-yellow-400 pl-6 space-y-4">
                <p className="font-serif italic text-2xl text-gray-800 leading-snug">
                  &ldquo;Education is the most powerful weapon which you can use to change the world.&rdquo;
                </p>
                <footer className="text-sm text-gray-500 font-bold uppercase tracking-widest">
                  &mdash; Nelson Mandela
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </ParallaxSection>

      {/* Context 1 */}
      <ParallaxSection section={SECTIONS[1]}>
        <div className="space-y-12">
          <h2 className="text-3xl font-bold max-w-2xl text-gray-900 leading-tight">A world in transformation demands transformation in learning</h2>
          <div className="grid md:grid-cols-2 gap-16">
             <div className="space-y-6 text-gray-600 leading-relaxed max-w-lg text-sm md:text-base">
                <p>Disruptive technologies were launching faster than humans could learn them. The globalized economy meant unprecedented interconnectedness — a breakthrough in one hemisphere could render an entire curriculum obsolete in another. Schools — society&apos;s core mechanism for strengthening adaptability — were mired in convention and struggling to change.</p>
                <p>Artificial intelligence, biotechnology, quantum computing, and climate engineering were redrawing the boundaries of what humans needed to know. The gap between what institutions taught and what civilization needed was widening into a chasm.</p>
             </div>
             <div>
              <blockquote className="border-l-4 border-[#007f9c] pl-6 space-y-4">
                <p className="font-serif italic text-2xl text-gray-800 leading-snug">
                  &ldquo;The illiterate of the 21st century will not be those who cannot read and write, but those who cannot learn, unlearn, and relearn.&rdquo;
                </p>
                <footer className="text-sm text-gray-500 font-bold uppercase tracking-widest">
                  &mdash; Alvin Toffler
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </ParallaxSection>

      {/* Context 3-1-1 */}
      <ParallaxSection section={SECTIONS[2]}>
        <div className="space-y-12">
          <h2 className="text-3xl font-bold max-w-2xl text-gray-900 leading-tight">Our Process</h2>
          <div className="grid md:grid-cols-2 gap-16">
             <div className="space-y-6 text-gray-600 leading-relaxed max-w-lg text-sm md:text-base">
                <p>A dedicated design team from the Artemis Project collaborated with hundreds of insightful, creative, and committed students, faculty, and administrators over the course of a year. They embraced the complexity — not as a problem to be solved, but as a landscape to be understood, questioned, and reimagined.</p>
                <p>The process was deliberately iterative and inclusive. Every insight was tested against the lived reality of learners, every dimension refined through dialogue. The goal was never a single answer, but to open a multiplicity of possible futures — and equip others with the tools to imagine their own.</p>
             </div>
             <div>
              <blockquote className="border-l-4 border-[#d92231] pl-6 space-y-4">
                <p className="font-serif italic text-xl text-gray-800 leading-snug">
                  &ldquo;According to the Bureau of Labor Statistics, the average worker today stays at each of his or her jobs for 4.4 years, but the expected tenure of the workforce&apos;s youngest employees is about half that.&rdquo;
                </p>
                <footer className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-2 block leading-[1.6]">
                  &mdash; Jeanne Meister, &ldquo;Job Hopping Is the &lsquo;New Normal&apos; for Millennials,&rdquo; Forbes, 2012
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </ParallaxSection>

      {/* Context 3-1-1-1 */}
      <ParallaxSection section={SECTIONS[3]}>
        <div className="space-y-12">
          <h2 className="text-3xl font-bold max-w-2xl text-gray-900 leading-tight">An invitation to travel through time</h2>
          <div className="grid md:grid-cols-2 gap-16">
             <div className="space-y-6 text-gray-600 leading-relaxed max-w-lg text-sm md:text-base">
                <p>The project culminated in an experiential exhibit entitled &ldquo;Artemis 2100&rdquo; — a first-of-its-kind immersive event that dissolved the boundaries between physical and virtual attendance. To foster an exploratory mindset, the event was staged as a time-travel journey. The community traveled to the distant future — landing at the moment when the University of Artemis was looking back at paradigm shifts that &ldquo;happened&rdquo; around 2100.</p>
                <p>These shifts were shared as dimensions — not predictions, nor prescriptions, but invitations to stretch the imagination and catalyze conversation. We invite you to travel with us, explore these possible futures, and then use the tools on this site to spark your own experiments.</p>
             </div>
             <div>
              <blockquote className="border-l-4 border-[#461e68] pl-6 space-y-4">
                <p className="font-serif italic text-2xl text-gray-800 leading-snug">
                  &ldquo;The purpose of a liberal education is &lsquo;preparation for appointments not yet made.&rsquo;&rdquo;
                </p>
                <footer className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-2 block leading-[1.6]">
                  &mdash; Howard Swearer, former President of Brown University
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </ParallaxSection>

      {/* Context 4 */}
      <ParallaxSection section={SECTIONS[4]}>
        <div className="space-y-12">
          <h2 className="text-3xl font-bold max-w-2xl text-gray-900 leading-tight">The Grand Transition</h2>
          <div className="space-y-6 text-gray-600 leading-relaxed max-w-lg text-sm md:text-base">
            <p>Humanity has undergone two macro-transformations in its history. Currently, we are entering the Planetary Phase of Civilization — characterized by globalization and an urgent need for sustainability. Conventional Worlds represent incremental adjustments. Barbarization describes calamitous decline. And then there are the Great Transitions — progressive transformations that reimagine the very foundations of civilization, where education becomes a force for human flourishing at planetary scale.</p>
          </div>
          
          <div className="w-full aspect-video bg-gray-200 relative group cursor-pointer overflow-hidden border border-gray-300 max-w-4xl">
              <img
                src="https://images.pexels.com/photos/5940713/pexels-photo-5940713.jpeg?auto=compress&cs=tinysrgb&w=2000"
                alt="Artemis 2100 Experience"
                className="w-full h-full object-cover filter grayscale opacity-70 group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-black/60 rounded flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-black/80 transition-colors">
                    <Play className="w-8 h-8 ml-1" />
                </div>
              </div>
          </div>

          <hr className="border-t border-gray-200 !my-16" />

          <div className="space-y-6 text-gray-600 leading-relaxed max-w-lg text-sm md:text-base">
            <h3 className="font-bold text-xl text-gray-900">Your time to travel</h3>
            <p>Now it&apos;s your turn! Be pulled back into history before launching into the future. Hear the moments that made the University of Artemis what it is today and listen for the moments that will make it to tomorrow.</p>
            <p className="italic">Headphones recommended</p>
            <div className="bg-[#171717] w-full p-4 flex items-center gap-4 text-white border-l-4 border-white mt-4 max-w-sm">
                <Play fill="currentColor" className="w-5 h-5 text-white cursor-pointer hover:opacity-80" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Time Machine</span>
                </div>
                <span className="text-xs text-gray-400 cursor-pointer hover:text-white transition-colors ml-auto uppercase font-bold tracking-wider">Download</span>
            </div>
          </div>
        </div>
      </ParallaxSection>

      {/* Fast Forward */}
      <section id={SECTIONS[5].id} className="relative w-full overflow-hidden">
        <div className="max-w-[1600px] mx-auto">
          <div style={{ clipPath: "inset(0 0 0 0)" }} className="relative w-full min-h-[50vh] md:min-h-[70vh] flex flex-col items-center justify-center text-center overflow-hidden bg-gray-900">
            <img
              src={SECTIONS[5].img}
              alt={SECTIONS[5].title}
              className="fixed top-0 left-0 w-[100vw] h-[100vh] object-[center_20%] object-cover pointer-events-none -z-10 opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40 pointer-events-none -z-10" />
            <div className="relative z-10 p-6 md:p-12 w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-[0.10em] drop-shadow-md">
                {SECTIONS[5].title}
              </h2>
              <p className="text-xl md:text-2xl font-serif text-gray-100 italic drop-shadow-md">
                {SECTIONS[5].desc}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white w-full relative z-20">
          <div className="max-w-[1400px] mx-auto w-full px-5 sm:px-8 lg:px-20 py-16 lg:py-24">
            <div className="space-y-12">
              <h2 className="text-3xl font-bold text-gray-900 border-b pb-2 w-fit italic">Choose a future to explore.</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8 w-full font-serif text-white">
                <button onClick={() => goTo('open-loop-learning')} className="relative group block aspect-square bg-gray-900 overflow-hidden cursor-pointer">
                   <img src="https://images.pexels.com/photos/6147082/pexels-photo-6147082.jpeg?auto=compress&cs=tinysrgb&w=800" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity transform group-hover:scale-105 duration-700" alt="Infinite Learning Continuum" />
                   <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                      <span className="text-sm md:text-base font-bold italic tracking-wide">Infinite Learning<br/>Continuum</span>
                   </div>
                </button>
                <button onClick={() => goTo('adaptive-paced-learning')} className="relative group block aspect-square bg-gray-900 overflow-hidden cursor-pointer">
                   <img src="https://images.pexels.com/photos/6238029/pexels-photo-6238029.jpeg?auto=compress&cs=tinysrgb&w=800" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity transform group-hover:scale-105 duration-700" alt="Adaptive Paced Learning" />
                   <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                      <span className="text-sm md:text-base font-bold italic tracking-wide">Adaptive Paced<br/>Learning</span>
                   </div>
                </button>
                <button onClick={() => goTo('global-skills-matrix')} className="relative group block aspect-square bg-gray-900 overflow-hidden cursor-pointer">
                   <img src="https://images.pexels.com/photos/6147082/pexels-photo-6147082.jpeg?auto=compress&cs=tinysrgb&w=800" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity transform group-hover:scale-105 duration-700" alt="SkillPrints" />
                   <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                      <span className="text-sm md:text-base font-bold italic tracking-wide">SkillPrints</span>
                   </div>
                </button>
                <button onClick={() => goTo('purpose-learning')} className="relative group block aspect-square bg-gray-900 overflow-hidden cursor-pointer">
                   <img src="https://images.pexels.com/photos/6646916/pexels-photo-6646916.jpeg?auto=compress&cs=tinysrgb&w=800" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity transform group-hover:scale-105 duration-700" alt="The Artemis Oath" />
                   <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                      <span className="text-sm md:text-base font-bold italic tracking-wide">The Artemis<br/>Oath</span>
                   </div>
                </button>
                <button onClick={() => goTo('centers-of-inquiry')} className="relative group block aspect-square bg-gray-900 overflow-hidden cursor-pointer">
                   <img src="https://images.pexels.com/photos/5940844/pexels-photo-5940844.jpeg?auto=compress&cs=tinysrgb&w=800" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity transform group-hover:scale-105 duration-700" alt="Centers of Inquiry" />
                   <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                      <span className="text-sm md:text-base font-bold italic tracking-wide">Centers of<br/>Inquiry</span>
                   </div>
                </button>
                <button onClick={() => goTo('darwin-voyage')} className="relative group block aspect-square bg-gray-900 overflow-hidden cursor-pointer">
                   <img src="https://images.pexels.com/photos/36622095/pexels-photo-36622095.jpeg?auto=compress&cs=tinysrgb&w=800" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity transform group-hover:scale-105 duration-700" alt="The World as Campus" />
                   <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                      <span className="text-sm md:text-base font-bold italic tracking-wide">The World as<br/>Campus</span>
                   </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

function ParallaxSection({ section, children }: { section: typeof SECTIONS[0]; children: React.ReactNode }) {
  return (
    <section id={section.id} className="relative w-full overflow-hidden bg-white">
      <div className="max-w-[1600px] mx-auto">
        <div
          className="relative w-full min-h-[60vh] md:min-h-[80vh] flex flex-col items-center justify-center text-center overflow-hidden bg-gray-900"
          style={{ clipPath: "inset(0 0 0 0)" }}
        >
          <img
            src={section.img}
            alt={section.title}
            className="fixed top-0 left-0 w-[100vw] h-[100vh] object-cover pointer-events-none -z-10 opacity-70"
          />
          <div className="absolute inset-0 bg-black/40 pointer-events-none -z-10" />
          {/* Top gradient for fixed navbar */}
          <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/50 to-transparent pointer-events-none -z-10" />
          <div className="relative z-10 p-6 md:p-12 w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 space-y-4 pt-24 pb-12">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-[0.10em] uppercase drop-shadow-lg">
              {section.title}
            </h2>
            {section.desc && (
              <p className="text-xl md:text-3xl font-serif text-gray-200 mt-6 italic drop-shadow-md">
                {section.desc}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white w-full relative z-20">
        <div className="max-w-[1400px] mx-auto w-full px-5 sm:px-8 lg:px-20 py-16 lg:py-24">
          {children}
        </div>
      </div>
    </section>
  );
}
