import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";

export function VerifyPage({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multi-char if not pasted
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const PasteHandler = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const pasted = e.clipboardData.getData("text").trim().slice(0, 6).split("");
    if (pasted.length > 0) {
      const newCode = [...code];
      pasted.forEach((char, i) => {
        if (i < 6) newCode[i] = char;
      });
      setCode(newCode);
      if (pasted.length < 6) {
        inputRefs.current[pasted.length]?.focus();
      } else {
        inputRefs.current[5]?.focus();
      }
    }
  };

  const isComplete = code.every(c => c !== "");

  return (
    <div className="flex flex-col items-center justify-center text-center w-full max-w-[360px] mx-auto text-left items-start justify-start">
      <h1 className="text-3xl font-medium text-black mb-2 text-left w-full">We sent you a code</h1>
      <p className="text-[14px] text-gray-500 mb-8 text-left w-full">Please wait</p>

      <div className="flex space-x-2 w-full justify-between mb-2" onPaste={PasteHandler}>
        {code.map((c, i) => (
          <input
            key={i}
            ref={el => inputRefs.current[i] = el}
            type="text"
            inputMode="numeric"
            value={c}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-12 h-12 text-center text-xl font-medium border border-gray-200 rounded-lg outline-none focus:border-gray-400 focus:bg-gray-50 transition-colors"
            placeholder="0"
          />
        ))}
      </div>

      <button className="text-xs text-gray-500 mb-8 mt-2 text-left w-full hover:text-black">
        Resend code
      </button>

      <div className="flex space-x-3 w-full mb-8">
        <button 
          onClick={onBack}
          className="px-6 py-3.5 bg-black text-white hover:bg-black/90 font-medium rounded-full text-[15px] transition-colors"
        >
          Back
        </button>
        <button 
          onClick={isComplete ? onNext : undefined}
          className={`flex-1 py-3.5 font-medium rounded-full text-[15px] transition-colors ${
            isComplete 
             ? "bg-black text-white hover:bg-black/90" 
             : "bg-gray-50 text-gray-400 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>

      <p className="text-[11px] text-gray-400 leading-relaxed text-left">
        By signing up to a free account or Team workspace, you agree to the <a href="#" className="underline hover:text-gray-600">MSA</a>, <a href="#" className="underline hover:text-gray-600">Product Terms</a>, <a href="#" className="underline hover:text-gray-600">Policies</a>, <a href="#" className="underline hover:text-gray-600">Privacy Notice</a>, and <a href="#" className="underline hover:text-gray-600">Cookie Notice</a>. By signing up to an Enterprise workspace, you agree to the <a href="#" className="underline hover:text-gray-600">Policies</a>, <a href="#" className="underline hover:text-gray-600">Privacy Notice</a>, and <a href="#" className="underline hover:text-gray-600">Cookie Notice</a>.
      </p>
    </div>
  );
}
