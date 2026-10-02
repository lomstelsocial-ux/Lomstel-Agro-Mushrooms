import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, MapPin, Eye } from 'lucide-react';
import { ASSET_IMAGES } from '../../constants/initialData';
import { openWhatsApp, WHATSAPP_MESSAGES } from '../../utils/whatsapp';
import { SiteSettings } from '../../types';

interface FacilityTourSectionProps {
  settings?: SiteSettings;
  onOpenGallery: () => void;
}

export const FacilityTourSection: React.FC<FacilityTourSectionProps> = ({ settings, onOpenGallery }) => {
  const activeFacilityImg = settings?.facilityImage || ASSET_IMAGES.facility;

  const facilityPillars = [
    {
      title: 'Climate-Controlled Growing Rooms',
      desc: 'Precision humidity, temperature regulation, and clean air exchange cycles.',
      tag: 'Controlled Atmosphere'
    },
    {
      title: 'Substrate Sterilization & Inoculation',
      desc: 'Carefully pasteurized agricultural biomass inoculated with pure mushroom spawn.',
      tag: 'Sterile Environment'
    },
    {
      title: 'Hygienic Hand Harvesting',
      desc: 'Pickers adhere to sanitized attire, nitrile gloves, and stainless harvesting tools.',
      tag: 'Food Safety'
    },
    {
      title: 'Sorting & Grading Table',
      desc: 'Every cluster inspected for cap firmness, pearly hue, and uniform freshness.',
      tag: 'Quality Assurance'
    },
    {
      title: 'Packaging & Seal Integrity',
      desc: 'Eco-ventilated boxes and airtight pouches sealed against environmental contaminants.',
      tag: 'Hygienic Packaging'
    },
    {
      title: 'Cold Storage & Prompt Dispatch',
      desc: 'Immediate post-harvest temperature drop to keep produce crisp during distribution.',
      tag: 'Fresh Delivery'
    }
  ];

  return (
    <section id="facility" className="py-20 lg:py-28 bg-white border-b border-[#EAF4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#146B4A] tracking-wider uppercase mb-3">
            <span className="w-5 h-0.5 bg-[#146B4A]" />
            <span>Farm & Production Infrastructure</span>
            <span className="w-5 h-0.5 bg-[#146B4A]" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3D2E] tracking-tight leading-tight mb-4 font-display">
            {settings?.facilityHeadline || 'SEE WHERE YOUR MUSHROOMS COME FROM.'}
          </h2>

          <p className="text-base sm:text-lg text-slate-700">
            {settings?.facilitySubtext || 'Take a closer look at the environment where Lomstel Oyster Mushrooms are cultivated, harvested and prepared.'}
          </p>
        </div>

        {/* Visual Double-Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-14">
          
          {/* Main Facility Image with Badge */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-slate-900 group">
              <img
                src={activeFacilityImg}
                alt="Controlled mushroom cultivation room with automated misting at Lomstel Agro"
                className="w-full h-[400px] sm:h-[460px] object-cover group-hover:scale-102 transition-transform duration-700"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 bg-[#0B3D2E]/90 backdrop-blur-sm text-white text-xs font-bold rounded-lg border border-white/20">
                  Modern Growing Infrastructure
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#D4A72C] mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Kanuyi, Ogun State, Nigeria</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display mb-1">
                  Vertical Growing Racks & Monitored Humidity
                </h3>
                <p className="text-xs sm:text-sm text-slate-200">
                  Engineered for maximum bio-hygiene, consistent yields, and optimal fruiting conditions all year round.
                </p>
              </div>
            </div>
          </div>

          {/* Six Facility Protocols Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
            {facilityPillars.map((p, idx) => (
              <div 
                key={p.title} 
                className="p-4 bg-[#F7F8F4] rounded-xl border border-[#EAF4EE] hover:border-[#146B4A]/30 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-sm font-bold text-[#0B3D2E] font-display">
                    {p.title}
                  </h4>
                  <span className="text-[10px] font-semibold text-[#146B4A] bg-[#EAF4EE] px-2 py-0.5 rounded">
                    {p.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* CTA Bar */}
        <div className="bg-[#EAF4EE] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#146B4A]/20">
          <div>
            <h4 className="text-lg font-bold text-[#0B3D2E] mb-1 font-display">
              Interested in Bulk Supply or a Farm Partnership Tour?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              We welcome commercial partners, restaurateurs, and institutional food buyers to schedule an inquiry.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => openWhatsApp(WHATSAPP_MESSAGES.tour)}
              className="flex items-center gap-2 px-6 py-3 bg-[#146B4A] hover:bg-[#0B3D2E] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors"
            >
              <span>TAKE A TOUR</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenGallery}
              className="flex items-center gap-2 px-4 py-3 bg-white text-[#0B3D2E] text-xs sm:text-sm font-semibold rounded-xl border border-[#146B4A]/20 hover:bg-slate-50 transition-colors"
            >
              <Eye className="w-4 h-4 text-[#146B4A]" />
              <span>View Gallery</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
