/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { SplitLayout } from "./components/SplitLayout";
import { SignInPage } from "./components/SignInPage";
import { VerifyPage } from "./components/VerifyPage";
import { WorkspacePage } from "./components/WorkspacePage";
import { MainApp } from "./components/MainApp";
import { AppMockup } from "./components/AppMockup";

type Step = 'LANDING' | 'AUTH' | 'VERIFY' | 'WORKSPACE' | 'APP';

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>('LANDING');
  const [email, setEmail] = useState("");

  if (currentStep === 'LANDING') {
    return <LandingPage onNext={() => setCurrentStep('AUTH')} />;
  }

  if (currentStep === 'APP') {
    return <MainApp />;
  }

  // Use SplitLayout for AUTH, VERIFY, WORKSPACE
  return (
    <SplitLayout stepId={currentStep} rightPanel={<AppMockup />}>
      {currentStep === 'AUTH' && (
        <SignInPage 
          onNext={() => setCurrentStep('VERIFY')} 
          email={email}
          setEmail={setEmail} 
        />
      )}
      {currentStep === 'VERIFY' && (
        <VerifyPage 
          onNext={() => setCurrentStep('WORKSPACE')} 
          onBack={() => setCurrentStep('AUTH')} 
        />
      )}
      {currentStep === 'WORKSPACE' && (
        <WorkspacePage 
          onNext={() => setCurrentStep('APP')} 
          onLogout={() => setCurrentStep('AUTH')} 
          email={email}
        />
      )}
    </SplitLayout>
  );
}
