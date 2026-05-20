'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { LandingPage } from './onboarding/LandingPage';
import { SplitLayout } from './onboarding/SplitLayout';
import { IdentityPage } from './onboarding/IdentityPage';
import { VerifyPage } from './onboarding/VerifyPage';
import { WorkspacePage } from './onboarding/WorkspacePage';
import { AppMockup } from './onboarding/AppMockup';
import { LMSApp } from './lms/LMSApp';

type Step = 'LANDING' | 'AUTH' | 'VERIFY' | 'WORKSPACE' | 'APP';

interface ArtemisProjectAppProps {
  onExit: () => void;
}

const STORAGE_KEY = 'artemis-project-state';

interface AppState {
  currentStep: Step;
  travelerName: string;
  travelerEmail: string;
  workspace: string;
  role: string;
}

const defaultState: AppState = {
  currentStep: 'LANDING',
  travelerName: '',
  travelerEmail: '',
  workspace: '',
  role: 'student',
};

let storeListeners: (() => void)[] = [];
let cachedJson: string | null = null;

function storeSubscribe(listener: () => void) {
  storeListeners.push(listener);
  return () => { storeListeners = storeListeners.filter(l => l !== listener); };
}

function storeGetSnapshot(): string {
  if (cachedJson === null) {
    try { cachedJson = localStorage.getItem(STORAGE_KEY) || ''; } catch { cachedJson = ''; }
  }
  return cachedJson;
}

function storeGetServerSnapshot(): string { return ''; }

function storeWrite(state: AppState) {
  try {
    cachedJson = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, cachedJson);
    storeListeners.forEach(l => l());
  } catch { /* ignore */ }
}

function parseSnapshot(snapshot: string): AppState {
  if (!snapshot) return defaultState;
  try { return { ...defaultState, ...JSON.parse(snapshot) }; } catch { return defaultState; }
}

export default function ArtemisProjectApp({ onExit }: ArtemisProjectAppProps) {
  const snapshot = useSyncExternalStore(storeSubscribe, storeGetSnapshot, storeGetServerSnapshot);
  const appState = parseSnapshot(snapshot);
  const [isClient] = useState(() => typeof window !== 'undefined');

  const setCurrentStep = useCallback((step: Step) => {
    storeWrite({ ...parseSnapshot(storeGetSnapshot()), currentStep: step });
  }, []);

  const setTravelerName = useCallback((name: string) => {
    storeWrite({ ...parseSnapshot(storeGetSnapshot()), travelerName: name });
  }, []);

  const setTravelerEmail = useCallback((email: string) => {
    storeWrite({ ...parseSnapshot(storeGetSnapshot()), travelerEmail: email });
  }, []);

  const setWorkspace = useCallback((ws: string) => {
    storeWrite({ ...parseSnapshot(storeGetSnapshot()), workspace: ws });
  }, []);

  const setRole = useCallback((role: string) => {
    storeWrite({ ...parseSnapshot(storeGetSnapshot()), role });
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-[#8A0000] rounded-full animate-spin" />
      </div>
    );
  }

  const { currentStep, travelerName, travelerEmail, workspace, role } = appState;

  if (currentStep === 'APP') {
    return <LMSApp travelerName={travelerName} workspace={workspace} onExit={onExit} />;
  }

  if (currentStep === 'LANDING') {
    return <LandingPage onNext={() => setCurrentStep('AUTH')} />;
  }

  const stepBackMap: Record<string, Step> = {
    VERIFY: 'AUTH',
    WORKSPACE: 'VERIFY',
  };

  return (
    <SplitLayout
      stepId={currentStep}
      rightPanel={<AppMockup />}
      onBack={stepBackMap[currentStep] ? () => setCurrentStep(stepBackMap[currentStep]) : undefined}
    >
      {currentStep === 'AUTH' && (
        <IdentityPage
          onNext={() => setCurrentStep('VERIFY')}
          travelerName={travelerName}
          setTravelerName={setTravelerName}
          travelerEmail={travelerEmail}
          setTravelerEmail={setTravelerEmail}
        />
      )}
      {currentStep === 'VERIFY' && (
        <VerifyPage onNext={() => setCurrentStep('WORKSPACE')} onBack={() => setCurrentStep('AUTH')} />
      )}
      {currentStep === 'WORKSPACE' && (
        <WorkspacePage
          onNext={() => setCurrentStep('APP')}
          onLogout={() => setCurrentStep('AUTH')}
          travelerName={travelerName}
          role={role}
          setRole={setRole}
        />
      )}
    </SplitLayout>
  );
}
