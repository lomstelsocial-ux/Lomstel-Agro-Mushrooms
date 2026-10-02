import React from 'react';
import { ShieldCheck, Sparkles, HeartHandshake, UtensilsCrossed, Award } from 'lucide-react';

export const WhyChooseSection: React.FC = () => {
  const reasons = [
    {
      icon: ShieldCheck,
      title: 'Hygienically Grown',
      text: 'Cultivated using modern facilities and controlled growing practices.',
      subtext: 'We control moisture, clean air filtration, and sterile substrate preparation to cultivate mushrooms under optimal agricultural standards.'
    },
    {
      icon: Sparkles,
      title: 'Fresh & Natural',
      text: 'Carefully harvested and packaged with freshness in mind.',
      subtext: 'From harvest basket into breathable eco-packaging within hours, preserving natural plumpness and tender texture.'
    },
    {
      icon: HeartHandshake,
      title: 'Nutrient-Rich',
      text: 'Provides protein, dietary fibre, B vitamins and essential minerals.',
      subtext: 'A wholesome, naturally nutrient-dense plant food that can contribute valuable nourishment as part of a balanced diet.'
    },
    {
      icon: UtensilsCrossed,
      title: 'Tasty & Versatile',
      text: 'Perfect for soups, rice, pasta, sauces, stir-fries and many other meals.',
      subtext: 'Delivers a deep savoury umami depth that elevates both traditional African culinary delicacies and international gourmet recipes.'
    },
    {
      icon: Award,
      title: 'Quality You Can Trust',
      text: 'Carefully handled and hygienically packaged.',
      subtext: 'Officially registered with NAFDAC (A8-121508L) with rigorous quality control before every order leaves our Ogun State facility.'
    }
  ];

  return (
    <section className="py-20 lg:py-24 bg-white border-y border-[#EAF4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#146B4A] tracking-wider uppercase mb-3">
            <span className="w-5 h-0.5 bg-[#146B4A]" />
            <span>The Lomstel Standard</span>
            <span className="w-5 h-0.5 bg-[#146B4A]" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3D2E] tracking-tight leading-tight mb-4 font-display">
            WHY CHOOSE LOMSTEL
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            We hold ourselves to uncompromising standards of freshness, hygiene, and consistency across every harvest.
          </p>
        </div>

        {/* 5 Premium Cards in Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {reasons.slice(0, 3).map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.title}
                className="bg-[#F7F8F4] rounded-2xl p-8 border border-[#EAF4EE] hover:border-[#146B4A]/30 transition-all duration-300 hover:shadow-lg flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#EAF4EE] text-[#146B4A] flex items-center justify-center mb-6 group-hover:bg-[#146B4A] group-hover:text-white transition-colors duration-200 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0B3D2E] mb-2 font-display">
                    {item.title}
                  </h3>
                  <p className="text-sm font-semibold text-[#146B4A] mb-3">
                    {item.text}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.subtext}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Bottom row: 2 centered cards on wide screens */}
          {reasons.slice(3, 5).map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.title}
                className="bg-[#F7F8F4] rounded-2xl p-8 border border-[#EAF4EE] hover:border-[#146B4A]/30 transition-all duration-300 hover:shadow-lg flex flex-col justify-between group lg:col-span-1 md:col-span-1"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#EAF4EE] text-[#146B4A] flex items-center justify-center mb-6 group-hover:bg-[#146B4A] group-hover:text-white transition-colors duration-200 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0B3D2E] mb-2 font-display">
                    {item.title}
                  </h3>
                  <p className="text-sm font-semibold text-[#146B4A] mb-3">
                    {item.text}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
