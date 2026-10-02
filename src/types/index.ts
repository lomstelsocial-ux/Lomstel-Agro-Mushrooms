export type CustomerType = 
  | 'Home & Family'
  | 'Restaurant'
  | 'Hotel'
  | 'Supermarket'
  | 'Caterer'
  | 'Retailer'
  | 'Wholesale'
  | 'Other';

export type OrderStatus = 
  | 'New'
  | 'Contacted'
  | 'Confirmed'
  | 'Processing'
  | 'Delivered'
  | 'Cancelled';

export interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  phone: string;
  email: string;
  product: string;
  quantity: string;
  customer_type: CustomerType;
  delivery_location: string;
  message?: string;
  status: OrderStatus;
}

export interface Product {
  id: string;
  name: string;
  category: 'fresh' | 'dried' | 'wholesale';
  tagline: string;
  description: string;
  unit: string;
  priceEstimate?: string;
  minOrder?: string;
  image: string;
  features: string[];
  useCases?: string[];
  inStock: boolean;
  whatsappMessage: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Our Farm' | 'Fresh Mushrooms' | 'Packaging' | 'Food & Recipes' | 'Our Facility';
  imageUrl: string;
  caption?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  clientType: string;
  location?: string;
  isPublished: boolean;
  note?: string;
}

export type SocialPlatform = 
  | 'facebook' 
  | 'instagram' 
  | 'whatsapp' 
  | 'tiktok' 
  | 'youtube' 
  | 'twitter' 
  | 'linkedin' 
  | 'telegram' 
  | 'pinterest'
  | 'threads'
  | 'website'
  | 'other';

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  name: string;
  url: string;
  enabled: boolean;
}

export interface ScrollingBannerItem {
  id: string;
  imageUrl: string;
  title: string;
  caption?: string;
  enabled: boolean;
}

export interface VideoItem {
  id: string;
  title: string;
  youtubeUrl: string;
  category?: string;
  description?: string;
  duration?: string;
  enabled: boolean;
  featured?: boolean;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  nafdacReg: string;
  primaryPhone: string;
  secondaryPhone: string;
  whatsappNumber: string;
  email: string;
  mainWebsite: string;
  mushroomWebsite: string;
  locationAddress: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImage?: string;
  heroDriedImage?: string;
  heroCtaText?: string;
  aboutTitle?: string;
  aboutText: string;
  aboutImage?: string;
  benefitsHeadline?: string;
  benefitsSubtext?: string;
  facilityHeadline?: string;
  facilitySubtext?: string;
  facilityImage?: string;
  contactHeadline?: string;
  videoSectionHeadline?: string;
  videoSectionSubheadline?: string;
  videos?: VideoItem[];
  primaryColor: string;
  darkGreenColor: string;
  goldColor: string;
  fontFamily?: 'Outfit' | 'Plus Jakarta Sans' | 'Playfair Display' | 'Inter';
  socialLinks?: SocialLink[];
  scrollingImages?: ScrollingBannerItem[];
}

export interface SiteAnalytics {
  totalPageViews: number;
  uniqueVisitors: number;
  totalOrders: number;
  lastVisitedAt: string;
}

export interface CustomerLead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  category: CustomerType;
  interest: string;
  status: 'Inquiry' | 'Sample Requested' | 'Regular Client' | 'Follow-up Needed';
  lastContacted?: string;
  notes?: string;
}

