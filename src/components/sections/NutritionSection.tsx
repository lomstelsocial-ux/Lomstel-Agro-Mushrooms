import React from 'react';
import { Info, Sparkles, Check } from 'lucide-react';
import { NUTRITION_FACTS } from '../../constants/initialData';
import { SiteSettings } from '../../types';

interface NutritionSectionProps {
  settings?: SiteSettings;
}

export const NutritionSection: React.FC<NutritionSectionProps> = ({ settings }) => {
  return (
    <section id="nutrition" className="py-20 lg:py-28 bg-[#F7F8F4] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#146B4A] tracking-wider uppercase mb-3">
            <span className="w-5 h-0.5 bg-[#146B4A]" />
            <span>Wholesome Nutrition</span>
            <span className="w-5 h-0.5 bg-[#146B4A]" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3D2E] tracking-tight leading-tight mb-5 font-display">
            {settings?.benefitsHeadline || 'GOOD FOOD STARTS WITH GOOD CHOICES.'}
          </h2>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl mx-auto">
            {settings?.benefitsSubtext || 'Oyster mushrooms are naturally low in calories and fat while providing a variety of nutrients that can complement a balanced diet.'}
          </p>
        </div>

        {/* 8 Visual Nutrition Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {NUTRITION_FACTS.map((fact) => (
            <div 
              key={fact.name}
              className="bg-white rounded-xl p-6 border border-[#EAF4EE] hover:border-[#146B4A]/40 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold tracking-wider text-[#146B4A] uppercase">
                    {fact.name}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#D4A72C]" />
                </div>
                <h3 className="text-base font-bold text-[#0B3D2E] mb-2">
                  {fact.role}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {fact.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Responsible Nutrition Callout & Mandatory Disclaimer */}
        <div className="bg-[#EAF4EE] rounded-2xl p-6 lg:p-8 border border-[#146B4A]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#146B4A] text-white rounded-xl shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-[#D4A72C]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0B3D2E] mb-1">
                Naturally Low in Calories & Fat
              </p>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-2xl">
                Oyster mushrooms are an exceptional culinary ingredient that provides enjoyable texture, savoury flavour, and essential micronutrients for family tables and healthy dining menus.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 bg-white/80 px-4 py-2.5 rounded-xl border border-white shrink-0">
            <Info className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="italic">
              Nutrition values can vary depending on variety, growing conditions and preparation.
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
