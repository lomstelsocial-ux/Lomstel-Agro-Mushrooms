import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { FAQItem } from '../../types';
import { openWhatsApp, WHATSAPP_MESSAGES } from '../../utils/whatsapp';

interface FaqSectionProps {
  faqs: FAQItem[];
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs }) => {
  // Keep first open by default
  const [openIds, setOpenIds] = useState<string[]>(faqs.length > 0 ? [faqs[0].id] : []);

  const toggleFaq = (id: string) => {
    setOpenIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-[#F7F8F4] border-b border-[#EAF4EE]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#146B4A] tracking-wider uppercase mb-3">
            <span className="w-5 h-0.5 bg-[#146B4A]" />
            <span>Clear Answers</span>
            <span className="w-5 h-0.5 bg-[#146B4A]" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3D2E] tracking-tight leading-tight mb-4 font-display">
            FREQUENTLY ASKED QUESTIONS
          </h2>

          <p className="text-base text-slate-600 max-w-xl mx-auto">
            Everything you need to know about our oyster mushrooms, hygiene practices, wholesale arrangements, and delivery.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div 
                key={faq.id}
                className="bg-white rounded-2xl border border-[#EAF4EE] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#146B4A]"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-[#0B3D2E] font-display pr-4">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-[#EAF4EE] text-[#146B4A] flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-[#146B4A] text-white' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-4 animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions? Help card */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-[#EAF4EE] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF4EE] text-[#146B4A] flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0B3D2E]">Still have a specific question?</p>
              <p className="text-xs text-slate-500">Our customer support team is available on WhatsApp.</p>
            </div>
          </div>
          <button
            onClick={() => openWhatsApp(WHATSAPP_MESSAGES.general)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#146B4A] hover:bg-[#0B3D2E] text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </button>
        </div>

      </div>
    </section>
  );
};
