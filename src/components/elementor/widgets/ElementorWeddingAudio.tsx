"use client";

import React, { useState, useRef } from 'react';
import { ElementorSettings } from '../types';

export const ElementorWeddingAudio: React.FC<{ settings: ElementorSettings }> = ({ settings }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Usually audio widget settings have 'audio_url' or similar
  const audioUrl = settings.audio_url?.url || settings.audio?.url || ''; 
  
  if (!audioUrl) return null;

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const positionMap: any = {
    bottom_right: 'bottom-4 right-4',
    bottom_left: 'bottom-4 left-4',
    top_right: 'top-4 right-4',
    top_left: 'top-4 left-4',
  };
  const positionClass = positionMap[settings.position] || 'bottom-4 right-4';

  const bgColor = settings.background_color || '#ffffff';
  const iconColor = settings.icon_color || '#333333';

  return (
    <div className={`elementor-wedding-audio-wrapper fixed z-50 ${positionClass}`}>
      <button 
        onClick={togglePlay}
        className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
        style={{ backgroundColor: bgColor }}
        aria-label="Toggle Audio"
      >
        {isPlaying ? (
          <svg className="w-5 h-5" style={{ color: iconColor }} fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg className="w-5 h-5" style={{ color: iconColor }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      
      <audio 
        ref={audioRef}
        src={audioUrl}
        loop={settings.loop !== 'no'} // Default to loop unless explicitly 'no'
        className="hidden"
      />
    </div>
  );
};
