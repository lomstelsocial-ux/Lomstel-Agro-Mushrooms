import React, { useState } from 'react';
import { Sparkles, Eye } from 'lucide-react';
import { SiteSettings, ScrollingBannerItem } from '../../types';
import { LightboxModal } from '../modals/LightboxModal';
import { ASSET_IMAGES } from '../../constants/initialData';

interface ScrollingImageBannerProps {
  settings: SiteSettings;
}

export const ScrollingImageBanner: React.FC<ScrollingImageBannerProps> = ({
  settings
}) => {
  const [selectedLightboxImage, setSelectedLightboxImage] = useState<{
    imageUrl: string;
    title: string;
    caption?: string;
  } | null>(null);

  // Active scrolling images from settings, fallback to initial items
  const rawList = settings.scrollingImages?.filter((item) => item.enabled) || [];
  
  const fallbackList: ScrollingBannerItem[] = [
    {
      id: 'fb-1',
      imageUrl: ASSET_IMAGES.hero,
      title: 'Fresh Oyster Mushroom Cluster',
      caption: 'Naturally cultivated with delicate silver-grey flushes and rich tenderness',
      enabled: true
    },
    {
      id: 'fb-2',
      imageUrl: ASSET_IMAGES.productDried,
      title: 'Gourmet Dehydrated Oyster Packs',
      caption: 'Slow-dried to lock in concentrated earthy aroma and long-lasting shelf life',
      enabled: true
    },
    {
      id: 'fb-3',
      imageUrl: ASSET_IMAGES.harvest,
      title: 'Daily Morning Hand-Harvest',
      caption: 'Harvested daily at peak tender maturity for optimum culinary texture',
      enabled: true
    },
    {
      id: 'fb-4',
      imageUrl: ASSET_IMAGES.packaging,
      title: 'Hygienic Sealed Eco-Packs',
      caption: 'Carefully graded, cleaned, and packed under strict sanitary standards',
      enabled: true
    },
    {
      id: 'fb-5',
      imageUrl: ASSET_IMAGES.facility,
      title: 'Modern Growing Chambers',
      caption: 'Controlled temperature and humidity for clean, pesticide-free cultivation',
      enabled: true
    },
    {
      id: 'fb-6',
      imageUrl: ASSET_IMAGES.culinary,
      title: 'Chef-Grade Culinary Mushroom Dish',
      caption: 'Meat-like savory texture perfect for pepper soups, rice, pastas, and roasts',
      enabled: true
    },
    {
      id: 'fb-7',
      imageUrl: ASSET_IMAGES.productFresh,
      title: 'Prime 200g & 500g Fresh Punnets',
      caption: 'Ready for grocery distribution, restaurant kitchens, and home cooks',
      enabled: true
    }
  ];

  const activeItems = rawList.length > 0 ? rawList : fallbackList;

  // Duplicate items to ensure smooth continuous marquee loop
  const loopItems = [...activeItems, ...activeItems];

  return (
    <section className="py-12 bg-white border-y border-[#EAF4EE] overflow-hidden relative">
      {/* Decorative background glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-[#146B4A]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-[#D4A72C]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAF4EE] text-[#146B4A] rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A72C]" />
              <span>Continuous Live Showcase</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B3D2E] tracking-tight font-display">
              From Our Farm to Your Table
            </h2>
            <p className="text-sm text-[#536259] mt-1 max-w-xl">
              Take a visual tour of our daily mushroom cultivation, harvesting, hygienic packaging, and culinary recipes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Hover to pause · Click photo to enlarge
            </span>
          </div>
        </div>
      </div>

      {/* Auto-scrolling Track Wrapper with edge gradient masks */}
      <div className="relative w-full overflow-hidden">
        {/* Left edge shadow gradient mask */}
        <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        {/* Right edge shadow gradient mask */}
        <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

        {/* Marquee Motion Track */}
        <div className="animate-marquee-track flex gap-5 py-2">
          {loopItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              onClick={() => setSelectedLightboxImage({
                imageUrl: item.imageUrl,
                title: item.title,
                caption: item.caption
              })}
              className="group relative w-[280px] sm:w-[340px] h-[210px] sm:h-[240px] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-[#EAF4EE] bg-[#0B3D2E] shrink-0 cursor-pointer transition-all duration-300"
            >
              {/* Photo Image */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:via-black/40 transition-colors" />

              {/* Top Inspect Icon Badge */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="p-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white inline-flex items-center justify-center">
                  <Eye className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                <h3 className="font-bold text-sm tracking-tight line-clamp-1 group-hover:text-[#D4A72C] transition-colors">
                  {item.title}
                </h3>
                {item.caption && (
                  <p className="text-xs text-slate-200 line-clamp-1 mt-0.5 font-light">
                    {item.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox inspection modal */}
      {selectedLightboxImage && (
        <LightboxModal
          item={{
            id: 'scrolling-lightbox',
            title: selectedLightboxImage.title,
            imageUrl: selectedLightboxImage.imageUrl,
            category: 'Our Farm',
            caption: selectedLightboxImage.caption
          }}
          onClose={() => setSelectedLightboxImage(null)}
        />
      )}
    </section>
  );
};
