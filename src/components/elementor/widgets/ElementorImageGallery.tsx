import React from 'react';
import { ElementorSettings } from '../types';

export const ElementorImageGallery: React.FC<{ settings: ElementorSettings }> = ({ settings }) => {
  const gallery = settings.gallery || [];
  if (!gallery || gallery.length === 0) return null;

  const columns = settings.gallery_columns || '4'; 
  
  // Map columns to Tailwind grid classes
  let gridClass = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  if (columns === '1') gridClass = 'grid-cols-1';
  if (columns === '2') gridClass = 'grid-cols-1 sm:grid-cols-2';
  if (columns === '3') gridClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  if (columns === '4') gridClass = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  if (columns === '5') gridClass = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';
  if (columns === '6') gridClass = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6';

  const spacingMap: any = {
    custom: 'gap-4',
    none: 'gap-0',
  };
  const gapClass = spacingMap[settings.gallery_spacing] || 'gap-4';

  return (
    <div className={`elementor-image-gallery-wrapper w-full`}>
      <div className={`grid ${gridClass} ${gapClass}`}>
        {gallery.map((image: any, index: number) => (
          <figure key={image.id || index} className="m-0 overflow-hidden relative">
            <img 
              src={image.url} 
              alt={`gallery-img-${index}`} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              style={{
                borderRadius: settings.border_radius?.size ? `${settings.border_radius.size}${settings.border_radius.unit || 'px'}` : undefined
              }}
            />
          </figure>
        ))}
      </div>
    </div>
  );
};
