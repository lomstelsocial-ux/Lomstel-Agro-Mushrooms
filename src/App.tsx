import React, { useState, useEffect, useCallback } from 'react';
import { 
  SiteSettings, 
  Product, 
  GalleryItem, 
  FAQItem, 
  Testimonial, 
  Order 
} from './types';
import { 
  INITIAL_SITE_SETTINGS, 
  INITIAL_PRODUCTS, 
  INITIAL_GALLERY, 
  INITIAL_FAQS, 
  INITIAL_TESTIMONIALS,
  ASSET_IMAGES
} from './constants/initialData';
import { DataService } from './services/supabase';

// Components
import { Navbar } from './components/common/Navbar';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { HeroSection } from './components/sections/HeroSection';
import { TrustBar } from './components/sections/TrustBar';
import { ScrollingImageBanner } from './components/sections/ScrollingImageBanner';
import { AboutSection } from './components/sections/AboutSection';
import { WhyChooseSection } from './components/sections/WhyChooseSection';
import { NutritionSection } from './components/sections/NutritionSection';
import { ProductsSection } from './components/sections/ProductsSection';
import { HowToPrepareSection } from './components/sections/HowToPrepareSection';
import { FacilityTourSection } from './components/sections/FacilityTourSection';
import { VideoShowcaseSection } from './components/sections/VideoShowcaseSection';
import { WhoWeSupplySection } from './components/sections/WhoWeSupplySection';
import { GallerySection } from './components/sections/GallerySection';
import { HowToOrderSection } from './components/sections/HowToOrderSection';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import { FaqSection } from './components/sections/FaqSection';
import { OrderSection } from './components/sections/OrderSection';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/sections/Footer';

// Modals
import { OrderModal } from './components/modals/OrderModal';
import { LightboxModal } from './components/modals/LightboxModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [faqs, setFaqs] = useState<FAQItem[]>(INITIAL_FAQS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);

  // Modals state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<string | undefined>();
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  // Success Notification banner
  const [lastSubmittedOrder, setLastSubmittedOrder] = useState<Order | null>(null);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const [s, p, g, f, t] = await Promise.all([
        DataService.getSettings(),
        DataService.getProducts(),
        DataService.getGallery(),
        DataService.getFAQs(),
        DataService.getTestimonials(),
      ]);
      setSettings(s);
      setProducts(p);
      setGallery(g);
      setFaqs(f);
      setTestimonials(t);
    } catch (err) {
      console.error('Failed to load application data:', err);
    }
  }, []);

  const handleRefreshData = useCallback(async (updatedSettings?: SiteSettings) => {
    if (updatedSettings) {
      setSettings(updatedSettings);
    }
    try {
      const [s, p, g, f, t] = await Promise.all([
        DataService.getSettings(),
        DataService.getProducts(),
        DataService.getGallery(),
        DataService.getFAQs(),
        DataService.getTestimonials(),
      ]);
      if (!updatedSettings && s) {
        setSettings(s);
      }
      if (p) setProducts(p);
      if (g) setGallery(g);
      if (f) setFaqs(f);
      if (t) setTestimonials(t);
    } catch (err) {
      console.error('Failed to reload data:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // 1. Record site traffic & page views
    DataService.recordPageView();

    // 2. Secret Admin Access: URL hash, query param, or pathname (#admin, ?admin=true, /admin)
    const checkAdminTriggerInUrl = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash.includes('admin') || search.includes('admin') || path.includes('admin')) {
        setIsAdminOpen(true);
      }
    };
    checkAdminTriggerInUrl();
    window.addEventListener('hashchange', checkAdminTriggerInUrl);
    window.addEventListener('popstate', checkAdminTriggerInUrl);

    // Global helper for console or external trigger
    (window as any).openAdmin = () => setIsAdminOpen(true);
    (window as any).openLomstelAdmin = () => setIsAdminOpen(true);

    const handleCustomAdminOpen = () => setIsAdminOpen(true);
    window.addEventListener('open_admin_portal', handleCustomAdminOpen);

    // 3. Secret Admin Keyboard shortcut: Ctrl + Shift + A (or Cmd + Shift + A), or simply typing "admin" / "lomstel"
    let keyBuffer = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen(prev => !prev);
        return;
      }

      // Ignore keystrokes when typing inside text fields
      if (
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement || 
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (e.key && e.key.length === 1) {
        keyBuffer += e.key.toLowerCase();
        if (keyBuffer.length > 20) {
          keyBuffer = keyBuffer.slice(-20);
        }
        if (keyBuffer.includes('admin') || keyBuffer.includes('lomstel')) {
          keyBuffer = '';
          setIsAdminOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 4. Data change listener
    const handleDataChange = (e: any) => {
      if (e?.detail?.key === 'lomstel_site_settings' && e?.detail?.val) {
        setSettings(e.detail.val);
      } else {
        fetchData();
      }
    };
    window.addEventListener('lomstel_data_change', handleDataChange as EventListener);

    return () => {
      window.removeEventListener('hashchange', checkAdminTriggerInUrl);
      window.removeEventListener('popstate', checkAdminTriggerInUrl);
      window.removeEventListener('open_admin_portal', handleCustomAdminOpen);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('lomstel_data_change', handleDataChange);
    };
  }, [fetchData]);

  const handleOpenOrderModal = (productName?: string) => {
    setSelectedProductForModal(productName);
    setIsOrderModalOpen(true);
  };

  const handleScrollTo = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Dynamic font class style
  const fontStyle = settings.fontFamily 
    ? { fontFamily: `${settings.fontFamily}, sans-serif` } 
    : {};

  return (
    <div 
      style={fontStyle}
      className="min-h-screen flex flex-col bg-[#F7F8F4] text-[#17211B] antialiased selection:bg-[#146B4A] selection:text-white"
    >
      {/* 1. STICKY NAVIGATION (With Social Icons & Order Basket) */}
      <Navbar 
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenOrderModal={() => handleOpenOrderModal()}
        socialLinks={settings.socialLinks}
      />

      <main className="flex-1">
        {/* 2. HERO SECTION */}
        <HeroSection 
          settings={settings}
          heroImage={settings.heroImage || ASSET_IMAGES.hero}
          heroDriedImage={settings.heroDriedImage || ASSET_IMAGES.productDried}
          onExploreClick={() => handleScrollTo('products')}
          onOpenOrderModal={(prod) => handleOpenOrderModal(prod)}
          onSecretAdminTrigger={() => setIsAdminOpen(true)}
        />

        {/* 3. TRUST / QUALITY BAR */}
        <TrustBar />

        {/* 3.5 AUTO-SCROLLING IMAGES PANEL */}
        <ScrollingImageBanner 
          settings={settings}
        />

        {/* 4. ABOUT LOMSTEL MUSHROOMS */}
        <AboutSection 
          settings={settings}
          facilityImage={settings.aboutImage || ASSET_IMAGES.facility}
          onLearnMoreClick={() => handleScrollTo('facility')}
        />

        {/* 5. WHY CHOOSE LOMSTEL */}
        <WhyChooseSection />

        {/* 6. NUTRITION SECTION */}
        <NutritionSection 
          settings={settings}
        />

        {/* 7. PRODUCT SECTION */}
        <ProductsSection 
          products={products}
          onOpenOrderModal={handleOpenOrderModal}
        />

        {/* 8. HOW TO PREPARE */}
        <HowToPrepareSection />

        {/* 9. FARM/FACILITY TOUR */}
        <FacilityTourSection 
          settings={settings}
          onOpenGallery={() => handleScrollTo('gallery')}
        />

        {/* 9.5 VIDEO SHOWCASE & YOUTUBE PREVIEW */}
        <VideoShowcaseSection 
          settings={settings}
          onOpenOrderModal={handleOpenOrderModal}
        />

        {/* 10. WHO WE SUPPLY */}
        <WhoWeSupplySection />

        {/* 11. GALLERY */}
        <GallerySection 
          galleryItems={gallery}
          onOpenLightbox={(item) => setLightboxItem(item)}
        />

        {/* 12. HOW TO ORDER */}
        <HowToOrderSection 
          onOpenOrderModal={() => handleOpenOrderModal()}
        />

        {/* 13. TESTIMONIALS */}
        <TestimonialsSection 
          testimonials={testimonials}
        />

        {/* 14. FAQ */}
        <FaqSection 
          faqs={faqs}
        />

        {/* 15. ORDER SECTION & WEB FORM */}
        <OrderSection 
          onOrderSuccess={(order) => setLastSubmittedOrder(order)}
        />

        {/* 16. CONTACT SECTION */}
        <ContactSection 
          settings={settings}
        />
      </main>

      {/* 17. FOOTER */}
      <Footer 
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenOrderModal={handleOpenOrderModal}
      />

      {/* FLOATING WHATSAPP BUTTON (With Direct WhatsApp Link) */}
      <WhatsAppButton />

      {/* MODALS */}
      <OrderModal 
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        defaultProduct={selectedProductForModal}
      />

      <LightboxModal 
        item={lightboxItem}
        onClose={() => setLightboxItem(null)}
      />

      {/* ADMIN DASHBOARD (Discrete secret access) */}
      <AdminDashboard 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onRefreshData={handleRefreshData}
      />
    </div>
  );
}
