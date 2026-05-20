'use client';

import { useState } from 'react';
import { ArrowRight, LogOut } from 'lucide-react';

interface WorkspacePageProps {
  onNext: () => void;
  onLogout: () => void;
  travelerName: string;
}

export function WorkspacePage({ onNext, onLogout, travelerName }: WorkspacePageProps) {
  const [workspaceName, setWorkspaceName] = useState('My Learning Lab');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (workspaceName.trim()) {
      onNext();
    }
  };

  const firstName = travelerName.split(' ')[0] || 'Explorer';

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Name your workspace
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          This is where your learning community will gather, discuss, and grow together.
        </p>
      </div>

      {/* Workspace Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="workspace-name"
            className="block text-xs font-medium text-gray-600"
          >
            Workspace name
          </label>
          <input
            id="workspace-name"
            type="text"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            placeholder="My Learning Lab"
            autoFocus
            className="w-full h-11 px-3.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:outline-none focus:border-[#8A0000] focus:ring-2 focus:ring-[#8A0000]/10"
          />
          <p className="text-xs text-gray-400">
            Welcome aboard, {firstName}. Make it yours.
          </p>
        </div>

        <button
          type="submit"
          disabled={!workspaceName.trim()}
          className="w-full flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-[#8A0000] text-white text-sm font-medium transition-all hover:bg-[#9B0F0F] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#8A0000] disabled:active:scale-100"
        >
          Create workspace
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Logout */}
      <div className="pt-4">
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors mx-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>
    </div>
  );
}
