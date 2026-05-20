'use client';

import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  goHome: () => void;
  goToPage: (page: string) => void;
  /** When true, hide the desktop sidebar column (subpages); mobile drawer still works */
  hideDesktopSidebar?: boolean;
  /** Callback to open the global search overlay */
  onSearchClick?: () => void;
}

export default function Sidebar({ isOpen, onClose, goHome, goToPage, hideDesktopSidebar, onSearchClick }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const sidebarContent = (
    <>
      <div className="flex-1 px-8 lg:px-10 py-12 overflow-y-auto">
        <div className="lg:hidden flex items-center justify-between mb-8">
           <span className="font-bold tracking-tighter text-[#8A0000]">MENU</span>
           <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded text-gray-500" suppressHydrationWarning><X size={20}/></button>
        </div>

        {/* ── Mobile Section Navigation ── */}
        <div className="lg:hidden mb-8 border-b border-gray-100 pb-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8A0000] mb-3">Navigate</h3>
          <nav className="space-y-0">
            {[
              { label: 'Education', page: 'education' },
              { label: 'Research', page: 'research' },
              { label: 'Innovation', page: 'innovation' },
              { label: 'Admissions + Aid', page: 'admissions' },
              { label: 'Campus Life', page: 'campus' },
              { label: 'Colleges', page: 'colleges' },
              { label: 'About Artemis', page: 'about' },
              { label: 'Blog', page: 'blog' },
              { label: 'Artemis 2100', page: 'artemis-2100' },
              { label: 'Artemis Project', page: 'artemis-project' },
              { label: 'Stanford 2025 (T1)', page: 't1' },
            ].map((item) => (
              <button
                key={item.page}
                onClick={() => { goToPage(item.page); onClose?.(); }}
                className="block w-full text-left text-[15px] font-bold text-[#141414] py-2.5 hover:text-[#8A0000] hover:pl-1 transition-all"
                suppressHydrationWarning
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => { goToPage('fundraising'); onClose?.(); }}
              className="flex-1 py-2.5 border border-[#8A0000] text-[#8A0000] text-[12px] font-bold uppercase tracking-wider hover:bg-[#8A0000] hover:text-white transition-colors text-center"
              suppressHydrationWarning
            >
              Give
            </button>
            <button
              onClick={() => { goToPage('apply'); onClose?.(); }}
              className="flex-1 py-2.5 bg-[#8A0000] text-white text-[12px] font-bold uppercase tracking-wider hover:bg-[#6B0000] transition-colors text-center"
              suppressHydrationWarning
            >
              Apply
            </button>
          </div>
        </div>

        {/* ── Search — opens the global SearchOverlay ── */}
        <div className="mb-10">
          <h3 className="text-[14px] font-bold mb-4">Explore websites, people, and locations</h3>
          <button
            onClick={() => { onSearchClick?.(); onClose?.(); }}
            className="w-full bg-[#F3F3F3] p-3 flex items-center focus-within:bg-white focus-within:ring-1 focus-within:ring-[#8A0000] transition-all text-left group"
            suppressHydrationWarning
          >
            <Search size={16} className="text-[#8A0000] mr-3 shrink-0" />
            <span className="text-[13px] text-gray-400 group-hover:text-gray-600 transition-colors">What are you looking for?</span>
            <kbd className="ml-auto text-[10px] font-bold text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded hidden sm:inline-block">⌘K</kbd>
          </button>
        </div>

        <div className="mb-10">
          <h3 className="text-[14px] font-bold mb-4 uppercase tracking-tight">Top resources for</h3>
          <ul className="text-[14px] space-y-3 font-medium">
            <li><button onClick={() => { goHome(); onClose?.(); }} className="side-link w-full text-left" suppressHydrationWarning>Prospective Students</button></li>
            <li><button onClick={() => { goToPage('education'); onClose?.(); }} className="side-link w-full text-left" suppressHydrationWarning>Current Students</button></li>
            <li><button onClick={() => { goToPage('our-people'); onClose?.(); }} className="side-link w-full text-left" suppressHydrationWarning>Faculty & Staff</button></li>
            <li><button onClick={() => { goToPage('the-university'); onClose?.(); }} className="side-link w-full text-left" suppressHydrationWarning>Alumni</button></li>
            <li><button onClick={() => { goToPage('campus'); onClose?.(); }} className="side-link w-full text-left" suppressHydrationWarning>Communities & Partners</button></li>
          </ul>
        </div>

        {/* ── Artemis Project Micro-App ── */}
        <div className="bg-[#0a0a0a] p-5 mb-6 group">
          <div className="flex items-center gap-3 mb-3">
            <div className="grid grid-cols-2 gap-[3px]">
              <div className="w-[6px] h-[6px] rounded-full bg-[#8A0000]" />
              <div className="w-[6px] h-[6px] rounded-full bg-[#8A0000]/70" />
              <div className="w-[6px] h-[6px] rounded-full bg-[#8A0000]/70" />
              <div className="w-[6px] h-[6px] rounded-full bg-[#8A0000]" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/90">Artemis Project</span>
          </div>
          <p className="text-[13px] text-white/50 leading-relaxed mb-4">Live seminars, real-time polls, breakout discussions, and AI-powered tutoring.</p>
          <button
            onClick={() => { goToPage('artemis-project'); onClose?.(); }}
            className="inline-flex items-center gap-2 h-9 px-5 rounded bg-[#8A0000] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#9B0F0F] active:scale-[0.98] transition-all shadow-lg shadow-[#8A0000]/20"
            suppressHydrationWarning
          >
            Enter the Forum
            <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </button>
        </div>

        <div className="bg-[#FFF5F5] border border-[#FFDADA] p-5 mb-10">
          <h4 className="text-[14px] font-bold border-b border-[#FFDADA] pb-2 mb-3">Artemis Manifesto</h4>
          <button onClick={() => { goToPage('the-university'); onClose?.(); }} className="text-[13px] leading-snug text-left hover:underline" suppressHydrationWarning>Read the 'The Artemis Project' - our mission to re-engineer human learning.</button>
        </div>

        <div className="mb-6">
          <button
            onClick={() => { goToPage('blog'); onClose?.(); }}
            className="flex items-center justify-between w-full py-3 border-t border-b border-gray-100 group"
            suppressHydrationWarning
          >
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#8A0000] mb-1">From the Blog</div>
              <span className="text-[13px] font-medium group-hover:text-[#8A0000] transition-colors">Latest stories & research</span>
            </div>
            <svg className="w-4 h-4 text-gray-300 group-hover:text-[#8A0000] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>

      {/* SIDEBAR FOOTER */}
      <div className="pb-10 border-t border-gray-100 pt-8 px-8 lg:px-10">
        <div className="flex items-center gap-2.5 mb-1">
          <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 3L4 9V19.5C4 28.5 11 35.5 20 37.5C29 35.5 36 28.5 36 19.5V9L20 3Z" stroke="#8A0000" strokeWidth="1.8" fill="none"/>
            <path d="M20 5.5L6.5 10.8V19.5C6.5 27.2 12.4 33.2 20 35C27.6 33.2 33.5 27.2 33.5 19.5V10.8L20 5.5Z" fill="rgba(138,0,0,0.06)"/>
            <path d="M20 11L14 24H16.5L17.8 20.8H22.2L23.5 24H26L20 11ZM18.6 18.8L20 14.8L21.4 18.8H18.6Z" fill="#8A0000"/>
            <line x1="12" y1="28" x2="28" y2="28" stroke="rgba(138,0,0,0.25)" strokeWidth="0.8"/>
            <circle cx="15" cy="30.5" r="0.8" fill="rgba(138,0,0,0.4)"/>
            <circle cx="20" cy="30.5" r="0.8" fill="rgba(138,0,0,0.4)"/>
            <circle cx="25" cy="30.5" r="0.8" fill="rgba(138,0,0,0.4)"/>
          </svg>
          <div className="leading-[1.1]">
            <span className="text-[11px] font-semibold tracking-tight text-gray-800">University of </span>
            <span className="text-[12px] font-bold tracking-tight text-gray-800">Artemis</span>
          </div>
        </div>
        <p className="text-[12px] text-gray-600 mb-4 leading-tight">A global collegiate model for the collective future of humanity.</p>

        <div className="text-[12px] space-x-2 mb-2 font-medium">
          <button onClick={() => goToPage('visit-us')} className="footer-link" suppressHydrationWarning>Visit</button>
          <button onClick={() => goToPage('campus')} className="footer-link" suppressHydrationWarning>Map</button>
          <button onClick={() => goToPage('blog')} className="footer-link" suppressHydrationWarning>Blog</button>
          <button onClick={() => goToPage('campus')} className="footer-link" suppressHydrationWarning>Events</button>
          <button onClick={() => goToPage('jobs')} className="footer-link" suppressHydrationWarning>Careers</button>
          <button onClick={() => goToPage('fundraising')} className="footer-link text-[#8A0000]" suppressHydrationWarning>Give</button>
          <button onClick={() => goToPage('contact-us')} className="footer-link" suppressHydrationWarning>Contact</button>
        </div>
        <div className="text-[12px] space-x-2 mb-2 font-medium">
          <button onClick={() => goToPage('policies')} className="footer-link" suppressHydrationWarning>Privacy</button>
          <button onClick={() => goToPage('access-at-artemis')} className="footer-link" suppressHydrationWarning>Accessibility</button>
        </div>
        <div className="text-[11px] space-x-2 mb-6 font-medium opacity-40">
          <button onClick={() => goToPage('admin')} className="footer-link" suppressHydrationWarning>Admin</button>
        </div>

        <div className="flex space-x-3 text-[11px] font-medium text-gray-400">
          <a href="https://x.com/artemisuni" target="_blank" rel="noopener noreferrer" className="hover:text-[#8A0000] transition-colors">X</a>
          <a href="https://facebook.com/artemisuni" target="_blank" rel="noopener noreferrer" className="hover:text-[#8A0000] transition-colors">Facebook</a>
          <a href="https://linkedin.com/school/artemisuni" target="_blank" rel="noopener noreferrer" className="hover:text-[#8A0000] transition-colors">LinkedIn</a>
          <a href="https://instagram.com/artemisuni" target="_blank" rel="noopener noreferrer" className="hover:text-[#8A0000] transition-colors">Instagram</a>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar — only on homepage (when desktopOnly is not set) */}
      {!hideDesktopSidebar && (
        <aside className="w-[330px] hidden lg:flex flex-col border-r border-gray-100 sticky top-[50px] h-[calc(100vh-50px)] shrink-0 overflow-hidden bg-white">
          {sidebarContent}
        </aside>
      )}

      {/* Mobile Drawer — available on all pages */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-[110] lg:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-[330px] bg-white z-[120] flex flex-col lg:hidden shadow-2xl"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
