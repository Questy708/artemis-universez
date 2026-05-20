'use client';

interface FooterProps {
  goToPage: (page: string) => void;
}

export default function SubPageFooter({ goToPage }: FooterProps) {
  const mainLinks = [
    { label: 'Education', page: 'education' },
    { label: 'Research', page: 'research' },
    { label: 'Innovation', page: 'innovation' },
    { label: 'Admissions + Aid', page: 'admissions' },
    { label: 'Campus Life', page: 'campus' },
    { label: 'Colleges', page: 'colleges' },
    { label: 'About', page: 'about' },
    { label: 'Journal', page: 'blog' },
  ];

  const quickLinks = [
    { label: 'Visit', page: 'visit-us' },
    { label: 'Events', page: 'campus' },
    { label: 'People', page: 'our-people' },
    { label: 'Jobs', page: 'jobs' },
    { label: 'Contact', page: 'contact-us' },
  ];

  const legalLinks = [
    { label: 'Privacy', page: 'policies' },
    { label: 'Accessibility', page: 'access-at-artemis' },
    { label: 'Sustainability', page: 'sustainability' },
  ];

  const socialLinks = [
    { label: 'X', href: 'https://x.com/artemisuni' },
    { label: 'Facebook', href: 'https://facebook.com/artemisuni' },
    { label: 'LinkedIn', href: 'https://linkedin.com/school/artemisuni' },
    { label: 'Instagram', href: 'https://instagram.com/artemisuni' },
  ];

  return (
    <footer className="bg-[#0a0a0a] text-white w-full shrink-0">
      <div className="max-w-[1400px] mx-auto w-full px-5 sm:px-8 lg:px-20">

        {/* ── Top: Logo + tagline + CTAs ── */}
        <div className="pt-14 pb-10 border-b border-white/[0.07] flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <div className="flex items-center gap-3.5 mb-4">
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 3L4 9V19.5C4 28.5 11 35.5 20 37.5C29 35.5 36 28.5 36 19.5V9L20 3Z" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none"/>
                <path d="M20 5.5L6.5 10.8V19.5C6.5 27.2 12.4 33.2 20 35C27.6 33.2 33.5 27.2 33.5 19.5V10.8L20 5.5Z" fill="rgba(255,255,255,0.03)"/>
                <path d="M20 11L14 24H16.5L17.8 20.8H22.2L23.5 24H26L20 11ZM18.6 18.8L20 14.8L21.4 18.8H18.6Z" fill="rgba(255,255,255,0.35)"/>
                <line x1="12" y1="28" x2="28" y2="28" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
                <circle cx="15" cy="30.5" r="0.8" fill="rgba(255,255,255,0.15)"/>
                <circle cx="20" cy="30.5" r="0.8" fill="rgba(255,255,255,0.15)"/>
                <circle cx="25" cy="30.5" r="0.8" fill="rgba(255,255,255,0.15)"/>
              </svg>
              <div className="leading-[1.1]">
                <div className="text-[11px] font-medium tracking-tight text-white/40">University of</div>
                <div className="text-[16px] font-bold tracking-tight text-white/75">Artemis</div>
              </div>
            </div>
            <p className="text-[13px] text-white/20 max-w-xs leading-relaxed">
              A global collegiate university reimagining higher education for the 21st century and beyond.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => goToPage('fundraising')}
              className="border border-white/15 text-white/50 px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] hover:border-[#8A0000] hover:text-[#8A0000] transition-all duration-300 cursor-pointer"
            >
              Give to Artemis
            </button>
            <button
              onClick={() => goToPage('apply')}
              className="bg-[#8A0000] text-white px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-[#6B0000] transition-colors duration-300 cursor-pointer"
            >
              Apply
            </button>
          </div>
        </div>

        {/* ── Middle: Navigation grid ── */}
        <div className="py-10 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-x-6 gap-y-5">
          {mainLinks.map((link, i) => (
            <button
              key={link.page}
              onClick={() => goToPage(link.page)}
              className="group cursor-pointer text-left"
            >
              <div className="text-[9px] font-mono text-white/10 mb-1.5 group-hover:text-[#8A0000]/60 transition-colors duration-300">0{i + 1}</div>
              <div className="text-[12px] text-white/30 group-hover:text-white/75 transition-colors duration-300 leading-tight font-medium">{link.label}</div>
            </button>
          ))}
        </div>

        {/* ── Quick links + Social + Legal ── */}
        <div className="py-7 border-t border-white/[0.04] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {quickLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => goToPage(link.page)}
                className="text-[11px] text-white/20 hover:text-white/55 transition-colors duration-300 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <span className="text-white/[0.06]">|</span>
            {legalLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => goToPage(link.page)}
                className="text-[11px] text-white/20 hover:text-white/55 transition-colors duration-300 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Social */}
          <div className="flex items-center gap-5 text-[11px] text-white/15">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/50 transition-colors duration-300"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>

        {/* ── Experimental: Artemis Project ── */}
        <div className="py-5 border-t border-white/[0.04] flex items-center justify-between">
          <button
            onClick={() => goToPage('artemis-project')}
            className="flex items-center gap-2.5 text-[10px] text-white/15 hover:text-white/50 transition-colors duration-300 cursor-pointer group"
          >
            <span className="w-5 h-5 rounded border border-white/[0.08] group-hover:border-white/20 flex items-center justify-center text-[8px] font-bold font-mono transition-colors duration-300">AP</span>
            <span className="uppercase tracking-[0.2em] font-mono">Artemis Project</span>
            <span className="text-[8px] text-white/[0.06] group-hover:text-white/25 ml-1 uppercase tracking-wider transition-colors duration-300">Experimental</span>
          </button>
        </div>

        {/* ── Bottom: Copyright ── */}
        <div className="py-6 border-t border-white/[0.04] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-[10px] text-white/10">&copy; {new Date().getFullYear()} University of Artemis. All rights reserved.</p>
          <p className="text-[10px] text-white/[0.06] font-mono uppercase tracking-[0.2em]">Artemis Collegium &middot; Global</p>
        </div>
      </div>
    </footer>
  );
}
