import React, { useState } from 'react';
import { 
  Play, 
  ExternalLink, 
  Maximize2, 
  X, 
  CheckCircle2, 
  ShoppingBag,
  Film
} from 'lucide-react';
import { SiteSettings, VideoItem } from '../../types';
import { extractYouTubeId, getYouTubeEmbedUrl, getYouTubeThumbnailUrl, getYouTubeWatchUrl } from '../../utils/youtube';

interface VideoShowcaseSectionProps {
  settings: SiteSettings;
  onOpenOrderModal?: (productName?: string) => void;
}

export const VideoShowcaseSection: React.FC<VideoShowcaseSectionProps> = ({
  settings,
  onOpenOrderModal
}) => {
  const allVideos = settings.videos || [];
  const activeVideos = allVideos.filter(v => v.enabled);

  // Fallback to sample videos if none active
  const displayVideos: VideoItem[] = activeVideos.length > 0 ? activeVideos : [
    {
      id: 'vid-demo-1',
      title: 'How Fresh Oyster Mushrooms Are Cultivated & Harvested Daily',
      youtubeUrl: 'https://www.youtube.com/watch?v=F_fK8d6c7uE',
      category: 'Farm Tour & Harvest',
      description: 'Take a virtual tour through the controlled growing chambers at Lomstel Agro. See morning hand-harvesting at peak tenderness and humidity misting systems in action.',
      duration: '4:15',
      enabled: true,
      featured: true
    },
    {
      id: 'vid-demo-2',
      title: 'Culinary Masterclass: Gourmet Oyster Mushroom Pepper Soup & Stir-Fry',
      youtubeUrl: 'https://www.youtube.com/watch?v=Y_1e5Wf2oYw',
      category: 'Recipes & Culinary',
      description: 'Learn how to cook tender oyster mushrooms to perfection. Absorbs native herbs and peppers to create a savory, meat-like healthy delicacy.',
      duration: '6:30',
      enabled: true,
      featured: false
    },
    {
      id: 'vid-demo-3',
      title: 'Hygienic Sorting, Cleaning & Sealed Eco-Packaging Standards',
      youtubeUrl: 'https://www.youtube.com/watch?v=kGq_R1n7fS4',
      category: 'Packaging & Quality',
      description: 'Watch our strict sanitary packaging workflow. Every punnet is carefully inspected, weighed, and sealed to ensure maximum freshness from farm to table.',
      duration: '3:45',
      enabled: true,
      featured: false
    }
  ];

  // Active selected video for main player
  const [selectedVideoId, setSelectedVideoId] = useState<string>(() => {
    const featured = displayVideos.find(v => v.featured);
    return featured ? featured.id : displayVideos[0]?.id || '';
  });

  // State to track if current main player has initiated play
  const [isPlayingInPlace, setIsPlayingInPlace] = useState(false);

  // Fullscreen theater modal state
  const [theaterModalVideo, setTheaterModalVideo] = useState<VideoItem | null>(null);

  const currentVideo = displayVideos.find(v => v.id === selectedVideoId) || displayVideos[0];
  const currentYouTubeId = currentVideo ? extractYouTubeId(currentVideo.youtubeUrl) : null;

  const handleSelectVideo = (video: VideoItem) => {
    setSelectedVideoId(video.id);
    setIsPlayingInPlace(false);
  };

  const handleStartPlay = () => {
    setIsPlayingInPlace(true);
  };

  return (
    <section id="videos" className="py-20 bg-[#08281E] text-white relative overflow-hidden">
      {/* Background ambient radial glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#146B4A]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#D4A72C]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#D4A72C] text-xs font-bold uppercase tracking-widest backdrop-blur-sm mb-4 border border-white/10">
            <Film className="w-3.5 h-3.5" />
            <span>Farm & Culinary Showcase</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white mb-4">
            {settings.videoSectionHeadline || 'WATCH OUR FARM IN ACTION'}
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            {settings.videoSectionSubheadline || 
              'Experience how Lomstel Agro cultivates, harvests, and prepares premium oyster mushrooms with hygienic excellence.'}
          </p>
        </div>

        {/* Video Showcase Layout: Main Stage Player + Playlist Selector */}
        {currentVideo && currentYouTubeId ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
            
            {/* Main Stage Video Player (8 cols on lg) */}
            <div className="lg:col-span-8 bg-[#0B3D2E]/90 border border-white/10 rounded-3xl p-3 sm:p-4 shadow-2xl backdrop-blur-md">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/90 shadow-inner group">
                {isPlayingInPlace ? (
                  /* YouTube Iframe Player */
                  <iframe
                    src={getYouTubeEmbedUrl(currentYouTubeId, { autoplay: true, rel: false })}
                    title={currentVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  /* Video Thumbnail Preview Poster with Play Button */
                  <div className="relative w-full h-full">
                    {/* Poster Thumbnail */}
                    <img
                      src={getYouTubeThumbnailUrl(currentYouTubeId, 'maxres')}
                      alt={currentVideo.title}
                      onError={(e) => {
                        // Fallback to high quality if maxres isn't available on YouTube
                        (e.target as HTMLImageElement).src = getYouTubeThumbnailUrl(currentYouTubeId, 'hq');
                      }}
                      className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
                    />

                    {/* Dark gradient vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/30 group-hover:via-black/25 transition-colors" />

                    {/* Duration & Category Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                      {currentVideo.category && (
                        <span className="px-3 py-1 bg-[#146B4A]/90 backdrop-blur-md text-white text-xs font-bold rounded-lg uppercase tracking-wider border border-white/15">
                          {currentVideo.category}
                        </span>
                      )}
                      
                      <div className="flex items-center gap-2">
                        {currentVideo.duration && (
                          <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md text-white text-xs font-mono rounded-lg">
                            {currentVideo.duration}
                          </span>
                        )}
                        <button
                          onClick={() => setTheaterModalVideo(currentVideo)}
                          className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors cursor-pointer"
                          title="Open Fullscreen Theater View"
                          aria-label="Open Fullscreen Theater View"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Big Center Play Button with Aura */}
                    <button
                      onClick={handleStartPlay}
                      className="absolute inset-0 m-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#146B4A] hover:bg-[#1a855c] text-white flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer group-hover:ring-8 group-hover:ring-[#D4A72C]/40 focus:outline-none"
                      aria-label={`Play ${currentVideo.title}`}
                    >
                      <div className="absolute inset-0 rounded-full bg-[#D4A72C]/30 animate-ping opacity-75" />
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white text-white translate-x-1" />
                    </button>

                    {/* Bottom Metadata Overlay */}
                    <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-white z-10">
                      <h3 className="text-lg sm:text-2xl font-bold tracking-tight mb-2 drop-shadow-md">
                        {currentVideo.title}
                      </h3>
                      {currentVideo.description && (
                        <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 font-light max-w-2xl drop-shadow-xs">
                          {currentVideo.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Player Bottom Control Bar */}
              <div className="mt-4 pt-3 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-medium">
                    {isPlayingInPlace ? 'Now playing in preview' : 'Click play to start video'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={getYouTubeWatchUrl(currentVideo.youtubeUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#D4A72C] hover:text-[#e4bc4a] font-semibold transition-colors"
                  >
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => setTheaterModalVideo(currentVideo)}
                    className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white font-medium transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Theater Mode</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Video Playlist / Selector Sidebar (4 cols on lg) */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between px-1 mb-2">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                  Video Playlist ({displayVideos.length})
                </h4>
                <span className="text-xs text-[#D4A72C] font-medium">
                  Select to preview
                </span>
              </div>

              <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1 custom-scrollbar">
                {displayVideos.map((video, idx) => {
                  const isCurrent = video.id === currentVideo.id;
                  const ytId = extractYouTubeId(video.youtubeUrl);

                  return (
                    <div
                      key={video.id || idx}
                      onClick={() => handleSelectVideo(video)}
                      className={`group p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex gap-3.5 items-start ${
                        isCurrent 
                          ? 'bg-white/15 border-[#D4A72C] shadow-lg shadow-black/20 ring-1 ring-[#D4A72C]/50' 
                          : 'bg-[#0B3D2E]/60 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      {/* Mini Thumbnail */}
                      <div className="relative w-28 sm:w-32 aspect-video shrink-0 rounded-xl overflow-hidden bg-black/60 shadow-xs">
                        {ytId ? (
                          <img
                            src={getYouTubeThumbnailUrl(ytId, 'hq')}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500">
                            <Film className="w-6 h-6" />
                          </div>
                        )}
                        
                        {/* Play Icon Badge */}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/15 transition-colors">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                            isCurrent ? 'bg-[#D4A72C] text-[#08281E]' : 'bg-black/60 text-white group-hover:bg-[#146B4A]'
                          } transition-colors shadow-xs`}>
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </div>
                        </div>

                        {video.duration && (
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-[10px] font-mono text-white rounded">
                            {video.duration}
                          </span>
                        )}
                      </div>

                      {/* Video Info */}
                      <div className="flex-1 min-w-0 py-0.5">
                        <div className="flex items-center gap-1.5 mb-1">
                          {video.category && (
                            <span className="text-[10px] font-bold text-[#D4A72C] uppercase tracking-wider truncate">
                              {video.category}
                            </span>
                          )}
                          {isCurrent && (
                            <span className="inline-flex items-center text-[10px] font-bold text-emerald-400 gap-1 ml-auto">
                              <CheckCircle2 className="w-3 h-3" />
                              <span className="hidden sm:inline">Active</span>
                            </span>
                          )}
                        </div>

                        <h5 className={`text-xs font-bold line-clamp-2 transition-colors ${
                          isCurrent ? 'text-white' : 'text-slate-200 group-hover:text-white'
                        }`}>
                          {video.title}
                        </h5>

                        {video.description && (
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-1 font-light">
                            {video.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-12 bg-white/5 rounded-3xl border border-white/10 p-8 max-w-lg mx-auto">
            <Film className="w-12 h-12 text-[#D4A72C] mx-auto mb-3" />
            <p className="text-sm text-slate-300">
              No videos currently published. Add your YouTube video links in the Admin Dashboard to preview them here.
            </p>
          </div>
        )}

        {/* Video CTA Strip */}
        <div className="bg-gradient-to-r from-[#146B4A]/90 via-[#0B3D2E] to-[#146B4A]/90 border border-white/15 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xl font-bold text-white tracking-tight font-display">
              Ready to Taste the Freshness?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Order fresh or gourmet dried oyster mushrooms harvested daily under strict quality controls. Same-day & scheduled delivery available.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            {onOpenOrderModal && (
              <button
                onClick={() => onOpenOrderModal()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4A72C] hover:bg-[#e0b439] text-[#08281E] font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order Fresh Mushrooms</span>
              </button>
            )}

            <a
              href={settings.socialLinks?.find(s => s.platform === 'youtube')?.url || 'https://youtube.com/@lomstelagro'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors"
            >
              <span>Visit YouTube Channel</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>

      {/* Theater Mode Fullscreen Modal */}
      {theaterModalVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0B3D2E] border border-white/20 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#08281E]">
              <div className="flex items-center gap-2.5 truncate mr-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#D4A72C]" />
                <h3 className="text-sm sm:text-base font-bold text-white truncate">
                  {theaterModalVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setTheaterModalVideo(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
                aria-label="Close Theater View"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Viewport */}
            <div className="relative aspect-video w-full bg-black">
              {extractYouTubeId(theaterModalVideo.youtubeUrl) ? (
                <iframe
                  src={getYouTubeEmbedUrl(theaterModalVideo.youtubeUrl, { autoplay: true, rel: false })}
                  title={theaterModalVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                  Invalid YouTube link
                </div>
              )}
            </div>

            {/* Modal Footer Details */}
            <div className="p-5 sm:p-6 bg-[#08281E] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {theaterModalVideo.category && (
                    <span className="text-[11px] font-bold text-[#D4A72C] uppercase tracking-wider">
                      {theaterModalVideo.category}
                    </span>
                  )}
                  {theaterModalVideo.duration && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      · {theaterModalVideo.duration}
                    </span>
                  )}
                </div>
                {theaterModalVideo.description && (
                  <p className="text-xs sm:text-sm text-slate-300">
                    {theaterModalVideo.description}
                  </p>
                )}
              </div>

              <a
                href={getYouTubeWatchUrl(theaterModalVideo.youtubeUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#D4A72C] hover:bg-[#e0b439] text-[#08281E] text-xs font-bold rounded-xl shrink-0 transition-colors"
              >
                <span>Open in YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
