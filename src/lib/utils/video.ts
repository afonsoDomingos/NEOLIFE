/**
 * Extract YouTube Video ID from various URL formats
 */
export const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

/**
 * Get YouTube Embed URL from any video URL
 */
export const getEmbedUrl = (url: string): string => {
  if (!url) return '';
  const ytId = extractYouTubeId(url);
  if (ytId) {
    return `https://www.youtube.com/embed/${ytId}`;
  }
  // Vimeo support
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  return url;
};

/**
 * Get automatic thumbnail from YouTube if not provided
 */
export const getThumbnail = (videoUrl: string, customThumb?: string): string => {
  if (customThumb && customThumb.trim()) {
    return customThumb;
  }
  const ytId = extractYouTubeId(videoUrl);
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  }
  return 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=450&fit=crop';
};
