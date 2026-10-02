import React, { useState } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Testimonial } from '../../types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const published = testimonials.filter(t => t.isPublished);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (published.length === 0) return null;

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % published.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + published.length) % published.length);
  };

  const active = published[currentIndex];

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-[#EAF4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#146B4A] tracking-wider uppercase mb-3">
            <span className="w-5 h-0.5 bg-[#146B4A]" />
            <span>Community Feedback</span>
            <span className="w-5 h-0.5 bg-[#146B4A]" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3D2E] tracking-tight leading-tight mb-4 font-display">
            WHAT OUR CUSTOMERS SAY
          </h2>

          <p className="text-base text-slate-600">
            Real feedback from households, chefs, and culinary businesses who prepare meals with Lomstel Oyster Mushrooms.
          </p>
        </div>

        {/* Carousel / Focus Quote Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#F7F8F4] rounded-3xl p-8 sm:p-12 border border-[#EAF4EE] shadow-sm relative">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#146B4A] flex items-center justify-center mb-6 shadow-xs border border-[#EAF4EE]">
              <Quote className="w-6 h-6 fill-[#146B4A]/10 text-[#146B4A]" />
            </div>

            <p className="text-xl sm:text-2xl lg:text-3xl text-[#0B3D2E] font-medium leading-relaxed mb-6 font-display italic">
              "{active.quote}"
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-[#EAF4EE]">
              <div>
                <p className="text-sm font-bold text-[#0B3D2E]">
                  — {active.clientType}
                </p>
                {active.location && (
                  <p className="text-xs text-slate-500">
                    {active.location}
                  </p>
                )}
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevTestimonial}
                  className="p-2 rounded-xl bg-white border border-[#EAF4EE] text-[#0B3D2E] hover:bg-[#EAF4EE] transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="p-2 rounded-xl bg-white border border-[#EAF4EE] text-[#0B3D2E] hover:bg-[#EAF4EE] transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {published.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  idx === currentIndex ? 'w-8 bg-[#146B4A]' : 'w-2 bg-slate-300'
                }`}
                aria-label={`Jump to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
