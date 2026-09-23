import React, { useState } from 'react';
import { MessageSquare, Bot, Sparkles, X } from 'lucide-react';

interface ChatbotFloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export const ChatbotFloatingButton: React.FC<ChatbotFloatingButtonProps> = ({
  onClick,
  isOpen
}) => {
  const [showTooltip, setShowTooltip] = useState(true);

  if (isOpen) return null;

  return (
    <div
      id="chatbot-floating-container"
      className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2 group"
    >
      {/* Tooltip bubble on desktop */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold py-2 px-3.5 rounded-2xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-right-3 duration-300">
          <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span>Questions? Ask Sankat Mochan Assistant</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-white cursor-pointer ml-1"
            aria-label="Dismiss tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        id="chatbot-floating-btn"
        onClick={onClick}
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-teal-700 hover:bg-teal-800 text-white flex items-center justify-center shadow-lg shadow-teal-900/30 hover:scale-105 active:scale-95 transition-all relative cursor-pointer"
        aria-label="Open Sankat Mochan Assistant"
      >
        <Bot className="w-7 h-7 text-teal-100" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
      </button>
    </div>
  );
};
