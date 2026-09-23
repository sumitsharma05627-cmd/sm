import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, X, Send, Bot, MapPin, Clock, Calendar, 
  DollarSign, Star, Phone, ArrowRight, ShieldAlert, Sparkles,
  ExternalLink, RotateCcw
} from 'lucide-react';
import { answerClinicQuestion, clinicKnowledge, ChatbotResponse } from '../data/clinicKnowledge.ts';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  actionButton?: ChatbotResponse['actionButton'];
  quickSuggestions?: string[];
  timestamp: string;
}

interface ClinicChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAppointment: (serviceTitle?: string) => void;
}

const QUICK_TOPICS = [
  { label: '📍 Location', query: 'Where is the clinic located?' },
  { label: '🕐 Timings', query: 'What are your operating timings?' },
  { label: '🏥 Services', query: 'What physiotherapy treatments and services do you offer?' },
  { label: '📅 Appointment', query: 'How can I book an appointment?' },
  { label: '💰 Fees', query: 'What are your consultation and treatment fees?' },
  { label: '⭐ Reviews', query: 'What do patients say in their reviews?' },
  { label: '📞 Contact', query: 'What are your contact phone numbers?' },
];

export const ClinicChatbot: React.FC<ClinicChatbotProps> = ({
  isOpen,
  onClose,
  onOpenAppointment
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hello! Welcome to Sankat Mochan Physiotherapy & Fitness Center, Gwalior.\n\nI am your clinic assistant. Ask me anything about our services, timings, location, doctors, or appointment booking.`,
      quickSuggestions: ['📍 Location', '🕐 Timings', '🏥 Services', '📅 Appointment', '💰 Fees', '⭐ Reviews', '📞 Contact'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, messages]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const response = answerClinicQuestion(query);

    const botMessage: Message = {
      id: `bot-${Date.now() + 1}`,
      sender: 'bot',
      text: response.text,
      actionButton: response.actionButton,
      quickSuggestions: response.quickSuggestions,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInputText('');
  };

  const handleActionClick = (actionButton: ChatbotResponse['actionButton']) => {
    if (!actionButton) return;

    if (actionButton.onClickType === 'open_appointment') {
      onClose();
      onOpenAppointment();
    } else if (actionButton.onClickType === 'get_directions' && actionButton.url) {
      window.open(actionButton.url, '_blank', 'noopener,noreferrer');
    } else if (actionButton.onClickType === 'call_clinic' && actionButton.url) {
      window.location.href = actionButton.url;
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: `Chat restarted. Welcome to Sankat Mochan Physiotherapy & Fitness Center, Gwalior.\n\nHow can I help you today?`,
        quickSuggestions: ['📍 Location', '🕐 Timings', '🏥 Services', '📅 Appointment', '💰 Fees', '⭐ Reviews', '📞 Contact'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setInputText('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6 bg-slate-950/40 backdrop-blur-2xs animate-in fade-in duration-200">
      <div 
        className="w-full sm:max-w-md h-[92vh] sm:h-[620px] max-h-[700px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden relative"
        role="dialog"
        aria-labelledby="chatbot-title"
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-teal-800 to-slate-900 text-white flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600/40 border border-teal-400/40 flex items-center justify-center text-teal-200 shadow-inner">
              <Bot className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 id="chatbot-title" className="text-sm font-bold tracking-tight text-white">
                  Sankat Mochan Assistant
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-teal-200">
                Official Clinic Helpdesk • Gole Ka Mandir, Gwalior
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleResetChat}
              title="Restart conversation"
              className="w-8 h-8 rounded-full hover:bg-white/10 text-teal-200 flex items-center justify-center transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close chat"
              className="w-8 h-8 rounded-full hover:bg-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-3.5 py-1.5 flex items-center gap-2 text-[11px] text-amber-900 shrink-0">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Informational only; for official medical evaluation, book an in-person assessment.</span>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-teal-700 text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Optional Action Button inside Message */}
                {msg.actionButton && (
                  <div className="mt-3 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleActionClick(msg.actionButton)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <span>{msg.actionButton.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {msg.timestamp}
              </span>

              {/* Quick suggestions if attached to bot response */}
              {msg.quickSuggestions && msg.quickSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                  {msg.quickSuggestions.map((suggestion, sIdx) => {
                    // Match to question or use suggestion directly
                    const matched = QUICK_TOPICS.find((t) => t.label === suggestion);
                    const qText = matched ? matched.query : suggestion;
                    return (
                      <button
                        key={sIdx}
                        onClick={() => handleSendMessage(qText)}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-800 text-[11px] font-medium transition-colors shadow-2xs cursor-pointer"
                      >
                        {suggestion}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips Bar */}
        <div className="p-2 bg-white border-t border-slate-200/80 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {QUICK_TOPICS.map((topic, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(topic.query)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-100 text-slate-700 hover:text-teal-900 font-semibold text-[11px] transition-colors shrink-0 cursor-pointer"
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your question (e.g. fees, address, back pain)..."
            className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-xs"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
