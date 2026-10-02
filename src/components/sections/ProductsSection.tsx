import React from 'react';
import { MessageCircle, Check, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { openWhatsApp, WHATSAPP_MESSAGES } from '../../utils/whatsapp';

interface ProductsSectionProps {
  products: Product[];
  onOpenOrderModal: (productName: string) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  products,
  onOpenOrderModal
}) => {
  return (
    <section id="products" className="py-20 lg:py-28 bg-white border-b border-[#EAF4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#146B4A] tracking-wider uppercase mb-3">
            <span className="w-5 h-0.5 bg-[#146B4A]" />
            <span>Farm Fresh Catalog</span>
            <span className="w-5 h-0.5 bg-[#146B4A]" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3D2E] tracking-tight leading-tight mb-4 font-display">
            OUR MUSHROOM PRODUCTS
          </h2>

          <p className="text-base sm:text-lg text-slate-600">
            Carefully cultivated, hygienically packaged, and delivered fresh to households and culinary enterprises.
          </p>
        </div>

        {/* 3 Product Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const isWholesale = product.category === 'wholesale';
            const isFresh = product.category === 'fresh';

            let buttonText = 'ORDER FRESH MUSHROOMS';
            let defaultMessage = WHATSAPP_MESSAGES.fresh;

            if (product.category === 'dried') {
              buttonText = 'ORDER DRIED MUSHROOMS';
              defaultMessage = WHATSAPP_MESSAGES.dried;
            } else if (product.category === 'wholesale') {
              buttonText = 'REQUEST WHOLESALE PRICE';
              defaultMessage = WHATSAPP_MESSAGES.wholesale;
            }

            return (
              <div 
                key={product.id}
                className="bg-[#F7F8F4] rounded-2xl border border-[#EAF4EE] hover:border-[#146B4A]/30 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Image Header with Scrim and In-Stock indicator */}
                <div>
                  <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-900">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

                    {/* Category Label */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0B3D2E]/90 backdrop-blur-sm text-white text-xs font-bold rounded-lg border border-white/20">
                        {product.tagline}
                      </span>
                    </div>

                    {/* Stock Status */}
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm text-[#146B4A] text-xs font-semibold rounded-md shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-[#146B4A]" />
                        {product.inStock ? 'Available' : 'Harvesting Soon'}
                      </span>
                    </div>

                    {/* Bottom Title on Image */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-[11px] font-semibold text-[#D4A72C] uppercase tracking-wider block mb-0.5">
                        Lomstel Standard
                      </span>
                      <h3 className="text-xl font-bold font-display text-white drop-shadow-sm">
                        {product.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <p className="text-sm text-slate-700 leading-relaxed mb-5">
                      {product.description}
                    </p>

                    {/* Packaging / Unit info */}
                    <div className="p-3 bg-white rounded-xl border border-[#EAF4EE] mb-5 text-xs text-slate-600">
                      <span className="font-semibold text-[#0B3D2E] block mb-1">Standard Packaging:</span>
                      <span>{product.unit}</span>
                    </div>

                    {/* Culinary Use Cases / Highlights */}
                    {product.useCases && product.useCases.length > 0 && (
                      <div className="mb-6">
                        <span className="text-xs font-bold text-[#146B4A] uppercase tracking-wider block mb-2.5">
                          Ideal For:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {product.useCases.map((useCase) => (
                            <span 
                              key={useCase}
                              className="text-xs px-2.5 py-1 bg-white border border-[#EAF4EE] text-slate-700 rounded-md font-medium"
                            >
                              {useCase}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Features Bullet points */}
                    <div className="space-y-2 mb-6">
                      {product.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                          <Check className="w-3.5 h-3.5 text-[#146B4A] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-6 pt-0 space-y-2.5">
                  <button
                    onClick={() => openWhatsApp(product.whatsappMessage || defaultMessage)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#146B4A] hover:bg-[#0B3D2E] active:scale-[0.99] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all duration-150"
                  >
                    <MessageCircle className="w-4 h-4 fill-white/20" />
                    <span>{buttonText}</span>
                  </button>

                  <button
                    onClick={() => onOpenOrderModal(product.name)}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-[#0B3D2E] bg-white hover:bg-[#EAF4EE] border border-[#146B4A]/20 rounded-xl transition-colors text-center"
                  >
                    Fill Web Order Form
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* NAFDAC Trust Guarantee Bar below products */}
        <div className="mt-12 text-center text-xs text-slate-500 flex flex-wrap items-center justify-center gap-3">
          <span className="flex items-center gap-1 font-semibold text-[#146B4A]">
            <ShieldCheck className="w-4 h-4" /> NAFDAC REG. NO.: A8-121508L
          </span>
          <span>·</span>
          <span>Hygienically Cultivated & Packaged in Ogun State, Nigeria</span>
          <span>·</span>
          <span>Wholesale & Household Deliveries</span>
        </div>

      </div>
    </section>
  );
};
