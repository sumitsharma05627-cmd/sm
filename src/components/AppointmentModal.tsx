import React from 'react';
import { X } from 'lucide-react';
import { AppointmentSection } from './AppointmentSection.tsx';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledService?: string;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  prefilledService,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="appointment-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="appointment-modal-content"
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto relative shadow-2xl my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="close-appointment-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close appointment modal"
        >
          <X className="w-5 h-5" />
        </button>

        <AppointmentSection prefilledService={prefilledService} />
      </div>
    </div>
  );
};
