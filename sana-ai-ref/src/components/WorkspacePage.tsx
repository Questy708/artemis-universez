import { useState } from "react";
import { Loader2 } from "lucide-react";

export function WorkspacePage({ onNext, onLogout, email }: { onNext: () => void, onLogout: () => void, email: string }) {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = () => {
    setIsCreating(true);
    setTimeout(() => {
      onNext();
    }, 1500); // fake network delay
  };

  return (
    <div className="flex flex-col w-full max-w-[400px] mx-auto text-left">
      <h1 className="text-3xl font-medium text-black mb-1">Welcome to Sana Agents</h1>
      <p className="text-[15px] text-gray-500 mb-8">Join or create a workspace</p>

      <div className="w-full border-t border-gray-100 mb-8"></div>

      <div className="space-y-8">
        <div className="flex items-center justify-between group">
          <div>
            <h3 className="text-[15px] font-medium text-black mb-1">Create a new workspace</h3>
            <p className="text-[13px] text-gray-500 max-w-[220px]">Set something up from scratch and invite your team</p>
          </div>
          <button 
            onClick={handleCreate}
            disabled={isCreating}
            className="text-gray-400 hover:text-black font-medium text-[14px] flex items-center transition-colors"
          >
            {isCreating ? (
              <>
                <span className="mr-2">Creating...</span>
                <Loader2 className="w-4 h-4 animate-spin" />
              </>
            ) : "Create"}
          </button>
        </div>

        <div className="flex items-center justify-between group">
          <div>
            <h3 className="text-[15px] font-medium text-black mb-1">Not seeing your workspace?</h3>
            <p className="text-[13px] text-gray-500 max-w-[220px]">Try logging in with a different email</p>
          </div>
          <button 
            onClick={onLogout}
            className="text-gray-400 hover:text-black font-medium text-[14px] transition-colors"
          >
            Log out
          </button>
        </div>
      </div>

      <div className="w-full absolute bottom-8 left-0 px-6 md:px-0">
        <p className="text-[13px] text-gray-400">
          Signed in as <span className="font-medium text-black">{email || "alexsmith@content-mobbin.com"}</span>
        </p>
      </div>
    </div>
  );
}
