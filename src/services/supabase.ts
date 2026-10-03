import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  Product, 
  GalleryItem, 
  FAQItem, 
  Testimonial, 
  SiteSettings, 
  Order,
  SiteAnalytics,
  CustomerLead
} from '../types';
import { 
  INITIAL_SITE_SETTINGS, 
  INITIAL_PRODUCTS, 
  INITIAL_GALLERY, 
  INITIAL_FAQS, 
  INITIAL_TESTIMONIALS, 
  INITIAL_ORDERS,
  INITIAL_CUSTOMER_LEADS
} from '../constants/initialData';
import { compressImageFile } from '../utils/imageCompressor';
import { idbGet, idbSet, idbDelete } from './idbStorage';

// Production Supabase Configuration
// Supports project URL and auto-normalizes /rest/v1 paths if passed
export function normalizeSupabaseUrl(url?: string): string {
  if (!url) return '';
  return url.trim().replace(/\/+$/, '').replace(/\/rest\/v1\/?$/, '');
}

// Built-in verified project credentials with fallback to env variables
const DEFAULT_SUPABASE_URL = 'https://puxfokyknlnkgbcyvtui.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1eGZva3lrbmxua2diY3l2dHVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMjQxNTAsImV4cCI6MjEwNTkwMDE1MH0.Cft_BI8kmMPqpbmkYxxOMja94VK-YIkN4WeS_KJISYQ';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const supabaseUrl = normalizeSupabaseUrl(rawUrl);
export const supabaseAnonKey = (rawKey || '').trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// In-memory cache for 0ms ultra-fast access without race conditions
const memoryCache: Record<string, any> = {};

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  readOk: boolean;
  writeOk: boolean;
  storageOk: boolean;
  rlsBlocked: boolean;
  durationMs: number;
}

// Comprehensive diagnostic to test Read, Write, and Storage Bucket
export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  if (!supabase) {
    return { 
      success: false, 
      message: 'Supabase client not initialized (missing URL or anon key).',
      readOk: false,
      writeOk: false,
      storageOk: false,
      rlsBlocked: false,
      durationMs: 0
    };
  }

  const start = performance.now();
  let readOk = false;
  let writeOk = false;
  let storageOk = false;
  let rlsBlocked = false;

  try {
    // 1. Test Read Connectivity
    const { error: readErr } = await supabase.from('site_settings').select('id').limit(1);
    if (!readErr) {
      readOk = true;
    } else if (readErr.code === '42P01' || readErr.message.includes('does not exist')) {
      return {
        success: false,
        message: 'Connected to Supabase endpoint, but tables have not been created yet. Please execute the SQL schema script in your Supabase SQL Editor.',
        readOk: false,
        writeOk: false,
        storageOk: false,
        rlsBlocked: false,
        durationMs: Math.round(performance.now() - start)
      };
    }

    // 2. Test Write (RLS Permission)
    const { error: writeErr } = await supabase.from('site_settings').upsert([{
      id: 'default_settings',
      brand_name: 'Lomstel Agro'
    }]);

    if (!writeErr) {
      writeOk = true;
    } else if (writeErr.code === '42501' || writeErr.message.includes('row-level security')) {
      rlsBlocked = true;
    }

    // 3. Test Storage Bucket 'lomstel-media'
    const { data: bucketData, error: bucketErr } = await supabase.storage.getBucket('lomstel-media');
    if (!bucketErr && bucketData) {
      storageOk = true;
    }

    const durationMs = Math.round(performance.now() - start);

    if (writeOk && storageOk) {
      return {
        success: true,
        message: `Fully operational! Connected to Supabase (${durationMs}ms ping) with full database write and media storage permissions.`,
        readOk: true,
        writeOk: true,
        storageOk: true,
        rlsBlocked: false,
        durationMs
      };
    }

    if (writeOk && !storageOk) {
      return {
        success: true,
        message: `Connected & Database Write Active (${durationMs}ms)! Note: 'lomstel-media' storage bucket is not created yet (images will be saved in database table). Run the storage SQL script to enable the media bucket.`,
        readOk: true,
        writeOk: true,
        storageOk: false,
        rlsBlocked: false,
        durationMs
      };
    }

    if (rlsBlocked) {
      return {
        success: false,
        message: `Connected (${durationMs}ms), but Row-Level Security (RLS error 42501) is blocking writes! Copy the SQL script below and run it in your Supabase SQL Editor to allow writes.`,
        readOk: true,
        writeOk: false,
        storageOk,
        rlsBlocked: true,
        durationMs
      };
    }

    return {
      success: false,
      message: `Database connection test completed with issues. Read: ${readOk ? 'OK' : 'Failed'}, Write: ${writeOk ? 'OK' : 'Failed'}`,
      readOk,
      writeOk,
      storageOk,
      rlsBlocked,
      durationMs
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Connection failed unexpectedly',
      readOk: false,
      writeOk: false,
      storageOk: false,
      rlsBlocked: false,
      durationMs: Math.round(performance.now() - start)
    };
  }
}

// Storage Keys
const STORAGE_KEYS = {
  SETTINGS: 'lomstel_site_settings',
  PRODUCTS: 'lomstel_products',
  GALLERY: 'lomstel_gallery',
  FAQS: 'lomstel_faqs',
  TESTIMONIALS: 'lomstel_testimonials',
  ORDERS: 'lomstel_orders',
  ANALYTICS: 'lomstel_analytics',
  LEADS: 'lomstel_customer_leads',
  VISITOR_ID: 'lomstel_visitor_id',
};

// Synchronous local helper with in-memory caching and safe quota handling
function getStoredItem<T>(key: string, defaultVal: T): T {
  if (memoryCache[key] !== undefined) {
    return memoryCache[key];
  }
  try {
    const val = localStorage.getItem(key);
    if (val) {
      const parsed = JSON.parse(val);
      memoryCache[key] = parsed;
      return parsed;
    }
  } catch {}
  return defaultVal;
}

async function setStoredItem<T>(key: string, val: T): Promise<void> {
  // 1. Instantly update in-memory cache for 0ms synchronous reads (immune to race conditions)
  memoryCache[key] = val;

  // 2. Persist to IndexedDB (unlimited capacity for high-res base64 images)
  try {
    await idbSet(key, val);
  } catch (err) {
    console.warn('idbSet write error:', err);
  }

  // 3. Also try localStorage (guard against QuotaExceededError)
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // Harmless quota overflow, IndexedDB and memoryCache have it safe
  }

  // 4. Dispatch reactive event with detailed payload
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('lomstel_data_change', { detail: { key, val } }));
  }
}

// Bi-directional Database Mappers for site_settings
function mapDbToSiteSettings(dbRow: any): SiteSettings {
  return {
    ...INITIAL_SITE_SETTINGS,
    brandName: dbRow.brand_name ?? dbRow.brandName ?? INITIAL_SITE_SETTINGS.brandName,
    tagline: dbRow.tagline ?? INITIAL_SITE_SETTINGS.tagline,
    nafdacReg: dbRow.nafdac_reg ?? dbRow.nafdacReg ?? INITIAL_SITE_SETTINGS.nafdacReg,
    primaryPhone: dbRow.primary_phone ?? dbRow.primaryPhone ?? INITIAL_SITE_SETTINGS.primaryPhone,
    secondaryPhone: dbRow.secondary_phone ?? dbRow.secondaryPhone ?? INITIAL_SITE_SETTINGS.secondaryPhone,
    whatsappNumber: dbRow.whatsapp_number ?? dbRow.whatsappNumber ?? INITIAL_SITE_SETTINGS.whatsappNumber,
    email: dbRow.email ?? INITIAL_SITE_SETTINGS.email,
    mainWebsite: dbRow.main_website ?? dbRow.mainWebsite ?? INITIAL_SITE_SETTINGS.mainWebsite,
    mushroomWebsite: dbRow.mushroom_website ?? dbRow.mushroomWebsite ?? INITIAL_SITE_SETTINGS.mushroomWebsite,
    locationAddress: dbRow.location_address ?? dbRow.locationAddress ?? INITIAL_SITE_SETTINGS.locationAddress,
    heroHeadline: dbRow.hero_headline ?? dbRow.heroHeadline ?? INITIAL_SITE_SETTINGS.heroHeadline,
    heroSubheadline: dbRow.hero_subheadline ?? dbRow.heroSubheadline ?? INITIAL_SITE_SETTINGS.heroSubheadline,
    heroImage: dbRow.hero_image ?? dbRow.heroImage ?? INITIAL_SITE_SETTINGS.heroImage,
    heroDriedImage: dbRow.hero_dried_image ?? dbRow.heroDriedImage ?? INITIAL_SITE_SETTINGS.heroDriedImage,
    heroCtaText: dbRow.hero_cta_text ?? dbRow.heroCtaText ?? INITIAL_SITE_SETTINGS.heroCtaText,
    aboutTitle: dbRow.about_title ?? dbRow.aboutTitle ?? INITIAL_SITE_SETTINGS.aboutTitle,
    aboutText: dbRow.about_text ?? dbRow.aboutText ?? INITIAL_SITE_SETTINGS.aboutText,
    aboutImage: dbRow.about_image ?? dbRow.aboutImage ?? INITIAL_SITE_SETTINGS.aboutImage,
    benefitsHeadline: dbRow.benefits_headline ?? dbRow.benefitsHeadline ?? INITIAL_SITE_SETTINGS.benefitsHeadline,
    benefitsSubtext: dbRow.benefits_subtext ?? dbRow.benefitsSubtext ?? INITIAL_SITE_SETTINGS.benefitsSubtext,
    facilityHeadline: dbRow.facility_headline ?? dbRow.facilityHeadline ?? INITIAL_SITE_SETTINGS.facilityHeadline,
    facilitySubtext: dbRow.facility_subtext ?? dbRow.facilitySubtext ?? INITIAL_SITE_SETTINGS.facilitySubtext,
    facilityImage: dbRow.facility_image ?? dbRow.facilityImage ?? INITIAL_SITE_SETTINGS.facilityImage,
    contactHeadline: dbRow.contact_headline ?? dbRow.contactHeadline ?? INITIAL_SITE_SETTINGS.contactHeadline,
    videoSectionHeadline: dbRow.video_section_headline ?? dbRow.videoSectionHeadline ?? INITIAL_SITE_SETTINGS.videoSectionHeadline,
    videoSectionSubheadline: dbRow.video_section_subheadline ?? dbRow.videoSectionSubheadline ?? INITIAL_SITE_SETTINGS.videoSectionSubheadline,
    videos: Array.isArray(dbRow.videos) ? dbRow.videos : (dbRow.videos || INITIAL_SITE_SETTINGS.videos),
    primaryColor: dbRow.primary_color ?? dbRow.primaryColor ?? INITIAL_SITE_SETTINGS.primaryColor,
    darkGreenColor: dbRow.dark_green_color ?? dbRow.darkGreenColor ?? INITIAL_SITE_SETTINGS.darkGreenColor,
    goldColor: dbRow.gold_color ?? dbRow.goldColor ?? INITIAL_SITE_SETTINGS.goldColor,
    fontFamily: dbRow.font_family ?? dbRow.fontFamily ?? INITIAL_SITE_SETTINGS.fontFamily,
    socialLinks: Array.isArray(dbRow.social_links) ? dbRow.social_links : (dbRow.socialLinks || INITIAL_SITE_SETTINGS.socialLinks),
    scrollingImages: Array.isArray(dbRow.scrolling_images) ? dbRow.scrolling_images : (dbRow.scrollingImages || INITIAL_SITE_SETTINGS.scrollingImages),
  };
}

function mapSiteSettingsToDb(settings: SiteSettings): Record<string, any> {
  return {
    id: 'default_settings',
    brand_name: settings.brandName,
    tagline: settings.tagline,
    nafdac_reg: settings.nafdacReg,
    primary_phone: settings.primaryPhone,
    secondary_phone: settings.secondaryPhone,
    whatsapp_number: settings.whatsappNumber,
    email: settings.email,
    main_website: settings.mainWebsite,
    mushroom_website: settings.mushroomWebsite,
    location_address: settings.locationAddress,
    hero_headline: settings.heroHeadline,
    hero_subheadline: settings.heroSubheadline,
    hero_image: settings.heroImage,
    hero_dried_image: settings.heroDriedImage,
    about_title: settings.aboutTitle,
    about_text: settings.aboutText,
    about_image: settings.aboutImage,
    benefits_headline: settings.benefitsHeadline,
    benefits_subtext: settings.benefitsSubtext,
    facility_headline: settings.facilityHeadline,
    facility_subtext: settings.facilitySubtext,
    facility_image: settings.facilityImage,
    contact_headline: settings.contactHeadline,
    video_section_headline: settings.videoSectionHeadline,
    video_section_subheadline: settings.videoSectionSubheadline,
    videos: settings.videos || [],
    primary_color: settings.primaryColor,
    dark_green_color: settings.darkGreenColor,
    gold_color: settings.goldColor,
    font_family: settings.fontFamily,
    social_links: settings.socialLinks || [],
    scrolling_images: settings.scrollingImages || [],
    updated_at: new Date().toISOString()
  };
}

export const DataService = {
  // Site Settings
  async getSettings(): Promise<SiteSettings> {
    // 1. Check in-memory cache first (instant 0ms response)
    if (memoryCache[STORAGE_KEYS.SETTINGS]) {
      return memoryCache[STORAGE_KEYS.SETTINGS];
    }

    // 2. Check local persistent store (IndexedDB then localStorage)
    const localIdb = await idbGet<SiteSettings | null>(STORAGE_KEYS.SETTINGS, null);
    const localStore = localIdb || getStoredItem<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
    memoryCache[STORAGE_KEYS.SETTINGS] = localStore;

    // 3. If Supabase is connected, attempt to fetch latest remote row
    if (supabase) {
      try {
        const { data, error } = await supabase.from('site_settings').select('*').limit(1);
        if (!error && data && data.length > 0 && data[0]) {
          const remoteSettings = mapDbToSiteSettings(data[0]);
          // Smart merge: retain local uploaded images if remote row doesn't have them
          const merged: SiteSettings = {
            ...localStore,
            ...remoteSettings,
            heroImage: remoteSettings.heroImage || localStore.heroImage,
            heroDriedImage: remoteSettings.heroDriedImage || localStore.heroDriedImage,
            aboutImage: remoteSettings.aboutImage || localStore.aboutImage,
            facilityImage: remoteSettings.facilityImage || localStore.facilityImage,
            scrollingImages: (remoteSettings.scrollingImages && remoteSettings.scrollingImages.length > 0)
              ? remoteSettings.scrollingImages
              : localStore.scrollingImages,
            videos: (remoteSettings.videos && remoteSettings.videos.length > 0)
              ? remoteSettings.videos
              : localStore.videos,
          };
          memoryCache[STORAGE_KEYS.SETTINGS] = merged;
          await setStoredItem(STORAGE_KEYS.SETTINGS, merged);
          return merged;
        }
      } catch (err) {
        console.warn('Supabase getSettings fallback to local store:', err);
      }
    }

    if (!localStore.socialLinks || localStore.socialLinks.length === 0) {
      localStore.socialLinks = INITIAL_SITE_SETTINGS.socialLinks || [];
    }
    if (!localStore.heroDriedImage) {
      localStore.heroDriedImage = INITIAL_SITE_SETTINGS.heroDriedImage;
    }
    if (!localStore.scrollingImages || localStore.scrollingImages.length === 0) {
      localStore.scrollingImages = INITIAL_SITE_SETTINGS.scrollingImages || [];
    }
    if (!localStore.videos || localStore.videos.length === 0) {
      localStore.videos = INITIAL_SITE_SETTINGS.videos || [];
    }
    return localStore;
  },

  async updateSettings(settings: SiteSettings): Promise<{ settings: SiteSettings; dbSynced: boolean; error?: string }> {
    // 1. Immediately persist locally (memoryCache + IndexedDB + localStorage)
    await setStoredItem(STORAGE_KEYS.SETTINGS, settings);

    let dbSynced = false;
    let syncError: string | undefined;

    // 2. Asynchronously sync to Supabase PostgreSQL
    if (supabase) {
      try {
        const dbPayload = mapSiteSettingsToDb(settings);
        const { error } = await supabase.from('site_settings').upsert([dbPayload]);
        if (error) {
          syncError = error.message;
          console.warn('Supabase settings sync error (saved locally):', error.message);
        } else {
          dbSynced = true;
        }
      } catch (err: any) {
        syncError = err?.message || 'Network error';
        console.warn('Supabase updateSettings network error (saved locally):', err);
      }
    }

    return { settings, dbSynced, error: syncError };
  },

  // Products
  async getProducts(): Promise<Product[]> {
    if (memoryCache[STORAGE_KEYS.PRODUCTS]) {
      return memoryCache[STORAGE_KEYS.PRODUCTS];
    }
    const localIdb = await idbGet<Product[] | null>(STORAGE_KEYS.PRODUCTS, null);
    const localStore = (localIdb && localIdb.length > 0) 
      ? localIdb 
      : getStoredItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    memoryCache[STORAGE_KEYS.PRODUCTS] = localStore;

    if (supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data && data.length > 0) {
          const mapped: Product[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            tagline: item.tagline,
            description: item.description,
            unit: item.unit,
            priceEstimate: item.price_estimate ?? item.priceEstimate,
            minOrder: item.min_order ?? item.minOrder,
            image: item.image,
            features: Array.isArray(item.features) ? item.features : [],
            useCases: Array.isArray(item.use_cases) ? item.use_cases : (item.useCases || []),
            inStock: item.in_stock !== undefined ? Boolean(item.in_stock) : (item.inStock ?? true),
            whatsappMessage: item.whatsapp_message ?? item.whatsappMessage ?? ''
          }));
          memoryCache[STORAGE_KEYS.PRODUCTS] = mapped;
          await setStoredItem(STORAGE_KEYS.PRODUCTS, mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase getProducts fallback to local store:', err);
      }
    }
    return localStore;
  },

  async saveProduct(product: Product): Promise<{ product: Product; dbSynced: boolean }> {
    const current = await this.getProducts();
    const index = current.findIndex(p => p.id === product.id);
    let updated: Product[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = product;
    } else {
      updated = [product, ...current];
    }

    await setStoredItem(STORAGE_KEYS.PRODUCTS, updated);

    let dbSynced = false;
    if (supabase) {
      try {
        const dbProduct = {
          id: product.id,
          name: product.name,
          category: product.category,
          tagline: product.tagline,
          description: product.description,
          unit: product.unit,
          price_estimate: product.priceEstimate,
          min_order: product.minOrder,
          image: product.image,
          features: product.features || [],
          use_cases: product.useCases || [],
          in_stock: product.inStock,
          whatsapp_message: product.whatsappMessage,
          created_at: new Date().toISOString()
        };
        const { error } = await supabase.from('products').upsert([dbProduct]);
        if (!error) dbSynced = true;
        if (error) console.warn('Supabase saveProduct error (saved locally):', error.message);
      } catch (err) {
        console.warn('Supabase saveProduct error:', err);
      }
    }
    return { product, dbSynced };
  },

  async deleteProduct(id: string): Promise<void> {
    const current = await this.getProducts();
    const updated = current.filter(p => p.id !== id);
    await setStoredItem(STORAGE_KEYS.PRODUCTS, updated);

    if (supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteProduct error:', err);
      }
    }
  },

  // Gallery
  async getGallery(): Promise<GalleryItem[]> {
    if (memoryCache[STORAGE_KEYS.GALLERY]) {
      return memoryCache[STORAGE_KEYS.GALLERY];
    }
    const localIdb = await idbGet<GalleryItem[] | null>(STORAGE_KEYS.GALLERY, null);
    const localStore = (localIdb && localIdb.length > 0)
      ? localIdb
      : getStoredItem<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
    memoryCache[STORAGE_KEYS.GALLERY] = localStore;

    if (supabase) {
      try {
        const { data, error } = await supabase.from('gallery').select('*');
        if (!error && data && data.length > 0) {
          const mapped: GalleryItem[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            category: item.category,
            imageUrl: item.image_url ?? item.imageUrl ?? '',
            caption: item.caption ?? ''
          }));
          memoryCache[STORAGE_KEYS.GALLERY] = mapped;
          await setStoredItem(STORAGE_KEYS.GALLERY, mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase getGallery fallback to local store:', err);
      }
    }
    return localStore;
  },

  async saveGalleryItem(item: GalleryItem): Promise<{ item: GalleryItem; dbSynced: boolean }> {
    const current = await this.getGallery();
    const index = current.findIndex(g => g.id === item.id);
    let updated: GalleryItem[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = item;
    } else {
      updated = [item, ...current];
    }

    await setStoredItem(STORAGE_KEYS.GALLERY, updated);

    let dbSynced = false;
    if (supabase) {
      try {
        const dbItem = {
          id: item.id,
          title: item.title,
          category: item.category,
          image_url: item.imageUrl,
          caption: item.caption,
          created_at: new Date().toISOString()
        };
        const { error } = await supabase.from('gallery').upsert([dbItem]);
        if (!error) dbSynced = true;
        if (error) console.warn('Supabase saveGalleryItem error (saved locally):', error.message);
      } catch (err) {
        console.warn('Supabase saveGalleryItem error:', err);
      }
    }
    return { item, dbSynced };
  },

  async deleteGalleryItem(id: string): Promise<void> {
    const current = await this.getGallery();
    const updated = current.filter(g => g.id !== id);
    await setStoredItem(STORAGE_KEYS.GALLERY, updated);

    if (supabase) {
      try {
        await supabase.from('gallery').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteGalleryItem error:', err);
      }
    }
  },

  // FAQs
  async getFAQs(): Promise<FAQItem[]> {
    const localIdb = await idbGet<FAQItem[] | null>(STORAGE_KEYS.FAQS, null);
    const localStore = (localIdb && localIdb.length > 0)
      ? localIdb
      : getStoredItem<FAQItem[]>(STORAGE_KEYS.FAQS, INITIAL_FAQS);

    if (supabase) {
      try {
        const { data, error } = await supabase.from('faqs').select('*').order('order', { ascending: true });
        if (!error && data && data.length > 0) {
          setStoredItem(STORAGE_KEYS.FAQS, data);
          return data;
        }
      } catch (err) {
        console.warn('Supabase getFAQs fallback to local store:', err);
      }
    }
    return localStore;
  },

  async saveFAQ(faq: FAQItem): Promise<FAQItem> {
    const current = await this.getFAQs();
    const index = current.findIndex(f => f.id === faq.id);
    let updated: FAQItem[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = faq;
    } else {
      updated = [faq, ...current];
    }

    setStoredItem(STORAGE_KEYS.FAQS, updated);

    if (supabase) {
      try {
        await supabase.from('faqs').upsert([faq]);
      } catch (err) {
        console.warn('Supabase saveFAQ error:', err);
      }
    }
    return faq;
  },

  async deleteFAQ(id: string): Promise<void> {
    const current = await this.getFAQs();
    const updated = current.filter(f => f.id !== id);
    setStoredItem(STORAGE_KEYS.FAQS, updated);

    if (supabase) {
      try {
        await supabase.from('faqs').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteFAQ error:', err);
      }
    }
  },

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    const localIdb = await idbGet<Testimonial[] | null>(STORAGE_KEYS.TESTIMONIALS, null);
    const localStore = (localIdb && localIdb.length > 0)
      ? localIdb
      : getStoredItem<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);

    if (supabase) {
      try {
        const { data, error } = await supabase.from('testimonials').select('*');
        if (!error && data && data.length > 0) {
          const mapped: Testimonial[] = data.map((t: any) => ({
            id: t.id,
            quote: t.quote,
            clientType: t.client_type ?? t.clientType ?? 'Customer',
            location: t.location,
            isPublished: t.is_published !== undefined ? Boolean(t.is_published) : (t.isPublished ?? true),
            note: t.note
          }));
          setStoredItem(STORAGE_KEYS.TESTIMONIALS, mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase getTestimonials fallback to local store:', err);
      }
    }
    return localStore;
  },

  async saveTestimonial(testimonial: Testimonial): Promise<Testimonial> {
    const current = await this.getTestimonials();
    const index = current.findIndex(t => t.id === testimonial.id);
    let updated: Testimonial[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = testimonial;
    } else {
      updated = [testimonial, ...current];
    }

    setStoredItem(STORAGE_KEYS.TESTIMONIALS, updated);

    if (supabase) {
      try {
        const dbT = {
          id: testimonial.id,
          quote: testimonial.quote,
          client_type: testimonial.clientType,
          location: testimonial.location,
          is_published: testimonial.isPublished,
          note: testimonial.note,
          created_at: new Date().toISOString()
        };
        await supabase.from('testimonials').upsert([dbT]);
      } catch (err) {
        console.warn('Supabase saveTestimonial error:', err);
      }
    }
    return testimonial;
  },

  async deleteTestimonial(id: string): Promise<void> {
    const current = await this.getTestimonials();
    const updated = current.filter(t => t.id !== id);
    setStoredItem(STORAGE_KEYS.TESTIMONIALS, updated);

    if (supabase) {
      try {
        await supabase.from('testimonials').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteTestimonial error:', err);
      }
    }
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    const localIdb = await idbGet<Order[] | null>(STORAGE_KEYS.ORDERS, null);
    const localStore = (localIdb && localIdb.length > 0)
      ? localIdb
      : getStoredItem<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);

    if (supabase) {
      try {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          const mapped: Order[] = data.map((o: any) => ({
            id: o.id,
            created_at: o.created_at,
            customer_name: o.customer_name ?? o.customerName ?? '',
            phone: o.phone ?? '',
            email: o.email ?? '',
            product: o.product ?? '',
            quantity: o.quantity ?? '',
            customer_type: o.customer_type ?? o.customerType ?? 'Home & Family',
            delivery_location: o.delivery_location ?? o.deliveryLocation ?? '',
            message: o.message,
            status: o.status ?? 'New'
          }));
          setStoredItem(STORAGE_KEYS.ORDERS, mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase getOrders fallback to local store:', err);
      }
    }
    return localStore;
  },

  async createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'status'>): Promise<Order> {
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now().toString().slice(-6)}`,
      created_at: new Date().toISOString(),
      status: 'New'
    };

    const current = await this.getOrders();
    setStoredItem(STORAGE_KEYS.ORDERS, [newOrder, ...current]);

    if (supabase) {
      try {
        const dbOrder = {
          id: newOrder.id,
          created_at: newOrder.created_at,
          customer_name: newOrder.customer_name,
          phone: newOrder.phone,
          email: newOrder.email,
          product: newOrder.product,
          quantity: newOrder.quantity,
          customer_type: newOrder.customer_type,
          delivery_location: newOrder.delivery_location,
          message: newOrder.message,
          status: newOrder.status
        };
        await supabase.from('orders').insert([dbOrder]);
      } catch (err) {
        console.warn('Supabase createOrder error (saved locally):', err);
      }
    }

    return newOrder;
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<void> {
    const current = await this.getOrders();
    const updated = current.map(o => o.id === id ? { ...o, status } : o);
    setStoredItem(STORAGE_KEYS.ORDERS, updated);

    if (supabase) {
      try {
        await supabase.from('orders').update({ status }).eq('id', id);
      } catch (err) {
        console.warn('Supabase updateOrderStatus error:', err);
      }
    }
  },

  async deleteOrder(id: string): Promise<void> {
    const current = await this.getOrders();
    const updated = current.filter(o => o.id !== id);
    setStoredItem(STORAGE_KEYS.ORDERS, updated);

    if (supabase) {
      try {
        await supabase.from('orders').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteOrder error:', err);
      }
    }
  },

  // Visitor Tracking & Analytics
  async getAnalytics(): Promise<SiteAnalytics> {
    const orders = await this.getOrders();
    const defaultStats: SiteAnalytics = {
      totalPageViews: 412,
      uniqueVisitors: 284,
      totalOrders: orders.length,
      lastVisitedAt: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from('site_analytics').select('*').single();
        if (!error && data) {
          return {
            totalPageViews: data.total_page_views ?? data.totalPageViews ?? 412,
            uniqueVisitors: data.unique_visitors ?? data.uniqueVisitors ?? 284,
            totalOrders: orders.length,
            lastVisitedAt: data.last_visited_at ?? data.lastVisitedAt ?? new Date().toISOString()
          };
        }
      } catch {
        // fallback
      }
    }

    const stored = getStoredItem<SiteAnalytics>(STORAGE_KEYS.ANALYTICS, defaultStats);
    return { ...stored, totalOrders: orders.length };
  },

  async recordPageView(): Promise<SiteAnalytics> {
    const current = await this.getAnalytics();
    const updated: SiteAnalytics = {
      ...current,
      totalPageViews: current.totalPageViews + 1,
      lastVisitedAt: new Date().toISOString()
    };

    setStoredItem(STORAGE_KEYS.ANALYTICS, updated);

    if (supabase) {
      try {
        const dbPayload = {
          id: 'global_analytics',
          total_page_views: updated.totalPageViews,
          unique_visitors: updated.uniqueVisitors,
          total_orders: updated.totalOrders,
          last_visited_at: updated.lastVisitedAt
        };
        await supabase.from('site_analytics').upsert([dbPayload]);
      } catch {
        // ignore
      }
    }

    return updated;
  },

  // Customer Leads & Targeted Outreach
  async getCustomerLeads(): Promise<CustomerLead[]> {
    const localStore = getStoredItem<CustomerLead[]>(STORAGE_KEYS.LEADS, INITIAL_CUSTOMER_LEADS);
    if (supabase) {
      try {
        const { data, error } = await supabase.from('customer_leads').select('*');
        if (!error && data && data.length > 0) return data;
      } catch {
        // fallback
      }
    }
    return localStore;
  },

  async saveCustomerLead(lead: CustomerLead): Promise<CustomerLead> {
    const current = await this.getCustomerLeads();
    const idx = current.findIndex(l => l.id === lead.id);
    let updated: CustomerLead[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = lead;
    } else {
      updated = [lead, ...current];
    }

    setStoredItem(STORAGE_KEYS.LEADS, updated);

    if (supabase) {
      try {
        await supabase.from('customer_leads').upsert([lead]);
      } catch (err) {
        console.warn('Supabase lead save error:', err);
      }
    }
    return lead;
  },

  async deleteCustomerLead(id: string): Promise<void> {
    const current = await this.getCustomerLeads();
    const updated = current.filter(l => l.id !== id);
    setStoredItem(STORAGE_KEYS.LEADS, updated);

    if (supabase) {
      try {
        await supabase.from('customer_leads').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase lead delete error:', err);
      }
    }
  },

  /**
   * Universal Image File Uploader
   * 1. Automatically compresses & optimizes image client-side to max 1600px, 85% quality (~150KB - 250KB).
   * 2. Attempts to upload to Supabase Storage bucket 'lomstel-media' if bucket exists.
   * 3. Seamlessly falls back to the optimized base64 data URL, ensuring the uploaded photo ALWAYS works instantly
   *    and never exceeds browser storage limits.
   */
  async uploadImage(file: File): Promise<string> {
    // 1. Client-side compression to prevent quota exceed errors
    const compressedDataUrl = await compressImageFile(file, 1600, 0.85);

    // 2. If Supabase Storage is available, attempt to upload the optimized image
    if (supabase) {
      try {
        const res = await fetch(compressedDataUrl);
        const blob = await res.blob();

        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `lomstel-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('lomstel-media')
          .upload(filePath, blob, { 
            contentType: blob.type || 'image/jpeg',
            cacheControl: '3600', 
            upsert: true 
          });

        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage.from('lomstel-media').getPublicUrl(filePath);
          if (urlData?.publicUrl) {
            return urlData.publicUrl;
          }
        }
      } catch (err) {
        console.warn('Supabase storage upload failed, using optimized local media:', err);
      }
    }

    // 3. Guaranteed instant fallback: the crisp compressed data URL (safe for IndexedDB and localStorage)
    return compressedDataUrl;
  },

  resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.GALLERY);
    localStorage.removeItem(STORAGE_KEYS.FAQS);
    localStorage.removeItem(STORAGE_KEYS.TESTIMONIALS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.ANALYTICS);
    localStorage.removeItem(STORAGE_KEYS.LEADS);

    idbDelete(STORAGE_KEYS.SETTINGS);
    idbDelete(STORAGE_KEYS.PRODUCTS);
    idbDelete(STORAGE_KEYS.GALLERY);
    idbDelete(STORAGE_KEYS.FAQS);
    idbDelete(STORAGE_KEYS.TESTIMONIALS);
    idbDelete(STORAGE_KEYS.ORDERS);

    window.dispatchEvent(new Event('lomstel_data_change'));
  }
};
