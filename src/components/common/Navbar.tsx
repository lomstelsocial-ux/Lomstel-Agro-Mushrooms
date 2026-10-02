import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { LomstelLogo } from './LomstelLogo';
import { SocialIcon } from './SocialIcon';
import { SocialLink } from '../../types';
import { openWhatsApp, WHATSAPP_MESSAGES } from '../../utils/whatsapp';

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenOrderModal: (productName?: string) => void;
  socialLinks?: SocialLink[];
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, onOpenOrderModal, socialLinks = [] }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  const activeSocialLinks = socialLinks.filter((s) => s.enabled);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    setLogoClicks((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        onOpenAdmin();
        return 0;
      }
      return next;
    });
    setTimeout(() => setLogoClicks(0), 2000);
  };

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Our Mushrooms', href: '#products' },
    { name: 'Benefits', href: '#nutrition' },
    { name: 'Facility', href: '#facility' },
    { name: 'Videos', href: '#videos' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#EAF4EE] py-3' 
          : 'bg-white/80 backdrop-blur-sm border-b border-[#EAF4EE]/60 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Wordmark & Icon - with invisible triple-click shortcut for admin */}
          <a 
            href="#home" 
            onClick={(e) => {
              handleLogoClick(e);
            }}
            className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#146B4A] rounded-lg cursor-pointer"
          >
            <LomstelLogo size="md" showTagline={false} />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-[#17211B]/80 hover:text-[#146B4A] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#146B4A] hover:after:w-full after:transition-all after:duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Zone: Social Media Icons & Order Basket Icon */}
          <div className="hidden sm:flex items-center gap-4">
            
            {/* Social Media Icons configured by Admin */}
            {activeSocialLinks.length > 0 && (
              <div className="flex items-center gap-2 pr-2 border-r border-[#EAF4EE]">
                {activeSocialLinks.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-[#EAF4EE] hover:bg-[#146B4A] text-slate-600 hover:text-white flex items-center justify-center transition-all duration-150 hover:scale-105"
                    title={item.name}
                    aria-label={item.name}
                  >
                    <SocialIcon platform={item.platform} className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}

            {/* Order Basket Icon Button replacing second order button */}
            <button
              onClick={() => onOpenOrderModal()}
              className="relative flex items-center gap-2 px-3.5 py-2.5 bg-[#146B4A] hover:bg-[#0B3D2E] active:scale-[0.98] text-white rounded-xl shadow-xs transition-all duration-150 group cursor-pointer"
              title="Open Order Basket / Checkout Form"
              aria-label="Order Basket"
            >
              <div className="relative">
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                <span className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full bg-[#D4A72C] ring-2 ring-[#146B4A]" />
              </div>
              <span className="text-xs font-bold tracking-wide">Basket</span>
            </button>
          </div>

          {/* Mobile Right Icons */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile Order Basket Icon */}
            <button
              onClick={() => onOpenOrderModal()}
              className="relative p-2 rounded-xl bg-[#146B4A] text-white shadow-xs"
              title="Order Basket"
              aria-label="Order Basket"
            >
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D4A72C]" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#17211B] hover:text-[#146B4A] hover:bg-[#EAF4EE] rounded-lg transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-full bg-white border-b border-[#EAF4EE] shadow-xl py-5 px-6 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-base font-medium text-[#17211B] hover:text-[#146B4A] py-2 border-b border-slate-100 last:border-b-0"
              >
                {link.name}
              </a>
            ))}
            
            <div className="pt-3 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openWhatsApp(WHATSAPP_MESSAGES.general);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-white bg-[#146B4A] hover:bg-[#0B3D2E] rounded-xl shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>ORDER ON WHATSAPP</span>
              </button>
              
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOrderModal();
                }}
                className="w-full py-2.5 px-4 text-sm font-medium text-[#146B4A] bg-[#EAF4EE] rounded-xl"
              >
                Open Quick Order Form
              </button>

              {/* Mobile Social Links */}
              {activeSocialLinks.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2 pb-1">
                  {activeSocialLinks.map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-[#EAF4EE] hover:bg-[#146B4A] text-slate-600 hover:text-white flex items-center justify-center transition-colors"
                      title={item.name}
                      aria-label={item.name}
                    >
                      <SocialIcon platform={item.platform} className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              )}
              
              <div className="pt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100">
                <span>Growing for a Better Tomorrow</span>
                <span className="text-[11px] text-slate-400">
                  NAFDAC: A8-121508L
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
