'use client';

import { ArrowLeft } from 'lucide-react';

interface SplitLayoutProps {
  stepId: string;
  children: React.ReactNode;
  rightPanel: React.ReactNode;
  onBack?: () => void;
}

const stepOrder = ['AUTH', 'VERIFY', 'WORKSPACE'];

export function SplitLayout({ stepId, children, rightPanel, onBack }: SplitLayoutProps) {
  const currentIndex = stepOrder.indexOf(stepId);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel — Form */}
      <div className="flex-1 flex flex-col bg-white min-h-screen lg:min-h-0 lg:h-screen">
        {/* Top Bar with Back Arrow */}
        <div className="flex items-center px-6 h-14 border-b border-gray-100">
          {currentIndex > 0 && onBack && (
            <button
              onClick={onBack}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          {(currentIndex === 0 || !onBack) && (
            <div className="flex items-center gap-2">
              <div className="grid grid-cols-2 gap-[2px]">
                <div className="w-[5px] h-[5px] rounded-full bg-[#8A0000]" />
                <div className="w-[5px] h-[5px] rounded-full bg-[#8A0000]/60" />
                <div className="w-[5px] h-[5px] rounded-full bg-[#8A0000]/60" />
                <div className="w-[5px] h-[5px] rounded-full bg-[#8A0000]" />
              </div>
              <span className="text-xs font-medium text-gray-500">Artemis Project</span>
            </div>
          )}
        </div>

        {/* Centered Form Content */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            {children}
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 pb-8">
          {stepOrder.map((step, idx) => (
            <div
              key={step}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-6 bg-[#8A0000]'
                  : idx < currentIndex
                    ? 'w-1.5 bg-[#8A0000]/40'
                    : 'w-1.5 bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right Panel — App Mockup */}
      <div className="hidden lg:flex lg:flex-1 bg-[#111111] items-center justify-center h-[50vh] lg:h-screen lg:min-h-screen">
        <div className="w-full h-full flex items-center justify-center p-8">
          {rightPanel}
        </div>
      </div>
    </div>
  );
}
