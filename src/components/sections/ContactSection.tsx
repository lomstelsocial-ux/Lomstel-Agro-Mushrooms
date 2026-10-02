import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  ShieldCheck, 
  MessageCircle, 
  Send, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { SiteSettings } from '../../types';
import { openWhatsApp, WHATSAPP_MESSAGES, DISPLAY_PHONE, SECONDARY_PHONE } from '../../utils/whatsapp';

interface ContactSectionProps {
  settings: SiteSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.phone || !formState.message) return;
    
    // Format message and prompt to send via WhatsApp or email
    const fullMsg = `Inquiry from ${formState.name} (${formState.phone}, ${formState.email || 'No email'}): ${formState.message}`;
    setSent(true);
    openWhatsApp(fullMsg);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#F7F8F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#146B4A] tracking-wider uppercase mb-3">
            <span className="w-5 h-0.5 bg-[#146B4A]" />
            <span>Direct Communication</span>
            <span className="w-5 h-0.5 bg-[#146B4A]" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3D2E] tracking-tight leading-tight mb-4 font-display">
            {settings.contactHeadline || 'GET IN TOUCH WITH LOMSTEL AGRO'}
          </h2>

          <p className="text-base sm:text-lg text-slate-700">
            Have an inquiry about our farm harvests, standing restaurant contracts, or delivery logistics? We are here to help.
          </p>
        </div>

        {/* 2-Column Contact Info + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Left Column: Official Contact Card & Location */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            <div className="bg-white rounded-3xl p-8 border border-[#EAF4EE] shadow-sm">
              <h3 className="text-2xl font-extrabold text-[#0B3D2E] mb-6 font-display">
                Lomstel Agro
              </h3>

              <div className="space-y-5 text-sm text-slate-700">
                {/* Address */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#EAF4EE] text-[#146B4A] shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Farm & Facility Address:</span>
                    <p className="font-medium text-[#0B3D2E] leading-relaxed mt-0.5">
                      {settings.locationAddress}
                    </p>
                  </div>
                </div>

                {/* Primary WhatsApp */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#EAF4EE] text-[#146B4A] shrink-0 mt-0.5">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">WhatsApp Direct:</span>
                    <a 
                      href={`https://wa.me/${settings.whatsappNumber}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-bold text-[#146B4A] hover:underline block mt-0.5 font-mono"
                    >
                      {DISPLAY_PHONE}
                    </a>
                  </div>
                </div>

                {/* Secondary Phone */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#EAF4EE] text-[#146B4A] shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Secondary Phone:</span>
                    <a 
                      href={`tel:${SECONDARY_PHONE.replace(/\s+/g, '')}`}
                      className="font-semibold text-[#0B3D2E] hover:underline block mt-0.5 font-mono"
                    >
                      {SECONDARY_PHONE}
                    </a>
                  </div>
                </div>

                {/* Website */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#EAF4EE] text-[#146B4A] shrink-0 mt-0.5">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Corporate Website:</span>
                    <a 
                      href={settings.mainWebsite} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-[#146B4A] hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <span>www.lomstel.com</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* NAFDAC Registration */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#EAF4EE] text-[#146B4A] shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">NAFDAC Regulatory Certificate:</span>
                    <span className="font-mono font-bold text-[#0B3D2E] block mt-0.5">
                      REG. NO.: {settings.nafdacReg}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Action Dial Buttons */}
              <div className="grid grid-cols-3 gap-2.5 mt-8 pt-6 border-t border-[#EAF4EE]">
                <button
                  onClick={() => openWhatsApp(WHATSAPP_MESSAGES.general)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#146B4A] transition-colors"
                >
                  <MessageCircle className="w-5 h-5 mb-1 text-[#25D366]" />
                  <span className="text-[11px] font-bold">WhatsApp</span>
                </button>

                <a
                  href={`tel:${settings.primaryPhone.replace(/\s+/g, '')}`}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#EAF4EE] hover:bg-[#d8eade] text-[#146B4A] transition-colors text-center"
                >
                  <Phone className="w-5 h-5 mb-1" />
                  <span className="text-[11px] font-bold">Call Us</span>
                </a>

                <a
                  href={`mailto:${settings.email}`}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#F7F8F4] hover:bg-slate-200/60 text-slate-700 transition-colors text-center"
                >
                  <Mail className="w-5 h-5 mb-1 text-slate-600" />
                  <span className="text-[11px] font-bold">Email Us</span>
                </a>
              </div>
            </div>

            {/* Visual Location Map Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAF4EE] overflow-hidden shadow-sm relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#0B3D2E] uppercase tracking-wider">
                  Farm & Dispatch Hub
                </span>
                <span className="text-xs text-slate-500">Kanuyi, Ogun State</span>
              </div>
              <div className="h-44 rounded-2xl bg-gradient-to-tr from-[#0B3D2E] via-[#146B4A] to-[#208860] relative overflow-hidden flex items-center justify-center text-center p-6 text-white shadow-inner">
                <div className="relative z-10">
                  <MapPin className="w-8 h-8 text-[#D4A72C] mx-auto mb-2 animate-bounce" />
                  <p className="font-bold text-sm">35, Ewuosho Street, off Aiyetoro Road</p>
                  <p className="text-xs text-slate-200">Kanuyi, Ogun State, Nigeria</p>
                  <a
                    href="https://maps.google.com/?q=Ogun+State+Nigeria"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-3 px-3 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-md text-xs font-semibold rounded-lg transition-colors"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EAF4EE] shadow-sm">
              <h3 className="text-2xl font-extrabold text-[#0B3D2E] mb-2 font-display">
                Send a Message
              </h3>
              <p className="text-sm text-slate-600 mb-8">
                Fill in your details below and we will respond promptly via WhatsApp or phone.
              </p>

              {sent ? (
                <div className="p-6 bg-[#EAF4EE] rounded-2xl border border-[#146B4A]/30 text-center animate-in fade-in">
                  <CheckCircle2 className="w-12 h-12 text-[#146B4A] mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-[#0B3D2E] mb-1">Message Sent!</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mb-4">
                    Thank you. We have received your inquiry and opened WhatsApp to connect directly with our support desk.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setFormState({ name: '', phone: '', email: '', message: '' });
                    }}
                    className="text-xs font-bold text-[#146B4A] hover:underline"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="e.g. Babatunde Alabi"
                      className="w-full px-4 py-3 bg-[#F7F8F4] border border-[#EAF4EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146B4A]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        placeholder="e.g. 0806 123 4567"
                        className="w-full px-4 py-3 bg-[#F7F8F4] border border-[#EAF4EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146B4A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-2">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="e.g. babatunde@example.com"
                        className="w-full px-4 py-3 bg-[#F7F8F4] border border-[#EAF4EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146B4A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B3D2E] uppercase tracking-wider mb-2">
                      Your Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="How can we assist you with our oyster mushrooms?"
                      className="w-full px-4 py-3 bg-[#F7F8F4] border border-[#EAF4EE] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146B4A]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[#146B4A] hover:bg-[#0B3D2E] active:scale-[0.99] text-white text-sm font-bold rounded-xl shadow-md transition-all duration-150 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>SEND MESSAGE</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
