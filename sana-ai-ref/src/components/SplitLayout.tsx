import { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";

interface SplitLayoutProps {
  children: ReactNode;
  rightPanel?: ReactNode;
  stepId: string;
}

export function SplitLayout({ children, rightPanel, stepId }: SplitLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* Left Content Area */}
      <div className="w-full md:w-1/2 flex flex-col h-screen relative bg-white z-10 px-6 md:px-16 py-8">
        <header className="flex justify-between items-center w-full z-20 top-0 pt-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 grid grid-cols-2 gap-1 rotate-45 transform">
              <div className="bg-black rounded-full" />
              <div className="bg-black rounded-full" />
              <div className="bg-black rounded-full" />
              <div className="bg-black rounded-full" />
            </div>
            
          </div>
          
          <nav className="hidden md:flex items-center space-x-6 text-sm text-gray-500 font-medium bg-gray-50 px-4 py-1.5 rounded-full">
            <a href="#" className="hover:text-black transition-colors text-black">Overview</a>
            <a href="#" className="hover:text-black transition-colors">Pricing</a>
            <a href="#" className="hover:text-black transition-colors">Privacy and terms</a>
            <a href="#" className="hover:text-black transition-colors">FAQ</a>
          </nav>
        </header>

        <main className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full pt-12 pb-24 h-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepId}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full flex flex-col"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Right Mockup Area */}
      <div className="hidden md:flex w-full md:w-1/2 h-screen p-4 pl-0 relative z-0">
         <motion.div 
           className="w-full h-full rounded-[40px] bg-black p-4 md:p-12 pb-0 overflow-hidden relative shadow-2xl"
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
         >
           {rightPanel}
         </motion.div>
      </div>

    </div>
  );
}
