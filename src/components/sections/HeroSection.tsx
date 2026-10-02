import React from 'react';
import { MessageCircle, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, ShoppingBag } from 'lucide-react';
import { openWhatsApp, WHATSAPP_MESSAGES } from '../../utils/whatsapp';
import { SiteSettings } from '../../types';
import { ASSET_IMAGES } from '../../constants/initialData';

interface HeroSectionProps {
  settings: SiteSettings;
  heroImage: string;
  heroDriedImage?: string;
  onExploreClick: () => void;
  onOpenOrderModal: (productName?: string) => void;
  onSecretAdminTrigger?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  heroImage,
  heroDriedImage,
  onExploreClick,
  onOpenOrderModal,
  onSecretAdminTrigger
}) => {
  const activeHeroFreshImg = settings.heroImage || heroImage || ASSET_IMAGES.hero;
  const activeHeroDriedImg = settings.heroDriedImage || heroDriedImage || ASSET_IMAGES.productDried;

  return (
    <section id="home" className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#EAF4EE]/60 via-[#F7F8F4] to-[#F7F8F4]">
      {/* Ambient background oyster mushroom texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply bg-center bg-cover"
        style={{ backgroundImage: `url(${activeHeroFreshImg})` }}
      />

      {/* Subtle organic background motifs */}
      <div className="absolute top-10 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#146B4A]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 w-80 h-80 rounded-full bg-[#D4A72C]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* NAFDAC Registration Trust Marker (with secret handler for admin) */}
            <div className="inline-flex items-center gap-2 mb-6 text-xs text-[#0B3D2E] font-medium tracking-wide">
              <button 
                type="button"
                onClick={() => {
                  if (onSecretAdminTrigger) {
                    onSecretAdminTrigger();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-[#EAF4EE] border border-[#146B4A]/20 rounded-md shadow-xs select-none cursor-pointer transition-colors"
                title="Lomstel Agro Verification - Admin Portal"
              >
                <ShieldCheck className="w-4 h-4 text-[#146B4A]" />
                <span className="font-semibold">NAFDAC REG. NO.:</span>
                <span className="font-mono tracking-tight font-bold text-[#146B4A]">{settings.nafdacReg}</span>
              </button>
            </div>

            {/* Main Display Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5.5xl font-extrabold text-[#0B3D2E] tracking-tight leading-[1.1] mb-5 font-display">
              {settings.heroHeadline || 'FRESH OYSTER MUSHROOMS, GROWN WITH CARE.'}
            </h1>

            {/* Supporting Subtext */}
            <p className="text-base sm:text-lg text-[#536259] leading-relaxed max-w-xl mb-7">
              {settings.heroSubheadline || 'Discover fresh, natural and nutritious oyster mushrooms, carefully cultivated and hygienically packaged by Lomstel Agro.'}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-2 sm:mb-0">
              <button
                onClick={() => openWhatsApp(WHATSAPP_MESSAGES.fresh)}
                className="flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#146B4A] hover:bg-[#0B3D2E] active:scale-[0.99] text-white text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white/20 group-hover:scale-110 transition-transform" />
                <span>ORDER NOW</span>
              </button>

              <button
                onClick={onExploreClick}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-[#EAF4EE] text-[#0B3D2E] text-base font-semibold border border-[#146B4A]/25 rounded-xl shadow-xs transition-colors duration-150 cursor-pointer"
              >
                <span>EXPLORE OUR MUSHROOMS</span>
                <ArrowRight className="w-4 h-4 text-[#146B4A]" />
              </button>
            </div>

          </div>

          {/* Right Column: Dual High-Definition Photography Showcase (Fresh & Dried) */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-2xl lg:max-w-none">
              
              {/* Backing accent glow */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-[#146B4A]/15 via-[#D4A72C]/15 to-transparent rounded-3xl blur-2xl pointer-events-none" />

              {/* Dual Image Grid: Fresh & Dried Oyster Mushrooms */}
              <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                
                {/* 1. FRESH OYSTER MUSHROOMS CARD */}
                <div 
                  onClick={() => onOpenOrderModal('Fresh Oyster Mushrooms')}
                  className="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl border-4 border-white bg-slate-900 transition-all duration-300 cursor-pointer"
                >
                  <img
                    src={activeHeroFreshImg}
                    alt="Fresh oyster mushrooms grown naturally by Lomstel Agro"
                    className="w-full h-[280px] sm:h-[380px] lg:h-[420px] object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="eager"
                  />
                  
                  {/* Visual gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                  {/* Top Corner Badge: Fresh */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-2.5 py-1 bg-[#0B3D2E]/90 backdrop-blur-sm text-white text-[11px] font-bold rounded-lg shadow-sm border border-white/20">
                    <Sparkles className="w-3 h-3 text-[#D4A72C]" />
                    <span>Fresh Harvest</span>
                  </div>

                  {/* Top Right Mini Tag */}
                  <div className="absolute top-3.5 right-3.5 px-2 py-0.5 bg-emerald-500/90 text-white text-[10px] font-extrabold uppercase tracking-wide rounded-md shadow-xs">
                    In Stock
                  </div>

                  {/* Floating Bottom Card: Fresh Oyster Details */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-white/95 backdrop-blur-md border border-white/80 shadow-md text-[#17211B] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-extrabold text-[#146B4A] uppercase tracking-wider">Cultivated Daily</p>
                      <h3 className="text-xs sm:text-sm font-bold text-[#0B3D2E] leading-tight">Fresh Oyster Mushrooms</h3>
                      <p className="text-[10px] text-slate-500">Tender · Natural moisture</p>
                    </div>
                    <button
                      type="button"
                      className="px-2.5 py-1 bg-[#146B4A] hover:bg-[#0B3D2E] text-white text-[10px] font-bold rounded-lg shadow-xs transition-colors shrink-0"
                    >
                      Order
                    </button>
                  </div>
                </div>

                {/* 2. DRIED OYSTER MUSHROOMS CARD */}
                <div 
                  onClick={() => onOpenOrderModal('Dried Oyster Mushrooms')}
                  className="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl border-4 border-white bg-slate-900 transition-all duration-300 cursor-pointer"
                >
                  <img
                    src={activeHeroDriedImg}
                    alt="Dried oyster mushrooms carefully dehydrated by Lomstel Agro"
                    className="w-full h-[280px] sm:h-[380px] lg:h-[420px] object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="eager"
                  />
                  
                  {/* Visual gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                  {/* Top Corner Badge: Dried */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-2.5 py-1 bg-[#9A6F12]/90 backdrop-blur-sm text-white text-[11px] font-bold rounded-lg shadow-sm border border-white/20">
                    <Sparkles className="w-3 h-3 text-[#D4A72C]" />
                    <span>Dehydrated Gourmet</span>
                  </div>

                  {/* Top Right Mini Tag */}
                  <div className="absolute top-3.5 right-3.5 px-2 py-0.5 bg-[#D4A72C] text-[#0B3D2E] text-[10px] font-extrabold uppercase tracking-wide rounded-md shadow-xs">
                    Long Shelf-Life
                  </div>

                  {/* Floating Bottom Card: Dried Oyster Details */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-white/95 backdrop-blur-md border border-white/80 shadow-md text-[#17211B] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-extrabold text-[#9A6F12] uppercase tracking-wider">Extended Reserve</p>
                      <h3 className="text-xs sm:text-sm font-bold text-[#0B3D2E] leading-tight">Dried Oyster Mushrooms</h3>
                      <p className="text-[10px] text-slate-500">Rich umami · 100% pure</p>
                    </div>
                    <button
                      type="button"
                      className="px-2.5 py-1 bg-[#D4A72C] hover:bg-[#BF9321] text-[#0B3D2E] text-[10px] font-bold rounded-lg shadow-xs transition-colors shrink-0"
                    >
                      Order
                    </button>
                  </div>
                </div>

              </div>

              {/* Sub-label banner indicating dual selection */}
              <div className="mt-3 text-center">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#536259] bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full border border-[#EAF4EE]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#146B4A]" />
                  <span>Both Fresh & Dried Available Daily for Retail, Catering & Wholesale</span>
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
