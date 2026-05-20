'use client';

import { useState, useRef, KeyboardEvent, ClipboardEvent } from 'react';

interface VerifyPageProps {
  onNext: () => void;
  onBack: () => void;
}

export function VerifyPage({ onNext }: VerifyPageProps) {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isComplete = otp.every((digit) => digit !== '');

  const handleChange = (index: number, value: string) => {
    // Only allow single digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (value && index === 5 && newOtp.every((d) => d !== '')) {
      // Small delay for visual feedback
      setTimeout(() => onNext(), 150);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move to previous input on backspace if current is empty
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < pasted.length; i++) {
        newOtp[i] = pasted[i];
      }
      setOtp(newOtp);
      // Focus on the next empty input or the last one
      const nextEmpty = newOtp.findIndex((d) => d === '');
      if (nextEmpty !== -1) {
        inputRefs.current[nextEmpty]?.focus();
      } else {
        inputRefs.current[5]?.focus();
      }

      // Auto-submit if complete
      if (newOtp.every((d) => d !== '')) {
        setTimeout(() => onNext(), 150);
      }
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (isComplete) {
      onNext();
    }
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Check your messages
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          We sent a verification code to your linked account. Enter it below to
          confirm your identity.
        </p>
      </div>

      {/* OTP Input */}
      <form onSubmit={handleVerify} className="space-y-6">
        <div className="flex items-center justify-center gap-2.5">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={idx === 0 ? handlePaste : undefined}
              className="w-11 h-13 rounded-lg border border-gray-200 bg-white text-center text-lg font-semibold text-gray-900 transition-all focus:outline-none focus:border-[#8A0000] focus:ring-2 focus:ring-[#8A0000]/10"
              aria-label={`Digit ${idx + 1}`}
              autoFocus={idx === 0}
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          disabled={!isComplete}
          className="w-full flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-[#8A0000] text-white text-sm font-medium transition-all hover:bg-[#9B0F0F] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#8A0000] disabled:active:scale-100"
        >
          Verify
        </button>
      </form>

      {/* Resend */}
      <p className="text-center text-xs text-gray-400">
        Didn&apos;t receive a code?{' '}
        <button className="text-[#8A0000] hover:text-[#9B0F0F] transition-colors font-medium">
          Resend
        </button>
      </p>
    </div>
  );
}
