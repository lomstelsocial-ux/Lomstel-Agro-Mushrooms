import React, { useState } from 'react';
import { GalleryItem } from '../../types';
import { Maximize2, Tag } from 'lucide-react';

interface GallerySectionProps {
  galleryItems: GalleryItem[];
  onOpenLightbox: (item: GalleryItem) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  galleryItems,
  onOpenLightbox
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Our Farm',
    'Fresh Mushrooms',
    'Packaging',
    'Food & Recipes',
    'Our Facility'
  ];

  const filteredItems = selectedCategory === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-white border-b border-[#EAF4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#146B4A] tracking-wider uppercase mb-3">
            <span className="w-5 h-0.5 bg-[#146B4A]" />
            <span>Visual Showcase</span>
            <span className="w-5 h-0.5 bg-[#146B4A]" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3D2E] tracking-tight leading-tight mb-4 font-display">
            OUR GALLERY
          </h2>

          <p className="text-base sm:text-lg text-slate-600">
            A glimpse into our cultivation facility, fresh harvests, packaging standards, and culinary preparations.
          </p>
        </div>

        {/* Interactive Filter Tabs / Segmented Controls (functional buttons with click handlers) */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-[#F7F8F4] border border-[#EAF4EE] rounded-xl max-w-fit mx-auto mb-12">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#146B4A] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#0B3D2E] hover:bg-white/60'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Responsive Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenLightbox(item)}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-[#EAF4EE] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image Frame */}
              <div className="relative h-72 sm:h-80 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Category chip top left */}
                <div className="absolute top-3.5 left-3.5">
                  <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold rounded-md border border-white/20">
                    {item.category}
                  </span>
                </div>

                {/* Enlarge Icon top right on hover */}
                <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-lg bg-white/80 backdrop-blur-sm text-[#0B3D2E] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </div>

                {/* Caption bottom */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-base font-bold font-display drop-shadow-sm mb-1 text-white">
                    {item.title}
                  </h3>
                  {item.caption && (
                    <p className="text-xs text-slate-300 line-clamp-2">
                      {item.caption}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-sm">
            No images in this category yet. You can add more in the Admin Dashboard!
          </div>
        )}

      </div>
    </section>
  );
};
