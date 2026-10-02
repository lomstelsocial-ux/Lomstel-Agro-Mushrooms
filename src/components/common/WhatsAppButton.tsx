import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { openWhatsApp, WHATSAPP_MESSAGES } from '../../utils/whatsapp';

export const WhatsAppButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-2 group">
      {/* Quick speech bubble helper */}
      {showTooltip && (
        <div className="bg-white text-[#17211B] shadow-xl rounded-2xl p-3 max-w-[260px] border border-[#EAF4EE] text-xs relative animate-in fade-in slide-in-from-bottom-2 duration-200">
          <button 
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
            aria-label="Close tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <p className="font-semibold text-[#146B4A] mb-1">Order Fresh Mushrooms Today</p>
          <p className="text-slate-600 mb-2">Have a question or want to place an order directly on WhatsApp?</p>
          <button
            onClick={() => {
              setShowTooltip(false);
              openWhatsApp(WHATSAPP_MESSAGES.general);
            }}
            className="w-full py-1.5 px-3 bg-[#146B4A] text-white font-medium rounded-lg text-center hover:bg-[#0B3D2E] transition-colors"
          >
            Chat with Sales Rep
          </button>
        </div>
      )}

      {/* Main floating button */}
      <button
        onClick={() => openWhatsApp(WHATSAPP_MESSAGES.general)}
        onMouseEnter={() => setShowTooltip(true)}
        className="flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366]"
        aria-label="Chat with Lomstel Agro on WhatsApp"
      >
        <span className="relative flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white"></span>
        </span>
        <MessageCircle className="w-5 h-5 fill-white text-transparent" />
        <span className="text-sm font-bold tracking-tight">Chat With Us</span>
      </button>
    </div>
  );
};
