import React from 'react';
import { Sparkles, Utensils, Droplets, Scissors, Flame, Soup } from 'lucide-react';
import { ASSET_IMAGES } from '../../constants/initialData';

export const HowToPrepareSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Wash & Clean Appropriately',
      description: 'Gently wipe off any natural dust with a damp cloth or brief cool water rinse. Drain well on paper towels.',
      icon: Droplets
    },
    {
      num: '02',
      title: 'Slice or Tear to Size',
      description: 'Trim the tough base of the stem. Slice caps neatly or tear with your hands along the natural grain for tender shreds.',
      icon: Scissors
    },
    {
      num: '03',
      title: 'Add to Your Favourite Meal',
      description: 'Fold into your seasoning base, garlic butter, tomato stew, peppersoup broth, or wok aromatics.',
      icon: Flame
    },
    {
      num: '04',
      title: 'Cook & Enjoy',
      description: 'Sauté for 4–6 minutes until edges turn golden-brown, or simmer gently in soups for deep savoury aroma.',
      icon: Utensils
    }
  ];

  const mealIdeas = [
    {
      title: 'Mushroom Jollof Rice',
      description: 'Seared oyster mushrooms fold beautifully into smoky party jollof rice, infusing rich savoury umami juices throughout every grain.'
    },
    {
      title: 'Mushroom Pepper Soup & Soups',
      description: 'Perfect for Egusi, Ogbono, Edikang Ikong, or spicy Nigerian pepper soup—soaking up rich broth spices while keeping tender bite.'
    },
    {
      title: 'Mushroom Stir-Fry',
      description: 'High-heat wok-tossed with sweet bell peppers, ginger, spring onions, and toasted sesame oil for a fast 10-minute dinner.'
    },
    {
      title: 'Mushroom Pasta & Creamy Sauces',
      description: 'Browned golden with garlic and fresh herbs, folded into pasta sauces or warm crusty baguettes.'
    },
    {
      title: 'Savoury Mushroom Tomato Sauce',
      description: 'Simmered in rich Nigerian tomato-pepper stew served over white rice, boiled yam, or plantains.'
    },
    {
      title: 'Mushroom Vegetable Delicacies',
      description: 'Mixed into vegetable medley sautés, spinach efo riro, or steamed grain power bowls.'
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#F7F8F4] border-b border-[#EAF4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#146B4A] tracking-wider uppercase mb-3">
            <span className="w-5 h-0.5 bg-[#146B4A]" />
            <span>Kitchen & Culinary Guide</span>
            <span className="w-5 h-0.5 bg-[#146B4A]" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3D2E] tracking-tight leading-tight mb-4 font-display">
            SO MANY WAYS TO ENJOY MUSHROOMS.
          </h2>

          <p className="text-base sm:text-lg text-slate-700">
            From classic West African comfort staples to fast modern stir-fries, Lomstel Oyster Mushrooms bring tender texture and natural savoury depth to every dish.
          </p>
        </div>

        {/* 4 Step Process Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.num}
                className="bg-white rounded-2xl p-6 border border-[#EAF4EE] shadow-xs hover:shadow-md transition-shadow relative"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-[#D4A72C] font-display">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#EAF4EE] text-[#146B4A] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#0B3D2E] mb-2 font-display">
                  {step.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Featured Culinary Showcase & Meal Ideas */}
        <div className="bg-white rounded-3xl border border-[#EAF4EE] overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left: Recipe Dish Photography */}
          <div className="lg:col-span-5 relative min-h-[340px] bg-slate-900">
            <img 
              src={ASSET_IMAGES.culinary} 
              alt="Mushroom Jollof Rice prepared with Lomstel oyster mushrooms"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
            
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-xs font-bold text-[#D4A72C] uppercase tracking-wider block mb-1">
                Featured African Culinary Idea
              </span>
              <h4 className="text-xl sm:text-2xl font-bold font-display leading-tight mb-2">
                Aromatic Mushroom Jollof Rice
              </h4>
              <p className="text-xs text-slate-200">
                Lomstel fresh oyster mushrooms browned in fragrant palm or vegetable oil with onions, thyme, and habanero before simmering.
              </p>
            </div>
          </div>

          {/* Right: Recipe Ideas Grid */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            <h4 className="text-xl sm:text-2xl font-bold text-[#0B3D2E] mb-2 font-display">
              Popular Everyday African & International Ideas
            </h4>
            <p className="text-sm text-slate-600 mb-6">
              Oyster mushrooms absorb seasonings rapidly without getting rubbery, making them an ideal culinary canvas for:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mealIdeas.map((meal) => (
                <div key={meal.title} className="p-3.5 bg-[#F7F8F4] rounded-xl border border-[#EAF4EE]">
                  <h5 className="text-sm font-bold text-[#0B3D2E] mb-1">
                    {meal.title}
                  </h5>
                  <p className="text-xs text-slate-600 leading-snug">
                    {meal.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
