import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  ExternalLink
} from 'lucide-react';
import { LomstelLogo } from '../common/LomstelLogo';
import { SocialIcon } from '../common/SocialIcon';
import { SiteSettings } from '../../types';
import { openWhatsApp, WHATSAPP_MESSAGES, DISPLAY_PHONE, SECONDARY_PHONE } from '../../utils/whatsapp';

interface FooterProps {
  settings: SiteSettings;
  onOpenAdmin: () => void;
  onOpenOrderModal: (productName?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin, onOpenOrderModal }) => {
  const activeSocialLinks = (settings.socialLinks || []).filter((s) => s.enabled);

  return (
    <footer className="bg-[#07271D] text-white pt-16 pb-12 border-t border-[#146B4A]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <LomstelLogo size="lg" variant="light" showTagline={true} />
            
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              Lomstel Agro is an African agricultural business focused on cultivating, processing, packaging and supplying quality oyster mushrooms to households, restaurants, hotels, supermarkets and caterers.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#D4A72C] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#9EE114]" />
              <span>NAFDAC REG. NO.: {settings.nafdacReg}</span>
            </div>

            {/* Dynamic Social Icons */}
            {activeSocialLinks.length > 0 && (
              <div className="flex flex-wrap items-center gap-2.5 pt-3">
                {activeSocialLinks.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    title={s.name}
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#146B4A] hover:text-white text-slate-300 flex items-center justify-center transition-all duration-150 hover:scale-105"
                  >
                    <SocialIcon platform={s.platform} className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-4 font-display">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <a href="#home" className="hover:text-[#9EE114] transition-colors">Home</a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#9EE114] transition-colors">About Lomstel Agro</a>
              </li>
              <li>
                <a href="#products" className="hover:text-[#9EE114] transition-colors">Our Mushrooms</a>
              </li>
              <li>
                <a href="#nutrition" className="hover:text-[#9EE114] transition-colors">Nutritional Benefits</a>
              </li>
              <li>
                <a href="#facility" className="hover:text-[#9EE114] transition-colors">Growing Facility</a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#9EE114] transition-colors">Farm Gallery</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#9EE114] transition-colors">FAQ</a>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-4 font-display">
              Products
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <button 
                  onClick={() => openWhatsApp(WHATSAPP_MESSAGES.fresh)}
                  className="hover:text-[#9EE114] transition-colors text-left"
                >
                  Fresh Oyster Mushrooms
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openWhatsApp(WHATSAPP_MESSAGES.dried)}
                  className="hover:text-[#9EE114] transition-colors text-left"
                >
                  Dried Oyster Mushrooms
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openWhatsApp(WHATSAPP_MESSAGES.wholesale)}
                  className="hover:text-[#9EE114] transition-colors text-left"
                >
                  Wholesale & Bulk Supply
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openWhatsApp(WHATSAPP_MESSAGES.hospitality)}
                  className="hover:text-[#9EE114] transition-colors text-left"
                >
                  Restaurant & Hotel Supply
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenOrderModal()}
                  className="text-xs text-[#D4A72C] hover:underline font-semibold mt-2 block"
                >
                  Open Order Form &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-4 font-display">
              Contact
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#9EE114] shrink-0 mt-0.5" />
                <span>35, Ewuosho Street, off Aiyetoro Road, Kanuyi, Ogun State, Nigeria</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#9EE114] shrink-0" />
                <span className="font-mono">{DISPLAY_PHONE}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#9EE114] shrink-0" />
                <span className="font-mono">{SECONDARY_PHONE}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#9EE114] shrink-0" />
                <span>lomstelsocial@gmail.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#9EE114] shrink-0" />
                <a href={settings.mainWebsite} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  www.lomstel.com
                </a>
              </p>
            </div>
          </div>

        </div>

        {/* Sub-Footer Copyright & Regulatory Notes */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="text-left text-slate-400 hover:text-slate-300 transition-colors cursor-pointer select-none"
              title="Lomstel Agro Nigeria"
            >
              © 2026 Lomstel Agro. All Rights Reserved. “Growing for a Better Tomorrow.”
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              type="button"
              onClick={onOpenAdmin}
              className="text-slate-400 hover:text-slate-300 cursor-pointer transition-colors"
              title="NAFDAC Registration"
            >
              NAFDAC REG. NO.: {settings.nafdacReg}
            </button>
            <span>·</span>
            <span>Hygienically Cultivated in Ogun State, Nigeria</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
