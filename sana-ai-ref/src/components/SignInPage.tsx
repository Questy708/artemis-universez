import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function SignInPage({ onNext, email, setEmail }: { onNext: () => void, email: string, setEmail: (e:string) => void }) {
  const [isTypingEmail, setIsTypingEmail] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center text-center w-full max-w-[360px] mx-auto">
      <h1 className="text-4xl font-medium text-black mb-1">Welcome to Sana</h1>
      <h2 className="text-4xl font-medium text-gray-500 mb-6">Your AI agent for work</h2>
      
      <p className="text-[15px] text-gray-600 mb-8 mt-2 leading-relaxed">
        Sign in or sign up for free<br />with your work email
      </p>

      <button className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-200 rounded-full py-3.5 mb-6 hover:bg-gray-50 transition-colors">
        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
          <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
            <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
            <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
          </g>
        </svg>
        <span className="text-[15px] font-medium text-black">Sign in with Google</span>
      </button>

      <div className="flex items-center w-full mb-6 relative">
        <div className="flex-grow border-t border-gray-100"></div>
        <span className="mx-4 text-xs text-gray-300">or</span>
        <div className="flex-grow border-t border-gray-100"></div>
      </div>

      <div className="w-full relative">
         <input
           type="email"
           value={email}
           onChange={(e) => {
             setEmail(e.target.value);
             setIsTypingEmail(e.target.value.length > 0);
           }}
           onFocus={() => setIsTypingEmail(email.length > 0)}
           placeholder="name@work-email.com"
           className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-full text-[15px] outline-none focus:border-gray-400 transition-colors text-center"
         />
      </div>

      <AnimatePresence mode="wait">
        {!isTypingEmail ? (
          <motion.button 
            key="btn-disabled"
            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
            className="w-full mt-4 bg-gray-50 text-gray-400 rounded-full py-3.5 text-[15px] font-medium flex items-center justify-center cursor-not-allowed"
          >
            Enter your work email
          </motion.button>
        ) : (
          <motion.div key="btn-active" initial={{ opacity: 0, y: -5, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: 5, height: 0 }} className="w-full overflow-hidden flex flex-col items-center">
            <div className="bg-gray-50 text-gray-600 text-[13px] px-6 py-4 rounded-xl mt-4 w-full text-center">
               Using your work email will make it easier for you to collaborate with your team.
            </div>
            <button 
              onClick={onNext}
              className="w-full mt-4 bg-black text-white hover:bg-black/90 rounded-full py-3.5 text-[15px] font-medium transition-colors"
            >
              Continue anyway
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-[11px] text-gray-400 mt-8 leading-relaxed max-w-[320px]">
        By signing up to a free account or Team workspace, you agree to the <a href="#" className="underline hover:text-gray-600">MSA</a>, <a href="#" className="underline hover:text-gray-600">Product Terms</a>, <a href="#" className="underline hover:text-gray-600">Policies</a>, <a href="#" className="underline hover:text-gray-600">Privacy Notice</a>, and <a href="#" className="underline hover:text-gray-600">Cookie Notice</a>. By signing up to an Enterprise workspace, you agree to the <a href="#" className="underline hover:text-gray-600">Policies</a>, <a href="#" className="underline hover:text-gray-600">Privacy Notice</a>, and <a href="#" className="underline hover:text-gray-600">Cookie Notice</a>.
      </p>
    </div>
  );
}
