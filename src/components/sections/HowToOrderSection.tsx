import React from 'react';
import { MessageCircle, CheckCircle, Package, Hash, MapPin, CheckCheck } from 'lucide-react';
import { openWhatsApp, WHATSAPP_MESSAGES, DISPLAY_PHONE } from '../../utils/whatsapp';

interface HowToOrderSectionProps {
  onOpenOrderModal: () => void;
}

export const HowToOrderSection: React.FC<HowToOrderSectionProps> = ({ onOpenOrderModal }) => {
  const steps = [
    {
      num: '1',
      title: 'Choose Your Product',
      desc: 'Select from Fresh Oyster Mushrooms, Dried Oyster Mushrooms, or Wholesale Supply.',
      icon: Package
    },
    {
      num: '2',
      title: 'Tell Us Your Quantity',
      desc: 'Specify your pack sizes, kilograms, or recurring weekly hospitality volume.',
      icon: Hash
    },
    {
      num: '3',
      title: 'Send Delivery Location',
      desc: 'Provide your address or destination in Ogun State, Lagos, or neighboring zones.',
      icon: MapPin
    },
    {
      num: '4',
      title: 'Confirm on WhatsApp',
      desc: 'Receive immediate price quote, harvest dispatch timeline, and account details.',
      icon: CheckCheck
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#EAF4EE]/60 border-b border-[#EAF4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#146B4A] tracking-wider uppercase mb-3">
            <span className="w-5 h-0.5 bg-[#146B4A]" />
            <span>Fast & Seamless Ordering</span>
            <span className="w-5 h-0.5 bg-[#146B4A]" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3D2E] tracking-tight leading-tight mb-4 font-display">
            ORDER YOUR LOMSTEL MUSHROOMS.
          </h2>

          <p className="text-base sm:text-lg text-slate-700">
            A simple 4-step path to getting farm-fresh, hygienically packaged oyster mushrooms delivered to your door.
          </p>
        </div>

        {/* 4 Steps Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.num}
                className="bg-white rounded-2xl p-6 border border-[#146B4A]/15 shadow-sm relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-9 h-9 rounded-xl bg-[#0B3D2E] text-white flex items-center justify-center font-bold text-sm font-display">
                      {step.num}
                    </span>
                    <Icon className="w-5 h-5 text-[#146B4A]" />
                  </div>

                  <h3 className="text-base font-bold text-[#0B3D2E] mb-2 font-display">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Big WhatsApp CTA Conversion Block */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#146B4A]/25 shadow-xl text-center max-w-3xl mx-auto">
          <div className="inline-flex p-3 rounded-2xl bg-[#EAF4EE] text-[#146B4A] mb-4">
            <MessageCircle className="w-8 h-8 fill-[#146B4A]/20" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B3D2E] mb-3 font-display">
            Chat Directly With Our Farm Rep
          </h3>

          <p className="text-sm sm:text-base text-slate-600 mb-6 max-w-xl mx-auto">
            Click below to instantly launch WhatsApp with our pre-filled inquiry. Our sales desk is online and ready to assist you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => openWhatsApp(WHATSAPP_MESSAGES.general)}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-150"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>ORDER ON WHATSAPP</span>
            </button>

            <button
              onClick={onOpenOrderModal}
              className="w-full sm:w-auto px-6 py-4 bg-[#EAF4EE] hover:bg-[#d8eade] text-[#146B4A] text-sm font-bold rounded-xl transition-colors"
            >
              Fill Out Web Order Form
            </button>
          </div>

          <p className="text-xs text-slate-500 mt-4">
            WhatsApp Hotline: <span className="font-semibold text-[#0B3D2E] font-mono">{DISPLAY_PHONE}</span>
          </p>
        </div>

      </div>
    </section>
  );
};
