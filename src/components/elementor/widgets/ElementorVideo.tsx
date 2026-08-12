import React from 'react';
import { ElementorSettings } from '../types';

export const ElementorVideo: React.FC<{ settings: ElementorSettings }> = ({ settings }) => {
  const videoType = settings.video_type || 'youtube';
  let src = '';

  if (videoType === 'youtube') {
    const url = settings.youtube_url || '';
    // Extract video ID from youtube URL
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
    const videoId = match ? match[1] : null;
    if (videoId) {
      src = `https://www.youtube.com/embed/${videoId}?controls=${settings.yt_controls === 'yes' ? 1 : 0}&mute=${settings.yt_mute === 'yes' ? 1 : 0}`;
    }
  } else if (videoType === 'vimeo') {
    const url = settings.vimeo_url || '';
    const match = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
    const videoId = match ? match[1] : null;
    if (videoId) {
      src = `https://player.vimeo.com/video/${videoId}`;
    }
  }

  if (!src) {
    return <div className="bg-gray-200 aspect-video flex items-center justify-center text-gray-500">Video Placeholder</div>;
  }

  const aspectRatio = settings.aspect_ratio || '169'; // 169, 219, 43, 32
  let aspectClass = 'aspect-video';
  if (aspectRatio === '43') aspectClass = 'aspect-[4/3]';
  if (aspectRatio === '11') aspectClass = 'aspect-square';
  if (aspectRatio === '916') aspectClass = 'aspect-[9/16]';
  if (aspectRatio === '219') aspectClass = 'aspect-[21/9]';

  return (
    <div className={`elementor-video-wrapper w-full ${aspectClass}`}>
      <iframe
        src={src}
        title="Video player"
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};
