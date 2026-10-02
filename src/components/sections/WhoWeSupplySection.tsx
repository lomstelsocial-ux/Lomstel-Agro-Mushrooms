import React from 'react';
import { Home, Utensils, Building2, ShoppingBag, ChefHat, MessageCircle, ArrowRight } from 'lucide-react';
import { openWhatsApp, WHATSAPP_MESSAGES } from '../../utils/whatsapp';

export const WhoWeSupplySection: React.FC = () => {
  const audiences = [
    {
      title: 'HOME & FAMILY',
      tagline: 'Wholesome Household Meals',
      description: 'For everyday family meals. Freshly harvested mushrooms delivered to your doorstep to bring rich taste and nutrition to soups, jollof, and weekend feasts.',
      icon: Home
    },
    {
      title: 'RESTAURANTS',
      tagline: 'Professional Kitchens',
      description: 'Quality mushrooms for professional kitchens. Uniform cluster sizes, exceptional umami retention, and predictable deliveries that chefs can rely upon.',
      icon: Utensils
    },
    {
      title: 'HOTELS',
      tagline: 'Hospitality Dining',
      description: 'Fresh mushroom supply for hospitality businesses. Meets five-star culinary standards for banquet operations, continental breakfast menus, and executive buffets.',
      icon: Building2
    },
    {
      title: 'SUPERMARKETS',
      tagline: 'Retail Produce Aisles',
      description: 'Packaged mushrooms for retail customers. Conveniently barcoded, food-grade transparent packaging with certified NAFDAC labeling ready for immediate retail display.',
      icon: ShoppingBag
    },
    {
      title: 'CATERERS & FOOD BUSINESSES',
      tagline: 'Events & Mass Catering',
      description: 'Bulk supply for food preparation and events. Cost-effective crate dispatch with guaranteed freshness for large-scale weddings, corporate parties, and food processing.',
      icon: ChefHat
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#F7F8F4] border-b border-[#EAF4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#146B4A] tracking-wider uppercase mb-3">
            <span className="w-5 h-0.5 bg-[#146B4A]" />
            <span>Commercial & Consumer Distribution</span>
            <span className="w-5 h-0.5 bg-[#146B4A]" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3D2E] tracking-tight leading-tight mb-4 font-display">
            WHO WE SUPPLY
          </h2>

          <p className="text-base sm:text-lg text-slate-700">
            From single household orders to multi-ton hospitality contracts, Lomstel Agro powers kitchens of all sizes with premium oyster mushrooms.
          </p>
        </div>

        {/* 5 Audience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {audiences.slice(0, 3).map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.title}
                className="bg-white rounded-2xl p-7 border border-[#EAF4EE] hover:border-[#146B4A]/30 transition-all duration-300 hover:shadow-lg flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#EAF4EE] text-[#146B4A] flex items-center justify-center mb-5 group-hover:bg-[#146B4A] group-hover:text-white transition-colors duration-200">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-[#D4A72C] uppercase tracking-wider block mb-1">
                    {item.tagline}
                  </span>
                  <h3 className="text-lg font-bold text-[#0B3D2E] mb-3 font-display">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}

          {audiences.slice(3, 5).map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.title}
                className="bg-white rounded-2xl p-7 border border-[#EAF4EE] hover:border-[#146B4A]/30 transition-all duration-300 hover:shadow-lg flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#EAF4EE] text-[#146B4A] flex items-center justify-center mb-5 group-hover:bg-[#146B4A] group-hover:text-white transition-colors duration-200">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-[#D4A72C] uppercase tracking-wider block mb-1">
                    {item.tagline}
                  </span>
                  <h3 className="text-lg font-bold text-[#0B3D2E] mb-3 font-display">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Quick Partnership Banner Card */}
          <div className="bg-gradient-to-br from-[#0B3D2E] to-[#146B4A] rounded-2xl p-7 text-white flex flex-col justify-between shadow-md">
            <div>
              <span className="text-xs font-bold text-[#D4A72C] uppercase tracking-wider block mb-2">
                Custom Schedule
              </span>
              <h3 className="text-xl font-bold font-display mb-3 text-white">
                Need regular supply? Talk to Lomstel Agro.
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-6">
                We establish tailored standing weekly orders with priority harvesting, volume discounts, and scheduled drops.
              </p>
            </div>
            
            <button
              onClick={() => openWhatsApp(WHATSAPP_MESSAGES.hospitality)}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-white text-[#0B3D2E] hover:bg-[#EAF4EE] text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              <span>REQUEST BUSINESS SUPPLY</span>
              <ArrowRight className="w-4 h-4 text-[#146B4A]" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
