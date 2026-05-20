'use client';

import { useState } from 'react';
import { ArrowRight, LogOut, GraduationCap, BookOpen, Shield } from 'lucide-react';

interface WorkspacePageProps {
  onNext: () => void;
  onLogout: () => void;
  travelerName: string;
  role: string;
  setRole: (role: string) => void;
}

const ROLES = [
  {
    id: 'student',
    label: 'Student',
    description: 'Enroll in courses, submit assignments, and track your progress',
    icon: <GraduationCap className="w-5 h-5" />,
    color: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    activeColor: 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20',
  },
  {
    id: 'tutor',
    label: 'Tutor',
    description: 'Review submissions, provide feedback, and guide student learning',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'border-amber-200 bg-amber-50 text-amber-700',
    activeColor: 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/20',
  },
  {
    id: 'admin',
    label: 'Admin',
    description: 'Manage courses, users, and system settings',
    icon: <Shield className="w-5 h-5" />,
    color: 'border-[#8A0000]/30 bg-[#8A0000]/5 text-[#8A0000]',
    activeColor: 'border-[#8A0000] bg-[#8A0000]/5 ring-2 ring-[#8A0000]/20',
  },
];

export function WorkspacePage({ onNext, onLogout, travelerName, role, setRole }: WorkspacePageProps) {
  const [workspaceName, setWorkspaceName] = useState('My Learning Lab');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (workspaceName.trim() && role) {
      onNext();
    }
  };

  const firstName = travelerName.split(' ')[0] || 'Explorer';

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Set up your workspace
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Choose your role and name your workspace, {firstName}.
        </p>
      </div>

      {/* Role Selector */}
      <div className="space-y-3">
        <label className="block text-xs font-medium text-gray-600">Select your role</label>
        <div className="space-y-2">
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-lg border-2 text-left transition-all ${
                role === r.id ? r.activeColor : r.color
              } hover:opacity-90`}
            >
              <div className="shrink-0">{r.icon}</div>
              <div>
                <p className="text-sm font-semibold">{r.label}</p>
                <p className="text-xs opacity-70 mt-0.5">{r.description}</p>
              </div>
              {role === r.id && (
                <div className="ml-auto shrink-0">
                  <div className="w-5 h-5 rounded-full bg-current flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
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
        </div>

        <button
          type="submit"
          disabled={!workspaceName.trim() || !role}
          className="w-full flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-[#8A0000] text-white text-sm font-medium transition-all hover:bg-[#9B0F0F] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#8A0000] disabled:active:scale-100"
        >
          Enter the LMS
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
