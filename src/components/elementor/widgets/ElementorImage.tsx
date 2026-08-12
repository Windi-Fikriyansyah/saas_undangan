import React from 'react';
import { ElementorSettings } from '../types';

export const ElementorImage: React.FC<{ settings: ElementorSettings }> = ({ settings }) => {
  const imageUrl = settings.image?.url;
  if (!imageUrl) return null;

  const linkUrl = settings.link?.url;
  
  const imgElement = (
    <img 
      src={imageUrl} 
      alt={settings.image?.alt || ''} 
      className="max-w-full h-auto object-cover"
      style={{
        borderRadius: settings.border_radius ? `${settings.border_radius.top || 0}px ${settings.border_radius.right || 0}px ${settings.border_radius.bottom || 0}px ${settings.border_radius.left || 0}px` : undefined,
      }}
    />
  );

  if (linkUrl) {
    return (
      <a href={linkUrl} target={settings.link?.is_external ? '_blank' : '_self'}>
        {imgElement}
      </a>
    );
  }

  return imgElement;
};
