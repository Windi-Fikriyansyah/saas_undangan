import React from 'react';
import { ElementorSettings } from '../types';

export const ElementorGoogleMaps: React.FC<{ settings: ElementorSettings }> = ({ settings }) => {
  const address = settings.address || 'London Eye, London, United Kingdom';
  const zoom = settings.zoom?.size || 10;
  
  // Height handling
  const height = settings.height?.size ? `${settings.height.size}${settings.height.unit || 'px'}` : '300px';

  // Construct Google Maps embed URL
  const encodedAddress = encodeURIComponent(address);
  const src = `https://maps.google.com/maps?q=${encodedAddress}&t=m&z=${zoom}&output=embed&iwloc=near`;

  return (
    <div className="elementor-google-map-wrapper w-full" style={{ height }}>
      <iframe
        src={src}
        title={address}
        className="w-full h-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};
