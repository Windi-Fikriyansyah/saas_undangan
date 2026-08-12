import React from 'react';
import { ElementorSettings } from '../types';

export const ElementorWeddingWelcome: React.FC<{ settings: ElementorSettings }> = ({ settings }) => {
  const title = settings.title || 'The Wedding Of';
  const groomName = settings.groom_name || 'Romeo';
  const brideName = settings.bride_name || 'Juliet';
  const andText = settings.and_text || '&';
  
  // Custom styling mappings based on Elementor settings if they exist
  const titleColor = settings.title_color || 'inherit';
  const namesColor = settings.names_color || 'inherit';

  return (
    <div className="elementor-wedding-welcome-wrapper w-full min-h-[50vh] flex flex-col items-center justify-center text-center p-8">
      <div className="welcome-content flex flex-col items-center gap-4">
        <h3 className="text-xl md:text-2xl font-medium tracking-widest uppercase text-gray-500" style={{ color: titleColor }}>
          {title}
        </h3>
        
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 my-6">
          <h1 className="text-4xl md:text-6xl font-serif" style={{ color: namesColor }}>
            {groomName}
          </h1>
          <span className="text-3xl font-serif text-brand-500 mx-2" style={{ color: namesColor }}>
            {andText}
          </span>
          <h1 className="text-4xl md:text-6xl font-serif" style={{ color: namesColor }}>
            {brideName}
          </h1>
        </div>

        <div className="guest-info mt-8">
          <p className="text-sm text-gray-500 mb-2">Kepada Yth. Bapak/Ibu/Saudara/i</p>
          <div className="font-semibold text-lg border-b border-gray-400 pb-1 px-8 inline-block">
            Nama Tamu
          </div>
        </div>
        
        <button className="mt-8 px-6 py-3 bg-brand-500 text-white rounded-full font-medium hover:bg-brand-600 transition-colors shadow-lg flex items-center gap-2">
          <i className="fas fa-envelope-open"></i> Buka Undangan
        </button>
      </div>
    </div>
  );
};
