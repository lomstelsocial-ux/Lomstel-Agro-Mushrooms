import React from 'react';
import { ArrowRight, Check, MapPin, Building2, Sparkles } from 'lucide-react';
import { SiteSettings } from '../../types';

interface AboutSectionProps {
  settings: SiteSettings;
  facilityImage: string;
  onLearnMoreClick: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  settings,
  facilityImage,
  onLearnMoreClick
}) => {
  const activeAboutImg = settings.aboutImage || facilityImage;

  return (
    <section id="about" className="py-20 lg:py-28 bg-[#F7F8F4] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Image Showcase with Farm Environment */}
          <div className="lg:col-span-6 order-2 lg:order-1 relative">
            <div className="relative">
              {/* Decorative accent border */}
              <div className="absolute -inset-3 bg-[#146B4A]/10 rounded-3xl transform -rotate-1" />
              
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-slate-900 group">
                <img
                  src={activeAboutImg}
                  alt="Modern mushroom cultivation facility at Lomstel Agro"
                  className="w-full h-[380px] sm:h-[460px] object-cover group-hover:scale-102 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

                {/* Subtitle tag card in corner */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-white shadow-md">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#146B4A] mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Ogun State Facility · Nigeria</span>
                  </div>
                  <p className="text-sm font-bold text-[#0B3D2E]">
                    Controlled Climate & Sanitation Protocols
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col justify-center">
            
            <div className="flex items-center gap-2 text-xs font-bold text-[#146B4A] tracking-wider uppercase mb-3">
              <span className="w-6 h-0.5 bg-[#146B4A]" />
              <span>About Lomstel Agro</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3D2E] tracking-tight leading-tight mb-6 font-display">
              {settings.aboutTitle || 'FROM OUR FARM TO YOUR TABLE.'}
            </h2>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed mb-6">
              {settings.aboutText || 'Lomstel Oyster Mushrooms are carefully and hygienically cultivated using modern farming facilities and controlled growing practices. Freshly harvested and thoughtfully packaged, they provide a natural, delicious and wholesome addition to everyday meals.'}
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-8">
              Based in Kanuyi, Ogun State, our agribusiness is dedicated to advancing sustainable, climate-smart food production in West Africa. We supply both fresh and sun-dried oyster mushrooms to discerning homes, supermarkets, upscale hotels, and catering institutions.
            </p>

            {/* Farm Commitments List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8 text-sm text-[#0B3D2E]">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#EAF4EE] text-[#146B4A] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold">Pure Organic Substrates</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#EAF4EE] text-[#146B4A] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold">Zero Chemical Sprays</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#EAF4EE] text-[#146B4A] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold">NAFDAC Reg: A8-121508L</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#EAF4EE] text-[#146B4A] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold">Strict Cold-Chain Packaging</span>
              </div>
            </div>

            {/* Learn More Button */}
            <div>
              <button
                onClick={onLearnMoreClick}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0B3D2E] hover:bg-[#146B4A] text-white font-bold rounded-xl shadow-md transition-colors duration-150 group"
              >
                <span>LEARN MORE ABOUT OUR FACILITY</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
