import React from 'react';
import { ShieldCheck, Leaf, PackageCheck, Award } from 'lucide-react';

export const TrustBar: React.FC = () => {
  const trustItems = [
    {
      icon: ShieldCheck,
      title: 'Hygienically Grown',
      description: 'Cultivated in modern climate-controlled growing chambers following strict agricultural sanitation.',
      badge: 'Controlled'
    },
    {
      icon: Leaf,
      title: 'Freshly Harvested',
      description: 'Hand-picked daily at peak tender maturity to preserve natural moisture and umami depth.',
      badge: 'Daily'
    },
    {
      icon: PackageCheck,
      title: 'Carefully Packaged',
      description: 'Sealed in breathable, food-grade eco-packaging that keeps each oyster cluster pristine.',
      badge: 'Protected'
    },
    {
      icon: Award,
      title: 'Quality You Can Trust',
      description: 'Registered with NAFDAC (A8-121508L) with continuous batch inspections and care.',
      badge: 'NAFDAC Certified'
    }
  ];

  return (
    <section className="relative z-10 -mt-6 sm:-mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl border border-[#EAF4EE] p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {trustItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={item.title}
                className="flex items-start gap-4 p-2 group"
              >
                <div className="p-3 bg-[#EAF4EE] text-[#146B4A] rounded-xl group-hover:bg-[#146B4A] group-hover:text-white transition-colors duration-200 shrink-0">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-base font-bold text-[#0B3D2E] tracking-tight">
                      {item.title}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                    {item.description}
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
