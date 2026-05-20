'use client';

import { Shield, ArrowRight } from 'lucide-react';

interface IdentityPageProps {
  onNext: () => void;
  travelerName: string;
  setTravelerName: (name: string) => void;
}

export function IdentityPage({ onNext, travelerName, setTravelerName }: IdentityPageProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (travelerName.trim()) {
      onNext();
    }
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-gray-500">
          Join the Artemis learning community
        </p>
      </div>

      {/* SSO Button */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2.5 h-11 px-4 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 active:scale-[0.99]"
      >
        <Shield className="w-4 h-4 text-[#8A0000]" />
        Explorer SSO
      </button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-gray-400">or continue with your name</span>
        </div>
      </div>

      {/* Name Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="traveler-name"
            className="block text-xs font-medium text-gray-600"
          >
            Traveler name
          </label>
          <input
            id="traveler-name"
            type="text"
            value={travelerName}
            onChange={(e) => setTravelerName(e.target.value)}
            placeholder="Your name"
            autoFocus
            className="w-full h-11 px-3.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:outline-none focus:border-[#8A0000] focus:ring-2 focus:ring-[#8A0000]/10"
          />
        </div>

        <button
          type="submit"
          disabled={!travelerName.trim()}
          className="w-full flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-[#8A0000] text-white text-sm font-medium transition-all hover:bg-[#9B0F0F] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#8A0000] disabled:active:scale-100"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
