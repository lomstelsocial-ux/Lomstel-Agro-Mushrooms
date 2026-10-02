import React, { useEffect } from 'react';
import { X, Tag, ExternalLink } from 'lucide-react';
import { GalleryItem } from '../../types';

interface LightboxModalProps {
  item: GalleryItem | null;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ item, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl w-full max-h-[90vh] flex flex-col bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
          aria-label="Close image lightbox"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Display */}
        <div className="flex-1 overflow-hidden flex items-center justify-center bg-black/50 min-h-[350px] max-h-[70vh]">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-contain max-h-[70vh]"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Caption & Metadata Bar */}
        <div className="p-6 bg-slate-900 text-white border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#146B4A] text-white">
                {item.category}
              </span>
            </div>
            <h3 className="text-lg font-bold font-display text-white">
              {item.title}
            </h3>
            {item.caption && (
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {item.caption}
              </p>
            )}
          </div>

          <div className="shrink-0 text-right">
            <span className="text-xs text-slate-400">Lomstel Agro Visual Archives</span>
          </div>
        </div>
      </div>
    </div>
  );
};
