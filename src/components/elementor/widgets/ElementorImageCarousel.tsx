import React from 'react';
import { ElementorSettings } from '../types';

export const ElementorImageCarousel: React.FC<{ settings: ElementorSettings }> = ({ settings }) => {
  const gallery = settings.carousel || [];
  if (!gallery || gallery.length === 0) return null;

  const slidesToScroll = settings.slides_to_scroll || '1';
  const slidesToShow = settings.slides_to_show || '3'; // Default in elementor is often 3 or 1
  
  // Calculate item width based on slidesToShow
  // If it's default, we just use a reasonable width or percentage
  let itemWidthClass = 'w-full';
  if (slidesToShow === '2') itemWidthClass = 'w-1/2';
  if (slidesToShow === '3') itemWidthClass = 'w-1/3';
  if (slidesToShow === '4') itemWidthClass = 'w-1/4';
  if (slidesToShow === '5') itemWidthClass = 'w-1/5';
  if (slidesToShow === '6') itemWidthClass = 'w-1/6';

  return (
    <div className="elementor-image-carousel-wrapper w-full relative">
      <div 
        className="elementor-image-carousel flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {gallery.map((image: any, index: number) => (
          <div 
            key={image.id || index} 
            className={`elementor-carousel-item snap-center shrink-0 flex items-center justify-center ${itemWidthClass}`}
            style={{ minWidth: slidesToShow === 'default' ? '300px' : undefined }}
          >
            <figure className="m-0">
              <img 
                src={image.url} 
                alt={`carousel-img-${index}`} 
                className="max-w-full h-auto object-cover rounded"
                style={{
                  borderRadius: settings.border_radius?.size ? `${settings.border_radius.size}${settings.border_radius.unit || 'px'}` : undefined
                }}
              />
            </figure>
          </div>
        ))}
      </div>
      {/* Basic styling for hidden scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
};
