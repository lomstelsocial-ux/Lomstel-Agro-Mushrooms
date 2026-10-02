/**
 * YouTube Utility Helper for Lomstel Agro
 * Extracts video IDs, generates embed URLs, and retrieves high-res thumbnails.
 * Supports standard watch URLs, shortened youtu.be, shorts, embeds, and mobile links.
 */

export interface YouTubeInfo {
  videoId: string;
  embedUrl: string;
  thumbnailUrl: string;
  watchUrl: string;
}

export function extractYouTubeId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // If already an 11-character YouTube video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Common YouTube URL regex patterns
  const patterns = [
    // Standard watch URL: youtube.com/watch?v=ID or with other params
    /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})/i,
    // Shortened URL: youtu.be/ID
    /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/i,
    // Shorts: youtube.com/shorts/ID
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i,
    // Embed: youtube.com/embed/ID
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/i,
    // Live: youtube.com/live/ID
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/live\/([a-zA-Z0-9_-]{11})/i,
    // Generic fallback for any youtube url with 11-char ID
    /(?:youtube\.com|youtu\.be).*[?&/]([a-zA-Z0-9_-]{11})/i,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export function isValidYouTubeUrl(input: string): boolean {
  return Boolean(extractYouTubeId(input));
}

export function getYouTubeEmbedUrl(
  input: string, 
  options: { autoplay?: boolean; mute?: boolean; rel?: boolean } = {}
): string {
  const videoId = extractYouTubeId(input);
  if (!videoId) return '';

  const params = new URLSearchParams();
  params.set('rel', options.rel ? '1' : '0');
  params.set('modestbranding', '1');
  if (options.autoplay) params.set('autoplay', '1');
  if (options.mute) params.set('mute', '1');

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export function getYouTubeThumbnailUrl(
  input: string, 
  quality: 'maxres' | 'hq' | 'mq' | 'default' = 'hq'
): string {
  const videoId = extractYouTubeId(input);
  if (!videoId) return '';

  const qualityFilename = quality === 'maxres' ? 'maxresdefault.jpg' : 'hqdefault.jpg';
  return `https://img.youtube.com/vi/${videoId}/${qualityFilename}`;
}

export function getYouTubeWatchUrl(input: string): string {
  const videoId = extractYouTubeId(input);
  if (!videoId) return input;
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function parseYouTubeInfo(input: string): YouTubeInfo | null {
  const videoId = extractYouTubeId(input);
  if (!videoId) return null;

  return {
    videoId,
    embedUrl: getYouTubeEmbedUrl(videoId),
    thumbnailUrl: getYouTubeThumbnailUrl(videoId, 'hq'),
    watchUrl: getYouTubeWatchUrl(videoId)
  };
}
