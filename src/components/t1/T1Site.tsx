'use client';

import React, { useState } from 'react';
import { NavBar, Footer } from './Shared';
import HomePage from './pages/HomePage';
import OpenLoopPage from './pages/OpenLoopPage';
import PacedEducationPage from './pages/PacedEducationPage';
import AxisFlipPage from './pages/AxisFlipPage';
import PurposeLearningPage from './pages/PurposeLearningPage';
import CentersOfInquiryPage from './pages/CentersOfInquiryPage';
import DarwinVoyagePage from './pages/DarwinVoyagePage';
import BuildPage from './pages/BuildPage';
import AboutPage from './pages/AboutPage';

interface T1SiteProps {
  onExit: () => void;
}

function T1PageContent({ page, goTo }: { page: string; goTo: (p: string) => void }) {
  switch (page) {
    case 'open-loop-learning':
      return <OpenLoopPage goTo={goTo} />;
    case 'adaptive-paced-learning':
      return <PacedEducationPage goTo={goTo} />;
    case 'global-skills-matrix':
      return <AxisFlipPage goTo={goTo} />;
    case 'purpose-learning':
      return <PurposeLearningPage goTo={goTo} />;
    case 'centers-of-inquiry':
      return <CentersOfInquiryPage goTo={goTo} />;
    case 'darwin-voyage':
      return <DarwinVoyagePage goTo={goTo} />;
    case 'build':
      return <BuildPage goTo={goTo} />;
    case 'about':
      return <AboutPage goTo={goTo} />;
    case 'home':
    default:
      return <HomePage goTo={goTo} />;
  }
}

export default function T1Site({ onExit }: T1SiteProps) {
  const [activePage, setActivePage] = useState('home');

  const goTo = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <NavBar currentPage={activePage} goTo={goTo} onExit={onExit} />
      <div className="pt-14 flex-1">
        <T1PageContent page={activePage} goTo={goTo} />
      </div>
      <Footer />
    </div>
  );
}
