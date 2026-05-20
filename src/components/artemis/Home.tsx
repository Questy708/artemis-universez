'use client';

import { useEffect, useRef } from 'react';
import { heroContent, blogArticles } from '@/lib/artemis-data';
import ArtemisMap from '@/components/artemis/ArtemisMap';
import SubPageFooter from '@/components/artemis/SubPageFooter';

interface HomeProps {
  goToPage: (page: string, program?: string) => void;
}

/* ─── Hook: animate on scroll — DOM-only, no state in render ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Make visible by default (in case JS loads after paint)
    el.setAttribute('data-visible', 'true');
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.setAttribute('data-visible', 'true');
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return ref;
}

export default function Home({ goToPage }: HomeProps) {
  const heroAnim = useInView(0.1);
  const articlesAnim = useInView(0.1);
  const acnAnim = useInView(0.1);
  const statsAnim = useInView(0.1);
  const parallaxAnim = useInView(0.1);
  const mapAnim = useInView(0.1);
  const numberedAnim = useInView(0.1);

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto">
      {/* ── Inline keyframes for scroll-triggered animations ── */}
      <style>{`
        .artemis-section {
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .artemis-section[data-visible="false"] {
          opacity: 0;
          transform: translateY(2rem);
        }
        .artemis-section[data-visible="true"] {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* ═══════════════════════════════════════════
          1. HERO — Full-bleed with gradient overlay
          ═══════════════════════════════════════════ */}
      <section className="relative w-full h-[55vh] sm:h-[65vh] min-h-[400px] sm:min-h-[480px] overflow-hidden">
        <img
          src={heroContent.image}
          alt="Artemis Expedition"
          className="absolute inset-0 w-full h-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        {/* Top gradient for fixed navbar */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col justify-end h-full max-w-[1000px] mx-auto w-full px-6 lg:px-16 pb-10 sm:pb-16">
          <div
            ref={heroAnim}
            className="transition-all duration-700 artemis-section"
          >
            {/* Red line accent + label */}
            <div className="mb-8 flex items-center space-x-3">
              <span className="w-8 h-[1px] bg-[#8A0000]"></span>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#8A0000]">The Artemis Project</span>
            </div>

            <h1 className="text-[36px] sm:text-[44px] md:text-[56px] font-extrabold leading-[1.05] tracking-tighter text-white mb-6">
              A new kind of university —<br />one degree, every horizon.
            </h1>
            <p className="text-[15px] sm:text-[18px] text-white/70 max-w-xl leading-relaxed font-light mb-8">
              Founded to make rigorous, world-class education more accessible, recognizable, and transferable, the University of Artemis pioneers a global collegiate model — uniting 50 colleges across 35 countries under one accredited institution and one degree.
            </p>
            <div className="flex items-center space-x-5 text-[11px] font-bold text-white/50 uppercase tracking-widest">
              <span>Apr 25, 2026</span>
              <button
                onClick={() => goToPage('research')}
                className="text-white border-b border-white hover:opacity-80 transition-opacity"
                suppressHydrationWarning
              >
                FULL STORY
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. FROM THE JOURNAL — Featured blog articles
          ═══════════════════════════════════════════ */}
      <section className="py-20 px-6 lg:px-16">
        <div className="max-w-[1000px] mx-auto">
          <div
            ref={articlesAnim}
            className="transition-all duration-700 artemis-section"
          >
            {/* Section divider */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-[1px] bg-[#8A0000]"></span>
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#8A0000]">
                  From the Journal
                </span>
              </div>
              <button
                onClick={() => goToPage('blog')}
                className="text-[11px] font-bold uppercase tracking-widest text-[#8A0000] border-b border-[#8A0000] hover:text-black hover:border-black transition-colors"
                suppressHydrationWarning
              >
                All Stories
              </button>
            </div>

            {/* Featured story — full width */}
            <div
              className="group cursor-pointer mb-12"
              onClick={() => goToPage('blog_article', blogArticles[0].slug)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="aspect-[16/10] bg-gray-100 overflow-hidden shadow-sm">
                  <img
                    src={blogArticles[0].image}
                    alt={blogArticles[0].title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[9px] font-bold uppercase tracking-widest bg-[#8A0000] text-white px-2 py-0.5">
                      {blogArticles[0].category}
                    </span>
                    <span className="text-[11px] text-gray-400">{blogArticles[0].date}</span>
                    {blogArticles[0].readTime && (
                      <span className="text-[11px] text-gray-400">| {blogArticles[0].readTime}</span>
                    )}
                  </div>
                  <h3 className="text-[24px] md:text-[28px] font-extrabold mb-3 group-hover:text-[#8A0000] text-gray-900 leading-tight transition-colors">
                    {blogArticles[0].title}
                  </h3>
                  <p className="text-gray-600 text-[15px] leading-relaxed line-clamp-3">
                    {blogArticles[0].summary}
                  </p>
                </div>
              </div>
            </div>

            {/* 2-column grid for next 2 stories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-12">
              {blogArticles.slice(1, 3).map((article) => (
                <article
                  key={article.id}
                  className="cursor-pointer group"
                  onClick={() => goToPage('blog_article', article.slug)}
                >
                  <div className="w-full mb-5 overflow-hidden bg-gray-100 shadow-sm aspect-[16/10]">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
                    />
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 ${
                      article.category === 'Campaign' ? 'bg-[#8A0000] text-white' :
                      article.category === 'Research' ? 'bg-gray-900 text-white' :
                      article.category === 'Innovation' ? 'bg-gray-800 text-white' :
                      'bg-[#8A0000]/10 text-[#8A0000]'
                    }`}>
                      {article.category}
                    </span>
                    <span className="text-[11px] text-gray-400">{article.date}</span>
                    {article.readTime && (
                      <span className="text-[11px] text-gray-400">| {article.readTime}</span>
                    )}
                  </div>
                  <h3 className="text-[20px] font-bold mb-2 group-hover:text-[#8A0000] text-gray-900 leading-tight transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-[14px] leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. GLOBAL LEARNING INTERFACE — ACN Section
          ═══════════════════════════════════════════ */}

      {/* Section divider */}
      <div className="max-w-[1000px] mx-auto w-full px-6 lg:px-16">
        <div className="relative flex items-center mb-0">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 text-[12px] font-bold uppercase tracking-[0.2em] text-gray-500">Global Learning Interface</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>
      </div>

      {/* ACN Description + Stats */}
      <section className="py-20 px-6 lg:px-16">
        <div className="max-w-[1000px] mx-auto">
          <div
            ref={acnAnim}
            className="transition-all duration-700 artemis-section"
          >
            <div className="max-w-5xl mb-16">
              {/* Red line accent + label */}
              <div className="mb-8 flex items-center space-x-3">
                <span className="w-8 h-[1px] bg-[#8A0000]"></span>
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#8A0000]">Consortium Infrastructure</span>
              </div>

              <h2 className="text-[34px] sm:text-[42px] md:text-[54px] font-bold text-[#141414] leading-[1] mb-12 tracking-tighter">
                A federated alliance of autonomous colleges co-creating{' '}
                <span className="text-[#8A0000]">shared academic scaffolds.</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                <p className="text-[20px] text-gray-700 leading-relaxed font-normal">
                  The Artemis Collegium Network (ACN) operates as a distributed guild system. Instead of isolated campuses, we maintain a network of co-branded nodes where faculty, students, and research are perfectly synchronized across physical and virtual domains.
                </p>
                <div className="grid grid-cols-2 gap-8 pt-2">
                  <div className="relative">
                    <div className="text-[28px] sm:text-[36px] font-black text-[#141414] leading-none mb-3 tabular-nums">
                      20
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#8A0000] leading-tight">
                      Founding
                      <br />
                      Micro-Colleges
                    </div>
                    <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-gray-100"></div>
                  </div>
                  <div className="relative">
                    <div className="text-[28px] sm:text-[36px] font-black text-[#141414] leading-none mb-3 tabular-nums">
                      ECTS
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#8A0000] leading-tight">
                      Unified
                      <br />
                      Credit Mapping
                    </div>
                    <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-gray-100"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats — Prominent gray-50 background section */}
      <section className="bg-gray-50 py-20 px-6 lg:px-16">
        <div className="max-w-[1000px] mx-auto">
          <div
            ref={statsAnim}
            className="transition-all duration-700 artemis-section"
          >
            <div className="mb-8 flex items-center space-x-3">
              <span className="w-8 h-[1px] bg-[#8A0000]"></span>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#8A0000]">By the Numbers</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="text-[32px] sm:text-[42px] font-black text-[#141414] leading-none mb-3 tabular-nums">20</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#8A0000] leading-tight mb-1">Founding Micro-Colleges</div>
                <div className="text-[12px] text-gray-500 leading-snug">Active nodes worldwide</div>
              </div>
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="text-[32px] sm:text-[42px] font-black text-[#141414] leading-none mb-3 tabular-nums">ECTS</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#8A0000] leading-tight mb-1">Unified Credit Mapping</div>
                <div className="text-[12px] text-gray-500 leading-snug">Fully transferable across nodes</div>
              </div>
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="text-[32px] sm:text-[42px] font-black text-[#141414] leading-none mb-3 tabular-nums">6</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#8A0000] leading-tight mb-1">Continents</div>
                <div className="text-[12px] text-gray-500 leading-snug">Spanning every time zone</div>
              </div>
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="text-[32px] sm:text-[42px] font-black text-[#141414] leading-none mb-3 tabular-nums">1</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#8A0000] leading-tight mb-1">Accredited Degree</div>
                <div className="text-[12px] text-gray-500 leading-snug">Recognised globally</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Card-and-image parallax section before the map */}
      <section className="py-20 px-6 lg:px-16">
        <div className="max-w-[1000px] mx-auto">
          <div
            ref={parallaxAnim}
            className="transition-all duration-700 artemis-section"
          >
            <div className="relative w-full min-h-[380px] md:min-h-[460px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1624555130296-e551faf8969b?auto=format&fit=crop&q=80&w=1400"
                alt="Artemis Global Campus"
                className="absolute inset-0 w-full h-full object-cover grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
              <div className="relative z-10 flex items-end h-full min-h-[380px] md:min-h-[460px] p-5 sm:p-8 md:p-14">
                <div className="bg-white max-w-sm p-5 sm:p-8 shadow-xl">
                  <div className="text-[10px] font-bold text-[#8A0000] tracking-widest mb-3 uppercase">
                    Global Network
                  </div>
                  <h3 className="text-[24px] font-bold text-[#141414] mb-3 leading-tight">
                    One university, every horizon
                  </h3>
                  <p className="text-[14px] text-gray-600 leading-relaxed mb-5">
                    The Artemis Collegium Network spans six continents, synchronizing faculty, students, and research across physical and virtual domains — a single accredited institution with the reach of a constellation.
                  </p>
                  <button
                    onClick={() => goToPage('collegium-alliance')}
                    className="text-[11px] font-bold uppercase tracking-widest border-b-2 border-[#8A0000] text-[#8A0000] pb-1 hover:text-black hover:border-black transition-colors"
                    suppressHydrationWarning
                  >
                    Explore the Network →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="pb-20 px-6 lg:px-16">
        <div className="max-w-[1000px] mx-auto">
          <div
            ref={mapAnim}
            className="transition-all duration-700 artemis-section"
          >
            <ArtemisMap />
          </div>
        </div>
      </section>

      {/* Numbered items: Contribution + Infrastructure */}
      <section className="bg-gray-50 py-20 px-6 lg:px-16">
        <div className="max-w-[1000px] mx-auto">
          <div
            ref={numberedAnim}
            className="transition-all duration-700 artemis-section"
          >
            <div className="max-w-4xl space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="group">
                  <div className="text-[10px] font-bold text-[#8A0000] tracking-widest mb-4">
                    01 — CONTRIBUTION
                  </div>
                  <h4 className="text-[18px] font-bold text-[#141414] mb-3 uppercase tracking-wide">
                    Node Contribution Model
                  </h4>
                  <p className="text-[15px] text-gray-600 leading-relaxed">
                    Member colleges contribute faculty and student cohorts to the collective pool, ensuring localized curriculum grounded in global standards.
                  </p>
                </div>

                <div className="group">
                  <div className="text-[10px] font-bold text-[#8A0000] tracking-widest mb-4">
                    02 — INFRASTRUCTURE
                  </div>
                  <h4 className="text-[18px] font-bold text-[#141414] mb-3 uppercase tracking-wide">
                    Infrastructure Shield
                  </h4>
                  <p className="text-[15px] text-gray-600 leading-relaxed">
                    Artemis provides a unified <strong>Guild system</strong>, student funding, and the{' '}
                    <strong>Artemis Commons</strong> for global research publishing.
                  </p>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => goToPage('collegium-alliance')}
                  className="flex items-center space-x-6 py-3 border-b-2 border-[#8A0000] text-[#8A0000] text-[14px] font-bold uppercase tracking-[0.2em] hover:text-black hover:border-black transition-all group"
                  suppressHydrationWarning
                >
                  <span>Build with the Alliance</span>
                  <svg
                    className="group-hover:translate-x-2 transition-transform"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          UPCOMING EVENTS CALENDAR
          ═══════════════════════════════════════════ */}
      <section className="py-20 px-6 lg:px-16">
        <div className="max-w-[1000px] mx-auto">
          {/* Section divider */}
          <div className="relative flex items-center mb-16">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 text-[12px] font-bold uppercase tracking-[0.2em] text-gray-500">Upcoming Events</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            {/* Left — Heading + CTA */}
            <div className="md:col-span-5">
              <div className="mb-6 flex items-center space-x-3">
                <span className="w-8 h-[1px] bg-[#8A0000]"></span>
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#8A0000]">Calendar</span>
              </div>
              <h2 className="text-[30px] sm:text-[36px] md:text-[42px] font-extrabold leading-[1.05] tracking-tighter text-[#141414] mb-6">
                What's happening<br />at Artemis
              </h2>
              <p className="text-[16px] text-gray-600 leading-relaxed mb-8">
                From public lectures and research symposia to cultural festivals and open days, the Artemis network is always alive with events that bring our global community together.
              </p>
              <button
                onClick={() => goToPage('campus')}
                className="flex items-center space-x-4 py-3 border-b-2 border-[#8A0000] text-[#8A0000] text-[13px] font-bold uppercase tracking-[0.2em] hover:text-black hover:border-black transition-all group"
                suppressHydrationWarning
              >
                <span>Full Events Calendar</span>
                <svg className="group-hover:translate-x-2 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>

            {/* Right — Event cards */}
            <div className="md:col-span-7 space-y-0">
              {[
                {
                  date: 'May 18',
                  weekday: 'Sun',
                  title: 'Open Day: Malta Central Node',
                  desc: 'Tour the Valletta campus, meet faculty from all seven schools, and experience a live co-design session with current students.',
                  tag: 'Open Day',
                  page: 'campus',
                },
                {
                  date: 'May 25',
                  weekday: 'Sun',
                  title: 'The Synthetic Humanity Symposium',
                  desc: 'Leading researchers from the Center for Synthetic Intelligence present findings from the first year of the Symbiotic Cognition Initiative.',
                  tag: 'Symposium',
                  page: 'research',
                },
                {
                  date: 'Jun 2',
                  weekday: 'Mon',
                  title: 'Artemis Global Hackathon',
                  desc: 'A 72-hour cross-node challenge where students from all 20 micro-colleges collaborate to prototype solutions to real-world problems.',
                  tag: 'Competition',
                  page: 'innovation',
                },
                {
                  date: 'Jun 14',
                  weekday: 'Sat',
                  title: 'Bio-Regenerative Arts Exhibition',
                  desc: 'An immersive showcase of living tissue sculptures, self-healing architecture models, and bio-engineered materials from our Berlin hub.',
                  tag: 'Exhibition',
                  page: 'research',
                },
                {
                  date: 'Jun 28',
                  weekday: 'Sat',
                  title: 'Commencement Ceremony 2026',
                  desc: 'The Artemis Class of 2026 presents their capstone contributions and receives degrees at the annual global commencement, streamed live from Malta.',
                  tag: 'Ceremony',
                  page: 'education',
                },
              ].map((event, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(event.page)}
                  className="group w-full flex items-start gap-6 py-5 border-b border-gray-200 hover:border-[#8A0000] transition-colors text-left"
                  suppressHydrationWarning
                >
                  {/* Date block */}
                  <div className="shrink-0 w-[60px] text-center pt-1">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#8A0000] mb-1">{event.weekday}</div>
                    <div className="text-[22px] font-black text-[#141414] leading-none tabular-nums">{event.date.split(' ')[1]}</div>
                    <div className="text-[11px] font-bold text-gray-400 uppercase">{event.date.split(' ')[0]}</div>
                  </div>

                  {/* Event details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A0000]">{event.tag}</span>
                    </div>
                    <h4 className="text-[16px] font-bold text-[#141414] group-hover:text-[#8A0000] transition-colors leading-tight mb-1">
                      {event.title}
                    </h4>
                    <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2">
                      {event.desc}
                    </p>
                  </div>

                  {/* Arrow */}
                  <svg className="shrink-0 w-4 h-4 text-gray-300 group-hover:text-[#8A0000] group-hover:translate-x-1 transition-all mt-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Transition into footer ── */}
      <div className="relative h-24 bg-gradient-to-b from-white via-gray-100 to-[#0a0a0a]" />

      {/* Footer — consistent with all other pages */}
      <SubPageFooter goToPage={goToPage} />
    </div>
  );
}
