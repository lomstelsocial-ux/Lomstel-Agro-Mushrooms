import { Product, GalleryItem, FAQItem, Testimonial, SiteSettings, Order, VideoItem } from '../types';

import heroImg from '../assets/images/hero_oyster_mushrooms_1790285013523.jpg';
import farmFacilityImg from '../assets/images/farm_cultivation_facility_1790285025192.jpg';
import productFreshImg from '../assets/images/product_fresh_oyster_1790285035475.jpg';
import productDriedImg from '../assets/images/product_dried_oyster_1790285045667.jpg';
import culinaryDishImg from '../assets/images/culinary_mushroom_dish_1790285055084.jpg';
import harvestImg from '../assets/images/gallery_mushroom_harvest_1790285103348.jpg';
import packagingImg from '../assets/images/gallery_packaging_sealed_1790285113816.jpg';

export const ASSET_IMAGES = {
  hero: heroImg,
  facility: farmFacilityImg,
  productFresh: productFreshImg,
  productDried: productDriedImg,
  culinary: culinaryDishImg,
  harvest: harvestImg,
  packaging: packagingImg,
};

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  brandName: 'Lomstel Agro',
  tagline: 'Growing for a Better Tomorrow.',
  nafdacReg: 'A8-121508L',
  primaryPhone: '+234 812 468 0837',
  secondaryPhone: '+234 806 543 0680',
  whatsappNumber: '2348124680837',
  email: 'lomstelsocial@gmail.com',
  mainWebsite: 'https://www.lomstel.com',
  mushroomWebsite: 'https://lomstelmushroom.mobirisesite.com/',
  locationAddress: '35, Ewuosho Street, off Aiyetoro Road, Kanuyi, Ogun State, Nigeria.',
  heroHeadline: 'FRESH OYSTER MUSHROOMS, GROWN WITH CARE.',
  heroSubheadline: 'Discover fresh, natural and nutritious oyster mushrooms, carefully cultivated and hygienically packaged by Lomstel Agro.',
  heroImage: ASSET_IMAGES.hero,
  heroDriedImage: ASSET_IMAGES.productDried,
  heroCtaText: 'ORDER NOW',
  aboutTitle: 'FROM OUR FARM TO YOUR TABLE.',
  aboutText: 'Lomstel Oyster Mushrooms are carefully and hygienically cultivated using modern farming facilities and controlled growing practices. Freshly harvested and thoughtfully packaged, they provide a natural, delicious and wholesome addition to everyday meals.',
  aboutImage: ASSET_IMAGES.facility,
  benefitsHeadline: 'GOOD FOOD STARTS WITH GOOD CHOICES.',
  benefitsSubtext: 'Oyster mushrooms are naturally low in calories and fat while providing a variety of nutrients that can complement a balanced diet.',
  facilityHeadline: 'SEE WHERE YOUR MUSHROOMS COME FROM.',
  facilitySubtext: 'Take a closer look at the environment where Lomstel Oyster Mushrooms are cultivated, harvested and prepared.',
  facilityImage: ASSET_IMAGES.facility,
  contactHeadline: 'GET IN TOUCH WITH LOMSTEL AGRO',
  primaryColor: '#146B4A',
  darkGreenColor: '#0B3D2E',
  goldColor: '#D4A72C',
  fontFamily: 'Outfit',
  socialLinks: [
    {
      id: 'soc-fb',
      platform: 'facebook',
      name: 'Facebook',
      url: 'https://facebook.com/lomstelagro',
      enabled: true
    },
    {
      id: 'soc-ig',
      platform: 'instagram',
      name: 'Instagram',
      url: 'https://instagram.com/lomstelagro',
      enabled: true
    },
    {
      id: 'soc-wa',
      platform: 'whatsapp',
      name: 'WhatsApp Direct',
      url: 'https://wa.me/2348124680837',
      enabled: true
    },
    {
      id: 'soc-tk',
      platform: 'tiktok',
      name: 'TikTok',
      url: 'https://tiktok.com/@lomstelagro',
      enabled: true
    },
    {
      id: 'soc-yt',
      platform: 'youtube',
      name: 'YouTube',
      url: 'https://youtube.com/@lomstelagro',
      enabled: true
    },
    {
      id: 'soc-li',
      platform: 'linkedin',
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/lomstelagro',
      enabled: true
    },
    {
      id: 'soc-tw',
      platform: 'twitter',
      name: 'X (Twitter)',
      url: 'https://x.com/lomstelagro',
      enabled: false
    },
    {
      id: 'soc-tg',
      platform: 'telegram',
      name: 'Telegram',
      url: 'https://t.me/lomstelagro',
      enabled: false
    }
  ],
  scrollingImages: [
    {
      id: 'scroll-1',
      imageUrl: ASSET_IMAGES.hero,
      title: 'Fresh Oyster Mushroom Cluster',
      caption: 'Naturally cultivated with delicate silver-grey flushes and rich tenderness',
      enabled: true
    },
    {
      id: 'scroll-2',
      imageUrl: ASSET_IMAGES.productDried,
      title: 'Gourmet Dehydrated Oyster Packs',
      caption: 'Slow-dried to lock in concentrated earthy aroma and long-lasting shelf life',
      enabled: true
    },
    {
      id: 'scroll-3',
      imageUrl: ASSET_IMAGES.harvest,
      title: 'Daily Morning Hand-Harvest',
      caption: 'Harvested daily at peak tender maturity for optimum culinary texture',
      enabled: true
    },
    {
      id: 'scroll-4',
      imageUrl: ASSET_IMAGES.packaging,
      title: 'Hygienic Sealed Eco-Packs',
      caption: 'Carefully graded, cleaned, and packed under strict sanitary standards',
      enabled: true
    },
    {
      id: 'scroll-5',
      imageUrl: ASSET_IMAGES.facility,
      title: 'Modern Growing Chambers',
      caption: 'Controlled temperature and humidity for clean, pesticide-free cultivation',
      enabled: true
    },
    {
      id: 'scroll-6',
      imageUrl: ASSET_IMAGES.culinary,
      title: 'Chef-Grade Culinary Mushroom Dish',
      caption: 'Meat-like savory texture perfect for pepper soups, rice, pastas, and roasts',
      enabled: true
    },
    {
      id: 'scroll-7',
      imageUrl: ASSET_IMAGES.productFresh,
      title: 'Prime 200g & 500g Fresh Punnets',
      caption: 'Ready for grocery distribution, restaurant kitchens, and home cooks',
      enabled: true
    }
  ],
  videoSectionHeadline: 'WATCH OUR FARM IN ACTION',
  videoSectionSubheadline: 'Experience how Lomstel Agro cultivates, harvests, and prepares premium oyster mushrooms with hygienic excellence.',
  videos: [
    {
      id: 'vid-1',
      title: 'How Fresh Oyster Mushrooms Are Cultivated & Harvested Daily',
      youtubeUrl: 'https://www.youtube.com/watch?v=F_fK8d6c7uE',
      category: 'Farm Tour & Harvest',
      description: 'Take a virtual tour through the controlled growing chambers at Lomstel Agro. See morning hand-harvesting at peak tenderness and humidity misting systems in action.',
      duration: '4:15',
      enabled: true,
      featured: true
    },
    {
      id: 'vid-2',
      title: 'Culinary Masterclass: Gourmet Oyster Mushroom Pepper Soup & Stir-Fry',
      youtubeUrl: 'https://www.youtube.com/watch?v=Y_1e5Wf2oYw',
      category: 'Recipes & Culinary',
      description: 'Learn how to cook tender oyster mushrooms to perfection. Absorbs native herbs and peppers to create a savory, meat-like healthy delicacy.',
      duration: '6:30',
      enabled: true,
      featured: false
    },
    {
      id: 'vid-3',
      title: 'Hygienic Sorting, Cleaning & Sealed Eco-Packaging Standards',
      youtubeUrl: 'https://www.youtube.com/watch?v=kGq_R1n7fS4',
      category: 'Packaging & Quality',
      description: 'Watch our strict sanitary packaging workflow. Every punnet is carefully inspected, weighed, and sealed to ensure maximum freshness from farm to table.',
      duration: '3:45',
      enabled: true,
      featured: false
    }
  ]
};

export const INITIAL_VIDEOS = INITIAL_SITE_SETTINGS.videos || [];

export const INITIAL_CUSTOMER_LEADS = [
  {
    id: 'lead-1',
    name: 'Chef Olumide (The Heritage Bistro)',
    phone: '+2348035551234',
    email: 'chef@heritagebistro.ng',
    category: 'Restaurant' as const,
    interest: 'Looking for 15kg fresh oyster mushrooms weekly for pasta & risotto dishes',
    status: 'Sample Requested' as const,
    lastContacted: '2026-09-23T14:00:00Z',
    notes: 'Requested sample batch delivered on Tuesday. Prefers medium-cap clusters.'
  },
  {
    id: 'lead-2',
    name: 'Abeokuta Continental Hotel',
    phone: '+2348129998877',
    email: 'procurement@abeokutacontinental.com',
    category: 'Hotel' as const,
    interest: 'Breakfast buffet and banquet sautéed mushroom supply (25kg/week)',
    status: 'Inquiry' as const,
    lastContacted: '2026-09-24T09:30:00Z',
    notes: 'Needs NAFDAC compliance certificate on file and VAT invoice.'
  },
  {
    id: 'lead-3',
    name: 'Mrs. Folashade Adeleke',
    phone: '+2348021113344',
    email: 'folashade@gmail.com',
    category: 'Home & Family' as const,
    interest: 'Household fresh pack (2kg) twice a month for family vegetable soups',
    status: 'Regular Client' as const,
    lastContacted: '2026-09-22T16:15:00Z',
    notes: 'Loves the tenderness in Egusi soup.'
  },
  {
    id: 'lead-4',
    name: 'PrimeMart Supermarket (Ikeja)',
    phone: '+2348094447788',
    email: 'freshproduce@primemart.ng',
    category: 'Supermarket' as const,
    interest: 'Pre-packaged barcoded 500g trays (50 packs per delivery)',
    status: 'Follow-up Needed' as const,
    lastContacted: '2026-09-21T11:00:00Z',
    notes: 'Reviewing retail margin structure and shelf-life display trays.'
  }
];


export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-fresh-oyster',
    name: 'Lomstel Fresh Oyster Mushrooms',
    category: 'fresh',
    tagline: 'Freshly Harvested Daily',
    description: 'Freshly harvested oyster mushrooms with a delicate texture and savoury flavour. Perfect for everyday home and restaurant cooking.',
    unit: 'Packaged in breathable eco-boxes (500g / 1kg / 2kg)',
    priceEstimate: 'Available on request',
    minOrder: 'Single packs or wholesale bulk',
    image: ASSET_IMAGES.productFresh,
    features: [
      'Delicate, tender texture and savoury umami profile',
      'Harvested at peak freshness on delivery day',
      'Hygienically sorted and packaged in eco-friendly material',
      'Ready for quick culinary preparation'
    ],
    useCases: [
      'Soups',
      'Rice (e.g. Jollof rice)',
      'Pasta',
      'Sauces',
      'Stir-fries',
      'Vegetable dishes'
    ],
    inStock: true,
    whatsappMessage: 'Hello Lomstel Agro, I would like to order Fresh Oyster Mushrooms. Please send me the available sizes, prices and delivery options.'
  },
  {
    id: 'prod-dried-oyster',
    name: 'Lomstel Dried Oyster Mushrooms',
    category: 'dried',
    tagline: 'Long Shelf-Life & Rich Flavour',
    description: 'A convenient and flavourful option that is easy to store and use in a variety of meals. Rehydrates quickly to bring deep, savoury goodness.',
    unit: 'Sealed food-grade pouch (100g / 250g / 500g)',
    priceEstimate: 'Available on request',
    minOrder: 'Standard pouches or bulk sacks',
    image: ASSET_IMAGES.productDried,
    features: [
      'Concentrated natural umami aroma and taste',
      'Long ambient shelf-life without chemical preservatives',
      'Rehydrates in warm water within 15 minutes',
      'Ideal for pantry storage and emergency gourmet cooking'
    ],
    useCases: [
      'Traditional Nigerian soups (Egusi, Ogbono, Vegetable)',
      'Rich pepper soups and broths',
      'Stews and simmered sauces',
      'Grain bowls and porridge',
      'Catering preparations'
    ],
    inStock: true,
    whatsappMessage: 'Hello Lomstel Agro, I would like to order Dried Oyster Mushrooms. Please send me the available sizes, prices and delivery options.'
  },
  {
    id: 'prod-wholesale-bulk',
    name: 'Wholesale / Bulk Supply',
    category: 'wholesale',
    tagline: 'B2B Regular Delivery Schedule',
    description: 'Reliable mushroom supply for restaurants, hotels, supermarkets, caterers, retailers and food businesses. Consistent volume and punctual deliveries.',
    unit: 'Bulk crates / Commercial sacks / Customized retail packings',
    priceEstimate: 'Tiered B2B wholesale rates',
    minOrder: 'Weekly or contract deliveries',
    image: ASSET_IMAGES.packaging,
    features: [
      'Guaranteed regular supply schedule',
      'Standardized quality control matching commercial kitchen standards',
      'Flexible delivery frequency across Ogun State & Lagos',
      'Priority customer support and customized packaging for retailers'
    ],
    useCases: [
      'Hotel buffet and dining operations',
      'Restaurant menu mainstays and seasonal specials',
      'Supermarket fresh produce aisles',
      'Large-scale event caterers',
      'Food processing and specialty retail'
    ],
    inStock: true,
    whatsappMessage: 'Hello Lomstel Agro, I am interested in wholesale/bulk oyster mushroom supply. Please send me your wholesale prices and minimum order quantities.'
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Pristine Oyster Mushroom Clusters',
    category: 'Fresh Mushrooms',
    imageUrl: ASSET_IMAGES.hero,
    caption: 'Freshly harvested oyster mushrooms displaying healthy, pearly caps.'
  },
  {
    id: 'gal-2',
    title: 'Climate-Controlled Growing Chambers',
    category: 'Our Facility',
    imageUrl: ASSET_IMAGES.facility,
    caption: 'Modern vertical growing racks with monitored humidity and gentle airflow.'
  },
  {
    id: 'gal-3',
    title: 'Fresh Packaged Trays',
    category: 'Packaging',
    imageUrl: ASSET_IMAGES.productFresh,
    caption: 'Hygienically sealed packages ready for delivery to stores and homes.'
  },
  {
    id: 'gal-4',
    title: 'Gourmet Mushroom Jollof Rice',
    category: 'Food & Recipes',
    imageUrl: ASSET_IMAGES.culinary,
    caption: 'Seared oyster mushrooms folded into aromatic African jollof rice.'
  },
  {
    id: 'gal-5',
    title: 'Careful Daily Harvesting',
    category: 'Our Farm',
    imageUrl: ASSET_IMAGES.harvest,
    caption: 'Hand-picked by trained farm staff wearing clean gloves and protective wear.'
  },
  {
    id: 'gal-6',
    title: 'Sealed Eco-Kraft Pouches',
    category: 'Packaging',
    imageUrl: ASSET_IMAGES.productDried,
    caption: 'Airtight packaging preserving natural aroma and prolonged shelf stability.'
  }
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    order: 1,
    question: 'Are Lomstel Oyster Mushrooms safe and hygienic?',
    answer: 'Yes, absolutely. Lomstel Agro operates under strict hygiene protocols and controlled agricultural practices. Our products are officially registered with NAFDAC under REG. NO.: A8-121508L, ensuring quality, safety, and hygiene from harvest to your door.'
  },
  {
    id: 'faq-2',
    order: 2,
    question: 'How can I prepare oyster mushrooms?',
    answer: 'Oyster mushrooms are very simple and quick to prepare! Gently wipe or rinse them, trim the base stem if needed, and slice or tear into strips. You can sauté them in oil or butter for 4–6 minutes, or add them straight into soups, jollof rice, stir-fries, sauces, and pasta dishes.'
  },
  {
    id: 'faq-3',
    order: 3,
    question: 'Do you sell fresh mushrooms?',
    answer: 'Yes! We cultivate and supply premium fresh oyster mushrooms harvested daily to ensure maximum tenderness, savoury aroma, and freshness upon arrival.'
  },
  {
    id: 'faq-4',
    order: 4,
    question: 'Do you sell dried mushrooms?',
    answer: 'Yes, we supply premium dried oyster mushrooms. They have a long ambient shelf life, concentrate rich savoury umami notes, and rehydrate in warm water within 10–15 minutes before cooking.'
  },
  {
    id: 'faq-5',
    order: 5,
    question: 'Do you supply restaurants and hotels?',
    answer: 'Yes. We partner with hotels, fine dining establishments, quick-service restaurants, and hospitality businesses across Ogun State, Lagos, and surrounding regions with customized delivery schedules.'
  },
  {
    id: 'faq-6',
    order: 6,
    question: 'Do you offer wholesale orders?',
    answer: 'Yes, we provide tiered wholesale pricing and reliable bulk fulfillment for supermarkets, caterers, distributors, and bulk buyers. Contact us directly via WhatsApp to discuss quantities and logistics.'
  },
  {
    id: 'faq-7',
    order: 7,
    question: 'Where are you located?',
    answer: 'Our farm and packing facility is located at 35, Ewuosho Street, off Aiyetoro Road, Kanuyi, Ogun State, Nigeria.'
  },
  {
    id: 'faq-8',
    order: 8,
    question: 'How can I place an order?',
    answer: 'You can order directly through our website by filling out the quick order form, or click any "Order via WhatsApp" button on this page. Our sales team on WhatsApp (+234 812 468 0837) will confirm your desired quantities, delivery location, and payment details.'
  },
  {
    id: 'faq-9',
    order: 9,
    question: 'Can I request regular supply?',
    answer: 'Yes. We offer recurring subscription and standing delivery agreements for households, restaurants, and supermarkets seeking weekly or bi-weekly fresh harvests.'
  },
  {
    id: 'faq-10',
    order: 10,
    question: 'How do I contact Lomstel Agro?',
    answer: 'You can chat with us on WhatsApp at +234 812 468 0837, call our secondary line at +234 806 543 0680, email us at lomstelsocial@gmail.com, or visit our main corporate website at www.lomstel.com.'
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    quote: 'Great quality and beautifully packaged.',
    clientType: 'Customer',
    location: 'Lagos',
    isPublished: true,
    note: 'Placeholder testimonial. Can be edited or deleted in the Admin Dashboard.'
  },
  {
    id: 'test-2',
    quote: 'The mushrooms were fresh and easy to prepare.',
    clientType: 'Customer',
    location: 'Ogun State',
    isPublished: true,
    note: 'Placeholder testimonial. Can be edited or deleted in the Admin Dashboard.'
  },
  {
    id: 'test-3',
    quote: 'Very convenient for our food business.',
    clientType: 'Business Customer',
    location: 'Restaurant Partner',
    isPublished: true,
    note: 'Placeholder testimonial. Can be edited or deleted in the Admin Dashboard.'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    created_at: '2026-09-24T10:15:00Z',
    customer_name: 'Adewale Johnson',
    phone: '+234 803 123 4567',
    email: 'adewale@example.com',
    product: 'Lomstel Fresh Oyster Mushrooms',
    quantity: '2kg Fresh (4 packs)',
    customer_type: 'Home & Family',
    delivery_location: 'Magodo Phase 2, Lagos',
    message: 'Please deliver early morning on Saturday if possible.',
    status: 'Confirmed'
  },
  {
    id: 'ord-1002',
    created_at: '2026-09-23T16:30:00Z',
    customer_name: 'Bistro 35 Cuisine',
    phone: '+234 814 987 6543',
    email: 'chef@bistro35.ng',
    product: 'Wholesale / Bulk Supply',
    quantity: '10kg Fresh Weekly',
    customer_type: 'Restaurant',
    delivery_location: 'Abeokuta, Ogun State',
    message: 'Seeking standing weekly delivery for our restaurant kitchen.',
    status: 'Processing'
  },
  {
    id: 'ord-1003',
    created_at: '2026-09-22T11:00:00Z',
    customer_name: 'Mrs. Folake Amadi',
    phone: '+234 809 555 4321',
    email: 'folake@gmail.com',
    product: 'Lomstel Dried Oyster Mushrooms',
    quantity: '500g Dried Pouch',
    customer_type: 'Home & Family',
    delivery_location: 'Ikeja GRA, Lagos',
    message: 'Want to try in our vegetable egusi soup recipe.',
    status: 'Delivered'
  }
];

export const NUTRITION_FACTS = [
  {
    name: 'PROTEIN',
    role: 'Essential Building Block',
    detail: 'Contains vegetable protein that complements everyday plant-forward and balanced family meals.'
  },
  {
    name: 'DIETARY FIBRE',
    role: 'Digestive Balance',
    detail: 'Provides soluble and insoluble dietary fibre supporting natural digestive health.'
  },
  {
    name: 'B VITAMINS',
    role: 'Cellular Energy',
    detail: 'Contains natural B-complex vitamins including riboflavin, niacin, and pantothenic acid.'
  },
  {
    name: 'POTASSIUM',
    role: 'Fluid Balance',
    detail: 'An essential electrolyte mineral that supports normal muscle function and bodily hydration.'
  },
  {
    name: 'PHOSPHORUS',
    role: 'Bone & Teeth Support',
    detail: 'Contributes to normal energy metabolism and physiological bone structure.'
  },
  {
    name: 'SELENIUM',
    role: 'Antioxidant Defense',
    detail: 'A trace mineral involved in protecting cellular structures from oxidative stress.'
  },
  {
    name: 'COPPER',
    role: 'Metabolic Cofactor',
    detail: 'Assists in physiological iron utilization and normal immune function.'
  },
  {
    name: 'ANTIOXIDANT COMPOUNDS',
    role: 'Cellular Vitality',
    detail: 'Naturally rich in ergothioneine and beneficial polyphenolic compounds.'
  }
];

export const AUDIENCE_CARDS = [
  {
    title: 'HOME & FAMILY',
    description: 'For everyday family meals, wholesome nutrition, and delicious savoury dinner recipes.',
    iconName: 'Home'
  },
  {
    title: 'RESTAURANTS',
    description: 'Premium, consistent mushroom quality and prompt delivery for culinary professionals.',
    iconName: 'Utensils'
  },
  {
    title: 'HOTELS',
    description: 'Fresh, certified mushroom supply designed for guest dining and high-volume hospitality banquets.',
    iconName: 'Building'
  },
  {
    title: 'SUPERMARKETS',
    description: 'Hygienically packaged, labeled, and barcoded retail packs for grocery shelves.',
    iconName: 'ShoppingBag'
  },
  {
    title: 'CATERERS & FOOD BUSINESSES',
    description: 'Bulk crate supply with reliable dispatch for weddings, corporate catering, and meal preps.',
    iconName: 'ChefHat'
  }
];
